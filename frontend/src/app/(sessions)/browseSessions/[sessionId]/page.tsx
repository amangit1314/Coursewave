"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar, Clock, Users, Video, Star, DollarSign, User,
  Share2, Loader2, AlertCircle, Shield, Monitor, MessageSquare,
  Pencil, ChevronLeft, CheckCircle, Globe,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { sessionService } from "@/lib/api/services/sessionsService";
import type { Session } from "@/types/session";

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await sessionService.getSessionById(sessionId);
        if (res.success && res.data) {
          setSession(res.data);
        } else {
          setError("Session not found.");
        }
      } catch {
        setError("Failed to load session.");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="max-w-sm w-full">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <h2 className="text-lg font-semibold">{error || "Session not found"}</h2>
            <Button onClick={() => router.push("/browseSessions")} size="sm">
              Browse Sessions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedDate = new Date(session.scheduledAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = new Date(session.scheduledAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const isLive = session.status === "LIVE";
  const isUpcoming = session.status === "UPCOMING";
  const isGroup = session.type === "GROUP";
  const bookingCount = session._count?.bookings || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Back nav */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <button
          onClick={() => router.push("/browseSessions")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to sessions
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                {isLive && (
                  <Badge className="bg-red-500 text-white border-0">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1" />
                    LIVE NOW
                  </Badge>
                )}
                {isUpcoming && (
                  <Badge variant="secondary" className="text-xs">Upcoming</Badge>
                )}
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    isGroup
                      ? "border-purple-300 text-purple-600 dark:border-purple-700 dark:text-purple-300"
                      : "border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-300"
                  }`}
                >
                  {isGroup ? (
                    <><Users className="h-3 w-3 mr-1" /> Group Session</>
                  ) : (
                    <><User className="h-3 w-3 mr-1" /> 1-on-1 Session</>
                  )}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {session.title}
              </h1>

              {/* Instructor inline */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                  {session.instructor?.user?.name?.[0] || "I"}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.instructor?.user?.name || "Instructor"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Session Host</p>
                </div>
              </div>
            </motion.div>

            {/* Details Card */}
            <Card>
              <CardContent className="p-6 space-y-5">
                {session.description && (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {session.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <InfoItem icon={Calendar} label="Date" value={formattedDate} />
                  <InfoItem icon={Clock} label="Time" value={`${formattedTime} (${session.duration} min)`} />
                  <InfoItem
                    icon={Users}
                    label="Type"
                    value={isGroup ? `Group (${bookingCount} booked)` : "Private 1-on-1"}
                  />
                  <InfoItem icon={Globe} label="Location" value="Online Meeting" />
                </div>
              </CardContent>
            </Card>

            {/* What's included */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  What&apos;s included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Video, label: "HD video & audio call" },
                    { icon: Monitor, label: "Screen sharing" },
                    { icon: Pencil, label: "Collaborative whiteboard" },
                    { icon: MessageSquare, label: "In-meeting chat" },
                    ...(isGroup
                      ? [
                          { icon: Shield, label: "Moderator controls" },
                          { icon: Users, label: "Lobby & permissions" },
                        ]
                      : []),
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-4 w-4 text-blue-500" />
                      </div>
                      {item.label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructor bio */}
            {session.instructor?.bio && (
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    About the instructor
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {session.instructor.bio}
                  </p>
                  {session.instructor.expertise?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {session.instructor.expertise.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Booking Card */}
            <Card className="sticky top-24 border-2 border-blue-100 dark:border-blue-900/50">
              <CardContent className="p-6 space-y-5">
                {/* Price */}
                <div className="text-center">
                  {session.isFree ? (
                    <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-500/10 px-4 py-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        Free Session
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${session.price}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                        / session
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span>Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(session.scheduledAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span>Time</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formattedTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span>Duration</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {session.duration} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span>Booked</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {bookingCount} people
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-zinc-800" />

                {/* Actions */}
                <div className="space-y-2.5">
                  {isLive && (
                    <Link href={`/browseSessions/${sessionId}/meet`} className="block">
                      <Button className="w-full bg-red-500 hover:bg-red-600 text-white h-11">
                        <Video className="h-4 w-4 mr-2" />
                        Join Live Now
                      </Button>
                    </Link>
                  )}

                  {isUpcoming && (
                    <>
                      <Link href={`/browseSessions/${sessionId}/payment`} className="block">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11">
                          <DollarSign className="h-4 w-4 mr-2" />
                          {session.isFree ? "Book Free Session" : "Book Now"}
                        </Button>
                      </Link>
                      <Link href={`/browseSessions/${sessionId}/schedule`} className="block">
                        <Button variant="outline" className="w-full h-11">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                {isGroup && (
                  <p className="text-[11px] text-center text-gray-400 dark:text-gray-500">
                    Group sessions require host approval to join
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Share */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-gray-500"
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share this session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-gray-500" />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
