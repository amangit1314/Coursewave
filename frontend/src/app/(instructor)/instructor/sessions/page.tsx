// import { SessionCard } from "@/app/(sessions)/browseSessions/_components/SessionCard";
// import { Session } from "@/types/session";
// import React from "react";

// function CreatedSessions() {
//   const dummySession: Session = {
//     id: "session_dummy_id",
//     title: "Intro to Full-Stack Development",
//     description:
//       "A demo session for learning how to build full-stack apps with Next.js.",
//     imageUrl: "/assets/images/cover/cover-01.png", // or null
//     status: "UPCOMING", // 'UPCOMING' | 'LIVE' | 'ENDED'
//     type: "GROUP", // 'ONE_TO_ONE' | 'GROUP'
//     rtcType: "WEBRTC", // 'WEBRTC' | 'ZOOM' | 'GOOGLE_MEET'
//     rtcRoomId: "dummy_room_id",
//     rtcToken: "dummy_rtc_token",
//     rtcConfig: null, // or {} if you want
//     isFree: false,
//     price: 49,
//     currency: "USD",
//     scheduledAt: new Date().toISOString(),
//     duration: 60, // in minutes
//     endsAt: new Date(Date.now() + 60 * 60000).toISOString(), // scheduledAt + 1 hour
//     instructorId: "instructor_dummy_id",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),

//     instructor: {
//       id: "instructor_dummy_id",
//       userId: "user_dummy_id",
//       bio: "Expert in web development and teaching.",
//       expertise: ["Next.js", "TypeScript", "React"],
//       socialLinks: {
//         twitter: "https://twitter.com/dummy",
//         linkedin: "https://linkedin.com/in/dummy",
//       },
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       user: {
//         name: "John Doe",
//         profileImageUrl: null,
//       },
//     },

//     _count: {
//       bookings: 10,
//     },
//   };

//   return (
//     <div className="mx-12 pt-[80px]">
//       <div className="grid h-full w-full grid-cols-4 gap-4 rounded-xl bg-gray-200 p-8 dark:bg-gray-700">
//         <SessionCard
//           // sessionImage={"/assets/images/cover/cover-01.png"}
//           // sessionName={"Webinar on building a course website"}
//           // instructor={"Aman Soni"}
//           session={dummySession}
//           isBooked={false}
//         />
//         {/* <SessionCard />
//           <SessionCard />
//           <SessionCard />
//           <SessionCard />
//           <SessionCard /> */}
//       </div>
//     </div>
//   );
// }

// export default CreatedSessions;

/// ============================================================

"use client";

import { SessionCard } from "@/app/(sessions)/browseSessions/_components/SessionCard";
import { Session, SessionStatus } from "@/types/session";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Video, Users, Clock, Filter } from "lucide-react";
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

function CreatedSessions() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Mock data - replace with actual API call
  const dummySessions: Session[] = [
    {
      id: "session_1",
      title: "Intro to Full-Stack Development",
      description:
        "A demo session for learning how to build full-stack apps with Next.js.",
      imageUrl: "/assets/images/cover/cover-01.png",
      status: "UPCOMING",
      type: "GROUP",
      rtcType: "WEBRTC",
      rtcRoomId: "dummy_room_id_1",
      rtcToken: "dummy_rtc_token_1",
      rtcConfig: null,
      isFree: false,
      price: 49,
      currency: "USD",
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      duration: 60,
      endsAt: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
      instructorId: "instructor_dummy_id",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      instructor: {
        id: "instructor_dummy_id",
        userId: "user_dummy_id",
        bio: "Expert in web development and teaching.",
        expertise: ["Next.js", "TypeScript", "React"],
        socialLinks: {
          twitter: "https://twitter.com/dummy",
          linkedin: "https://linkedin.com/in/dummy",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          name: "John Doe",
          profileImageUrl: null,
        },
      },
      _count: {
        bookings: 10,
      },
    },
    {
      id: "session_2",
      title: "Advanced React Patterns Workshop",
      description: "Deep dive into advanced React patterns and best practices.",
      imageUrl: "/assets/images/cover/cover-02.png",
      status: "LIVE",
      type: "ONE_TO_ONE",
      rtcType: "WEBRTC",
      rtcRoomId: "dummy_room_id_2",
      rtcToken: "dummy_rtc_token_2",
      rtcConfig: null,
      isFree: true,
      price: 0,
      currency: "USD",
      scheduledAt: new Date().toISOString(),
      duration: 90,
      endsAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
      instructorId: "instructor_dummy_id",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      instructor: {
        id: "instructor_dummy_id",
        userId: "user_dummy_id",
        bio: "Expert in web development and teaching.",
        expertise: ["Next.js", "TypeScript", "React"],
        socialLinks: {
          twitter: "https://twitter.com/dummy",
          linkedin: "https://linkedin.com/in/dummy",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          name: "John Doe",
          profileImageUrl: null,
        },
      },
      _count: {
        bookings: 5,
      },
    },
    {
      id: "session_3",
      title: "TypeScript Masterclass",
      description: "Complete TypeScript guide from basics to advanced topics.",
      imageUrl: "/assets/images/cover/cover-03.png",
      status: "COMPLETED" as SessionStatus,
      type: "GROUP",
      rtcType: "WEBRTC",
      rtcRoomId: "dummy_room_id_3",
      rtcToken: "dummy_rtc_token_3",
      rtcConfig: null,
      isFree: false,
      price: 79,
      currency: "USD",
      scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      duration: 120,
      endsAt: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000
      ).toISOString(),
      instructorId: "instructor_dummy_id",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      instructor: {
        id: "instructor_dummy_id",
        userId: "user_dummy_id",
        bio: "Expert in web development and teaching.",
        expertise: ["Next.js", "TypeScript", "React"],
        socialLinks: {
          twitter: "https://twitter.com/dummy",
          linkedin: "https://linkedin.com/in/dummy",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          name: "John Doe",
          profileImageUrl: null,
        },
      },
      _count: {
        bookings: 25,
      },
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        // const response = await fetch('/api/instructor/sessions');
        // const data = await response.json();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSessions(dummySessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

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
    completed: sessions.filter((s) => s.status === "COMPLETED" as SessionStatus).length,
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
        {/* <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
        </div> */}

         <div className="mb-6 flex  items-start justify-between gap-4 sm:flex-row sm:items-center">
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
