"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Users,
  MessageSquare,
  Clock,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserStore } from "@/zustand/userStore";
import { sessionService } from "@/lib/api/services/sessionsService";

type MeetState = "loading" | "pre-join" | "in-meeting" | "ended" | "error";

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const { user, isLoggedIn } = useUserStore();

  const [meetState, setMeetState] = useState<MeetState>("loading");
  const [error, setError] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [sessionTitle, setSessionTitle] = useState<string>("");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [jitsiLoaded, setJitsiLoaded] = useState(false);

  // Fetch session details and join
  useEffect(() => {
    if (!isLoggedIn) {
      setError("Please log in to join this session.");
      setMeetState("error");
      return;
    }

    const fetchSessionAndJoin = async () => {
      try {
        // First get session details
        const sessionRes = await sessionService.getSessionById(sessionId);
        if (!sessionRes.success || !sessionRes.data) {
          setError("Session not found.");
          setMeetState("error");
          return;
        }

        setSessionTitle(sessionRes.data.title);

        // Try to join the session
        const joinRes = await sessionService.joinSession(sessionId);
        if (joinRes.success && joinRes.data) {
          const room =
            joinRes.data.rtcRoomId ||
            `coursewave-${sessionId.slice(0, 8)}`;
          setRoomId(room);
          setMeetState("pre-join");
        } else {
          // If join fails, still allow pre-join with generated room ID
          // (for free sessions or sessions where booking is implicit)
          const room =
            sessionRes.data.rtcRoomId ||
            `coursewave-${sessionId.slice(0, 8)}`;
          setRoomId(room);
          setError(joinRes.message || "");
          setMeetState("pre-join");
        }
      } catch (err: any) {
        // Fallback: allow joining with generated room name
        setRoomId(`coursewave-${sessionId.slice(0, 8)}`);
        setMeetState("pre-join");
      }
    };

    fetchSessionAndJoin();
  }, [sessionId, isLoggedIn]);

  const handleJoinMeeting = useCallback(() => {
    setMeetState("in-meeting");
    setJitsiLoaded(false);
  }, []);

  const handleLeaveMeeting = useCallback(() => {
    setMeetState("ended");
  }, []);

  const handleGoBack = useCallback(() => {
    router.push(`/browseSessions/${sessionId}`);
  }, [router, sessionId]);

  // Build Jitsi iframe URL with config
  const jitsiUrl = roomId
    ? `https://meet.jit.si/${encodeURIComponent(roomId)}#config.startWithAudioMuted=${!isMicOn}&config.startWithVideoMuted=${!isVideoOn}&config.prejoinPageEnabled=false&config.disableDeepLinking=true&config.toolbarButtons=["microphone","camera","closedcaptions","desktop","chat","raisehand","participants-pane","tileview","hangup","fullscreen"]&userInfo.displayName=${encodeURIComponent(user?.name || "Guest")}`
    : "";

  // Loading state
  if (meetState === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-900 text-white">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-500" />
          <p className="text-lg">Preparing your session...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (meetState === "error") {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-900 text-white">
        <Card className="bg-zinc-800 border-zinc-700 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">Unable to Join</h2>
            <p className="text-zinc-400">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleGoBack}>
                Back to Session
              </Button>
              {!isLoggedIn && (
                <Button onClick={() => router.push("/login")}>
                  Log In
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Meeting ended state
  if (meetState === "ended") {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-900 text-white">
        <Card className="bg-zinc-800 border-zinc-700 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
              <PhoneOff className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold">Session Ended</h2>
            <p className="text-zinc-400">
              You have left the meeting. Thank you for attending!
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleGoBack}>
                Back to Session
              </Button>
              <Button onClick={() => router.push("/browseSessions")}>
                Browse Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pre-join lobby
  if (meetState === "pre-join") {
    return (
      <TooltipProvider>
        <div className="h-screen flex items-center justify-center bg-zinc-900 text-white">
          <Card className="bg-zinc-800 border-zinc-700 max-w-lg w-full mx-4">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Ready to Join?</h1>
                <p className="text-zinc-400 text-sm">
                  {sessionTitle || "Live Session"}
                </p>
                {error && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-600/20 text-yellow-400"
                  >
                    {error}
                  </Badge>
                )}
              </div>

              {/* Preview area */}
              <div className="bg-zinc-700 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <div className="w-20 h-20 bg-zinc-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold">
                      {user?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "G"}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300">
                    {user?.name || "Guest"}
                  </p>
                </div>

                {/* Status indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {!isVideoOn && (
                    <Badge
                      variant="destructive"
                      className="text-xs flex items-center gap-1"
                    >
                      <VideoOff className="h-3 w-3" /> Camera Off
                    </Badge>
                  )}
                  {!isMicOn && (
                    <Badge
                      variant="destructive"
                      className="text-xs flex items-center gap-1"
                    >
                      <MicOff className="h-3 w-3" /> Muted
                    </Badge>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`p-4 rounded-full ${
                        isMicOn
                          ? "bg-zinc-700 hover:bg-zinc-600"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {isMicOn ? (
                        <Mic className="h-5 w-5" />
                      ) : (
                        <MicOff className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isMicOn ? "Mute" : "Unmute"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      className={`p-4 rounded-full ${
                        isVideoOn
                          ? "bg-zinc-700 hover:bg-zinc-600"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {isVideoOn ? (
                        <Video className="h-5 w-5" />
                      ) : (
                        <VideoOff className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isVideoOn ? "Turn Off Camera" : "Turn On Camera"}
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Join button */}
              <Button
                onClick={handleJoinMeeting}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
                size="lg"
              >
                Join Meeting
              </Button>

              <p className="text-center text-xs text-zinc-500">
                Powered by Jitsi Meet — free, open-source, and encrypted
              </p>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    );
  }

  // In-meeting state — Jitsi iframe
  return (
    <div className="h-screen flex flex-col bg-zinc-900 text-white">
      {/* Minimal header */}
      <div className="bg-zinc-800 border-b border-zinc-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <h1 className="text-sm font-medium truncate max-w-xs">
            {sessionTitle || "Live Session"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  window.open(jitsiUrl, "_blank", "noopener,noreferrer")
                }
                className="p-2 hover:bg-zinc-700 text-zinc-400"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open in New Tab</TooltipContent>
          </Tooltip>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLeaveMeeting}
            className="bg-red-600 hover:bg-red-700 text-white px-4"
          >
            <PhoneOff className="h-4 w-4 mr-2" />
            Leave
          </Button>
        </div>
      </div>

      {/* Jitsi iframe */}
      <div className="flex-1 relative">
        {!jitsiLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
              <p className="text-zinc-400">Connecting to meeting...</p>
            </div>
          </div>
        )}
        <iframe
          src={jitsiUrl}
          allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
          className="w-full h-full border-0"
          onLoad={() => setJitsiLoaded(true)}
        />
      </div>
    </div>
  );
}
