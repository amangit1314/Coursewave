"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  Star,
  BookOpen,
  DollarSign,
  User,
  MessageCircle,
  Share2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { sessionService } from "@/lib/api/services/sessionsService";
import { useUserStore } from "@/zustand/userStore";
import type { Session } from "@/types/session";

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const { isLoggedIn } = useUserStore();

  const [session, setSession] = useState<Session | null>(null);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">
              {error || "Session not found"}
            </h2>
            <Button onClick={() => router.push("/browseSessions")}>
              Browse Sessions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedDate = new Date(session.scheduledAt).toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric" }
  );
  const formattedTime = new Date(session.scheduledAt).toLocaleTimeString(
    "en-US",
    { hour: "2-digit", minute: "2-digit" }
  );

  const isLive = session.status === "LIVE";
  const isUpcoming = session.status === "UPCOMING";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {session.title}
                </h1>
                {isLive && (
                  <Badge className="bg-red-600 text-white animate-pulse">
                    LIVE
                  </Badge>
                )}
                {isUpcoming && (
                  <Badge variant="secondary">Upcoming</Badge>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Hosted by {session.instructor?.user?.name || "Instructor"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Session Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {session.description}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formattedDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formattedTime} ({session.duration} min)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {session.type === "ONE_TO_ONE"
                        ? "1-on-1 Session"
                        : `Group Session (${session._count?.bookings || 0} booked)`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Online Meeting
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {session.isFree ? (
                      <Badge className="bg-green-600 text-white text-lg px-4 py-1">
                        Free
                      </Badge>
                    ) : (
                      `$${session.price}`
                    )}
                  </div>
                  {!session.isFree && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      per session
                    </div>
                  )}
                </div>

                {/* Action buttons based on status */}
                <div className="space-y-2">
                  {isLive && (
                    <Link
                      href={`/browseSessions/${sessionId}/meet`}
                      className="w-full inline-flex justify-center items-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Live Now
                    </Link>
                  )}

                  {isUpcoming && (
                    <>
                      <Link
                        href={`/browseSessions/${sessionId}/payment`}
                        className="w-full inline-flex justify-center items-center px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-md font-medium transition-colors"
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        {session.isFree ? "Book Free Session" : "Book Now"}
                      </Link>
                      <Link
                        href={`/browseSessions/${sessionId}/schedule`}
                        className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md font-medium transition-colors"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </Link>
                    </>
                  )}
                </div>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {session._count?.bookings || 0} people booked
                </div>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            {session.instructor && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Instructor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden">
                      {session.instructor.user?.profileImageUrl ? (
                        <img
                          src={session.instructor.user.profileImageUrl}
                          alt={session.instructor.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {session.instructor.user?.name}
                      </h3>
                    </div>
                  </div>

                  {session.instructor.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {session.instructor.bio}
                    </p>
                  )}

                  {session.instructor.expertise &&
                    session.instructor.expertise.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Expertise
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {session.instructor.expertise.map(
                            (skill: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
