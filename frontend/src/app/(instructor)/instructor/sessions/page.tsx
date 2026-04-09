"use client";

import { Session, SessionStatus } from "@/types/session";
import React, { useState } from "react";
import { useSessions } from "@/hooks/useSessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Calendar, Video, Users, Clock, Filter, Star, Play, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/utils";
import { dmSans } from "@/lib/config/fonts";
import Image from "next/image";
import Link from "next/link";

function SessionCard({
  session,
  showActions,
  onEdit,
  onViewAnalytics,
}: {
  session: Session;
  isBooked?: boolean;
  showActions?: boolean;
  onEdit?: () => void;
  onViewAnalytics?: () => void;
}) {
  const isLive = session.status === "LIVE";
  const isPast = new Date(session.scheduledAt).getTime() < Date.now();
  const isGroup = session.type === "GROUP";
  const formattedDate = new Date(session.scheduledAt).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all">
      <div className="relative aspect-[16/9]">
        <Image
          src={session.imageUrl || "/assets/images/cards/default-session.png"}
          alt={session.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        {isLive && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
            LIVE
          </Badge>
        )}
        <Badge className={`absolute top-3 right-3 border-0 text-[10px] ${isGroup ? "bg-purple-500/90 text-white" : "bg-blue-500/90 text-white"}`}>
          {isGroup ? "Group" : "1-on-1"}
        </Badge>
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>{formattedDate}</span>
          <span className="ml-auto">{session._count?.bookings || 0} booked</span>
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
          {session.title}
        </h3>
        <div className="text-sm font-medium">
          {session.isFree ? (
            <span className="text-green-600">Free</span>
          ) : (
            <span>{session.currency} {session.price}</span>
          )}
        </div>
        {showActions && (
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={onViewAnalytics}>
              Analytics
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CreatedSessions() {
  const router = useRouter();
  const { sessions, isLoading } = useSessions();
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const filteredAndSortedSessions = sessions
    .filter((session) => {
      if (filter === "all") return true;
      return session.status === filter.toUpperCase();
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sortBy === "popular") {
        return (b._count?.bookings || 0) - (a._count?.bookings || 0);
      }
      return 0;
    });

  const stats = {
    total: sessions.length,
    upcoming: sessions.filter((s) => s.status === "UPCOMING").length,
    live: sessions.filter((s) => s.status === "LIVE").length,
    completed: sessions.filter((s) => (s.status as string) === "COMPLETED").length,
  };

  const SessionSkeleton = () => (
    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className={`${dmSans.className} text-3xl font-bold text-zinc-900 dark:text-white`}>
                Live Sessions
              </h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Manage and host your live teaching sessions
              </p>
            </div>
            <Button
              onClick={() => router.push("/instructor/sessions/create")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Create Session
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Total Sessions
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Upcoming
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                {stats.upcoming}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Live Now
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                {stats.live}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Completed
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mb-6 flex items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant={filter === "all" ? "default" : "outline"}
              className={cn(
                "cursor-pointer",
                filter === "all" &&
                  "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
              )}
              onClick={() => setFilter("all")}
            >
              All ({stats.total})
            </Badge>
            <Badge
              variant={filter === "upcoming" ? "default" : "outline"}
              className={cn(
                "cursor-pointer",
                filter === "upcoming" &&
                  "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300"
              )}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming ({stats.upcoming})
            </Badge>
            <Badge
              variant={filter === "live" ? "default" : "outline"}
              className={cn(
                "cursor-pointer",
                filter === "live" &&
                  "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300"
              )}
              onClick={() => setFilter("live")}
            >
              Live ({stats.live})
            </Badge>
            <Badge
              variant={filter === "completed" ? "default" : "outline"}
              className={cn(
                "cursor-pointer",
                filter === "completed" &&
                  "bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300"
              )}
              onClick={() => setFilter("completed")}
            >
              Completed ({stats.completed})
            </Badge>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sessions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SessionSkeleton key={i} />
            ))}
          </div>
        ) : filteredAndSortedSessions.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isBooked={false}
                showActions={true}
                onEdit={() =>
                  router.push(`/instructor/sessions/${session.id}/edit`)
                }
                onViewAnalytics={() =>
                  router.push(`/instructor/sessions/${session.id}/analytics`)
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white py-12 dark:border-zinc-600 dark:bg-zinc-800">
            <Video className="h-12 w-12 text-zinc-400" />
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
              No sessions found
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {filter === "all"
                ? "Get started by creating your first live session."
                : `No ${filter} sessions found.`}
            </p>
            {filter === "all" && (
              <Button
                onClick={() => router.push("/instructor/sessions/create")}
                className="mt-4"
              >
                Create Your First Session
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatedSessions;
