"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, Clock, Users, Video, Play, CheckCircle,
  Loader2, CalendarDays, History, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { sessionService } from "@/lib/api/services/sessionsService";
import { useUserStore } from "@/zustand/userStore";

type TabValue = "upcoming" | "past";

interface BookedSession {
  id: string;
  sessionId: string;
  paymentStatus: string;
  session: {
    id: string;
    title: string;
    status: string;
    type: string;
    scheduledAt: string;
    duration: number;
    isFree: boolean;
    price?: number;
    instructor: {
      user: { name: string; profileImageUrl?: string };
    };
    _count?: { bookings: number };
  };
}

export default function MySessionsPage() {
  const { isLoggedIn } = useUserStore();
  const [tab, setTab] = useState<TabValue>("upcoming");
  const [upcomingSessions, setUpcomingSessions] = useState<BookedSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        const res = await sessionService.getMyUpcomingSessions();
        if (res.success && res.data) {
          setUpcomingSessions(Array.isArray(res.data) ? res.data : []);
        }
      } catch {
        // API not available
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [isLoggedIn]);

  // Split sessions into upcoming and past based on scheduledAt
  const now = new Date();
  const upcoming = upcomingSessions.filter(
    (b) => new Date(b.session.scheduledAt).getTime() >= now.getTime() || b.session.status === "LIVE"
  );
  const past = upcomingSessions.filter(
    (b) => new Date(b.session.scheduledAt).getTime() < now.getTime() && b.session.status !== "LIVE"
  );

  const activeSessions = tab === "upcoming" ? upcoming : past;

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="max-w-sm w-full">
          <CardContent className="p-8 text-center space-y-4">
            <CalendarDays className="h-10 w-10 text-gray-400 mx-auto" />
            <h2 className="text-lg font-semibold">Sign in to see your sessions</h2>
            <p className="text-sm text-gray-500">
              Book and manage your upcoming and past sessions
            </p>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Sessions
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your booked sessions
            </p>
          </div>
          <Link href="/browseSessions">
            <Button variant="outline" size="sm">
              Browse More
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Tab toggle */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-zinc-900 rounded-xl w-fit mb-8">
          <button
            onClick={() => setTab("upcoming")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "upcoming"
                ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Upcoming
            {upcoming.length > 0 && (
              <span className="ml-1 text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                {upcoming.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("past")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "past"
                ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <History className="h-3.5 w-3.5" />
            Past
            {past.length > 0 && (
              <span className="ml-1 text-xs bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full">
                {past.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : activeSessions.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <div className="space-y-3">
            {activeSessions.map((booking, i) => (
              <SessionRow key={booking.id} booking={booking} tab={tab} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SessionRow({
  booking,
  tab,
  index,
}: {
  booking: BookedSession;
  tab: TabValue;
  index: number;
}) {
  const s = booking.session;
  const isLive = s.status === "LIVE";
  const isGroup = s.type === "GROUP";
  const isPast = tab === "past";

  const scheduledDate = new Date(s.scheduledAt);
  const now = new Date();
  const diffMs = scheduledDate.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const timeLabel = isPast
    ? scheduledDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : diffMs < 0
    ? "Now"
    : diffDays > 0
    ? `In ${diffDays}d`
    : diffHours > 0
    ? `In ${diffHours}h`
    : "Soon";

  const formattedDate = scheduledDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const formattedTime = scheduledDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {isPast ? (
                  <Badge variant="secondary" className="text-[10px]">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                ) : isLive ? (
                  <Badge className="bg-red-500 text-white border-0 text-[10px]">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1" />
                    LIVE
                  </Badge>
                ) : (
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {timeLabel}
                  </span>
                )}
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    isGroup
                      ? "border-purple-300 text-purple-600 dark:border-purple-700 dark:text-purple-400"
                      : "border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400"
                  }`}
                >
                  {isGroup ? "Group" : "1-on-1"}
                </Badge>
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {s.title}
              </h3>

              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formattedTime}
                </span>
                <span>{s.duration}m</span>
                <span>{s.instructor?.user?.name}</span>
              </div>
            </div>

            <div className="flex-shrink-0">
              {isLive && !isPast ? (
                <Link href={`/browseSessions/${s.id}/meet`}>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                    <Play className="h-3.5 w-3.5 mr-1.5" />
                    Join Now
                  </Button>
                </Link>
              ) : (
                <Link href={`/browseSessions/${s.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyState({ tab }: { tab: TabValue }) {
  const isUpcoming = tab === "upcoming";
  return (
    <div className="text-center py-16">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isUpcoming
            ? "bg-blue-50 dark:bg-blue-500/10"
            : "bg-gray-100 dark:bg-zinc-800"
        }`}
      >
        {isUpcoming ? (
          <CalendarDays className="h-7 w-7 text-blue-400" />
        ) : (
          <History className="h-7 w-7 text-gray-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {isUpcoming ? "No upcoming sessions" : "No past sessions yet"}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        {isUpcoming
          ? "Browse available sessions and book your first one"
          : "Your completed sessions will appear here"}
      </p>
      <Link href="/browseSessions">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Browse Sessions
        </Button>
      </Link>
    </div>
  );
}
