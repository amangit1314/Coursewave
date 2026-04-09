"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Users, Shield,
  Loader2, AlertCircle, MonitorUp, MessageSquare, Pencil,
  LayoutGrid, Hand, Settings, Clock, ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserStore } from "@/zustand/userStore";
import { sessionService } from "@/lib/api/services/sessionsService";
import type { Session } from "@/types/session";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

type MeetState = "loading" | "pre-join" | "in-meeting" | "ended" | "error";

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const { user, isLoggedIn } = useUserStore();

  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [meetState, setMeetState] = useState<MeetState>("loading");
  const [error, setError] = useState("");
  const [roomId, setRoomId] = useState("");
  const [sessionData, setSessionData] = useState<any>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [participantCount, setParticipantCount] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [meetingStarted, setMeetingStarted] = useState(false);

  // Fetch session data and prepare room
  useEffect(() => {
    if (!isLoggedIn) {
      setError("Please log in to join this session.");
      setMeetState("error");
      return;
    }

    const init = async () => {
      try {
        const res = await sessionService.getSessionById(sessionId);
        if (res.success && res.data) {
          setSessionData(res.data);
        }

        const joinRes = await sessionService.joinSession(sessionId);
        const room = joinRes?.data?.rtcRoomId || `coursewave-${sessionId.slice(0, 8)}`;
        setRoomId(room);
        setMeetState("pre-join");
      } catch {
        setRoomId(`coursewave-${sessionId.slice(0, 8)}`);
        setMeetState("pre-join");
      }
    };
    init();
  }, [sessionId, isLoggedIn]);

  // Camera preview
  useEffect(() => {
    if (meetState !== "pre-join") return;

    const startPreview = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoOn,
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        // Camera not available
      }
    };

    if (isVideoOn) {
      startPreview();
    } else {
      stopPreview();
    }

    return () => stopPreview();
  }, [meetState, isVideoOn]);

  const stopPreview = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  // Meeting timer
  useEffect(() => {
    if (!meetingStarted) return;
    const interval = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => clearInterval(interval);
  }, [meetingStarted]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
      : `${m}:${String(sec).padStart(2, "0")}`;
  };

  const loadJitsiScript = (): Promise<void> =>
    new Promise((resolve, reject) => {
      if (window.JitsiMeetExternalAPI) return resolve();
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Jitsi"));
      document.head.appendChild(script);
    });

  const handleJoinMeeting = useCallback(async () => {
    stopPreview();
    setMeetState("in-meeting");

    try {
      await loadJitsiScript();
    } catch {
      setError("Failed to load meeting service. Please try again.");
      setMeetState("error");
      return;
    }

    if (!jitsiContainerRef.current || !window.JitsiMeetExternalAPI) return;

    const isHost = sessionData?.instructorId === user?.id;
    const isGroup = sessionData?.type === "GROUP";

    const api = new window.JitsiMeetExternalAPI("meet.jit.si", {
      roomName: roomId,
      parentNode: jitsiContainerRef.current,
      width: "100%",
      height: "100%",
      userInfo: {
        displayName: user?.name || "Guest",
        email: user?.email || "",
      },
      configOverwrite: {
        startWithAudioMuted: !isMicOn,
        startWithVideoMuted: !isVideoOn,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        enableClosePage: false,
        enableWelcomePage: false,
        requireDisplayName: true,
        enableLobby: isGroup && isHost,
        toolbarButtons: [
          "microphone", "camera", "desktop", "chat",
          "raisehand", "participants-pane", "tileview",
          "hangup", "fullscreen", "whiteboard",
          "select-background", "settings", "closedcaptions",
          "shareaudio", "noisesuppression", "security",
          ...(isHost ? ["mute-everyone", "recording"] : []),
        ],
        whiteboard: {
          enabled: true,
          collabServerBaseUrl: "https://excalidraw-backend.fly.dev",
        },
        breakoutRooms: { hideAddRoomButton: !isHost, hideAutoAssignButton: !isHost },
        notifications: [],
        hideConferenceSubject: true,
        hideConferenceTimer: false,
        disableModeratorIndicator: false,
        ...(isGroup && isHost
          ? { lobby: { autoKnock: false, enableChat: true } }
          : {}),
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        TOOLBAR_ALWAYS_VISIBLE: true,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
        FILM_STRIP_MAX_HEIGHT: 120,
        TILE_VIEW_MAX_COLUMNS: 5,
        DEFAULT_REMOTE_DISPLAY_NAME: "Participant",
        SHOW_CHROME_EXTENSION_BANNER: false,
      },
    });

    jitsiApiRef.current = api;
    setMeetingStarted(true);

    api.addEventListener("participantJoined", () =>
      setParticipantCount((p) => p + 1)
    );
    api.addEventListener("participantLeft", () =>
      setParticipantCount((p) => Math.max(1, p - 1))
    );
    api.addEventListener("readyToClose", () => {
      setMeetState("ended");
      setMeetingStarted(false);
    });
  }, [roomId, isMicOn, isVideoOn, sessionData, user]);

  const handleLeaveMeeting = useCallback(() => {
    jitsiApiRef.current?.dispose();
    jitsiApiRef.current = null;
    setMeetState("ended");
    setMeetingStarted(false);
  }, []);

  const handleGoBack = () => router.push(`/browseSessions/${sessionId}`);

  const isGroup = sessionData?.type === "GROUP";
  const isHost = sessionData?.instructorId === user?.id;
  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "G";

  // ─── LOADING ───
  if (meetState === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin mx-auto" />
            <Video className="h-6 w-6 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-zinc-400 text-sm">Preparing your session...</p>
        </div>
      </div>
    );
  }

  // ─── ERROR ───
  if (meetState === "error") {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <Card className="bg-zinc-900 border-zinc-800 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-5">
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Unable to Join</h2>
            <p className="text-zinc-400 text-sm">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleGoBack} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Go Back
              </Button>
              {!isLoggedIn && (
                <Button onClick={() => router.push("/login")} className="bg-blue-600 hover:bg-blue-700">
                  Log In
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── ENDED ───
  if (meetState === "ended") {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <Card className="bg-zinc-900 border-zinc-800 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <PhoneOff className="h-7 w-7 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Session Ended</h2>
            <p className="text-zinc-400 text-sm">
              You were in the session for {formatTime(elapsed)}
            </p>
            {sessionData && (
              <p className="text-zinc-500 text-xs">{sessionData.title}</p>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" onClick={handleGoBack} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Session Details
              </Button>
              <Button onClick={() => router.push("/browseSessions")} className="bg-blue-600 hover:bg-blue-700">
                Browse Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── PRE-JOIN LOBBY ───
  if (meetState === "pre-join") {
    return (
      <TooltipProvider>
        <div className="h-screen flex flex-col bg-zinc-950 text-white">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <Clock className="h-3.5 w-3.5" />
              {sessionData?.duration || 60} min session
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Camera preview - takes 3 cols */}
                <div className="md:col-span-3">
                  <div className="relative bg-zinc-900 rounded-2xl aspect-video overflow-hidden border border-zinc-800">
                    {isVideoOn ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover mirror"
                        style={{ transform: "scaleX(-1)" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-3xl font-bold">{initials}</span>
                        </div>
                      </div>
                    )}

                    {/* Status badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {!isMicOn && (
                        <div className="bg-red-500/90 backdrop-blur-sm rounded-full p-1.5">
                          <MicOff className="h-3.5 w-3.5" />
                        </div>
                      )}
                      {!isVideoOn && (
                        <div className="bg-red-500/90 backdrop-blur-sm rounded-full p-1.5">
                          <VideoOff className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Name tag */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <span className="text-sm font-medium">{user?.name || "Guest"}</span>
                    </div>
                  </div>

                  {/* Controls below preview */}
                  <div className="flex justify-center gap-3 mt-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setIsMicOn(!isMicOn)}
                          className={`p-3.5 rounded-full transition-all ${
                            isMicOn
                              ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                        >
                          {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>{isMicOn ? "Mute" : "Unmute"}</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setIsVideoOn(!isVideoOn)}
                          className={`p-3.5 rounded-full transition-all ${
                            isVideoOn
                              ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                        >
                          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>{isVideoOn ? "Turn off camera" : "Turn on camera"}</TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Session info panel - takes 2 cols */}
                <div className="md:col-span-2 flex flex-col justify-center space-y-5">
                  <div>
                    <h1 className="text-2xl font-bold leading-tight">
                      {sessionData?.title || "Live Session"}
                    </h1>
                    {sessionData?.instructor?.user?.name && (
                      <p className="text-zinc-400 text-sm mt-1.5">
                        with {sessionData.instructor.user.name}
                      </p>
                    )}
                  </div>

                  {/* Session type badge */}
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={`border-0 ${
                        isGroup
                          ? "bg-purple-500/15 text-purple-300"
                          : "bg-blue-500/15 text-blue-300"
                      }`}
                    >
                      {isGroup ? (
                        <>
                          <Users className="h-3 w-3 mr-1" />
                          Group Session
                        </>
                      ) : (
                        <>
                          <Video className="h-3 w-3 mr-1" />
                          1-on-1 Session
                        </>
                      )}
                    </Badge>
                    {isHost && (
                      <Badge variant="outline" className="border-0 bg-amber-500/15 text-amber-300">
                        <Shield className="h-3 w-3 mr-1" />
                        Host
                      </Badge>
                    )}
                  </div>

                  {/* Features list */}
                  <div className="space-y-2.5 text-sm text-zinc-400">
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="h-4 w-4 text-zinc-500" />
                      <span>In-meeting chat</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MonitorUp className="h-4 w-4 text-zinc-500" />
                      <span>Screen sharing</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Pencil className="h-4 w-4 text-zinc-500" />
                      <span>Collaborative whiteboard</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <LayoutGrid className="h-4 w-4 text-zinc-500" />
                      <span>Tile & speaker view</span>
                    </div>
                    {isGroup && (
                      <div className="flex items-center gap-2.5">
                        <Hand className="h-4 w-4 text-zinc-500" />
                        <span>Raise hand & reactions</span>
                      </div>
                    )}
                    {isGroup && isHost && (
                      <div className="flex items-center gap-2.5">
                        <Shield className="h-4 w-4 text-zinc-500" />
                        <span>Lobby & moderator controls</span>
                      </div>
                    )}
                  </div>

                  {/* Join button */}
                  <Button
                    onClick={handleJoinMeeting}
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold rounded-xl"
                  >
                    Join Now
                  </Button>

                  <p className="text-center text-[11px] text-zinc-600">
                    End-to-end encrypted &middot; Powered by Jitsi Meet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  // ─── IN MEETING ───
  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-zinc-950">
        {/* Floating header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
          <div className="flex items-center justify-between px-4 py-3 pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium truncate max-w-[200px] sm:max-w-xs">
                  {sessionData?.title || "Live Session"}
                </span>
              </div>
              <Badge variant="outline" className="border-zinc-700 text-zinc-300 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(elapsed)}
              </Badge>
              <Badge variant="outline" className="border-zinc-700 text-zinc-300 text-xs">
                <Users className="h-3 w-3 mr-1" />
                {participantCount}
              </Badge>
            </div>

            <Button
              onClick={handleLeaveMeeting}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-4"
            >
              <PhoneOff className="h-4 w-4 mr-1.5" />
              Leave
            </Button>
          </div>
        </div>

        {/* Jitsi container */}
        <div ref={jitsiContainerRef} className="flex-1 w-full" />
      </div>
    </TooltipProvider>
  );
}
