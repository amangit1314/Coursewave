"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Video, Users, Calendar, Clock, Star, MapPin,
  Loader2, Filter, ChevronRight, BookOpen, LogIn, GraduationCap, AlertCircle, RotateCcw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { sessionService } from "@/lib/api/services/sessionsService";
import type { Session } from "@/types/session";

export default function BrowseSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");

  const fetchSessions = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await sessionService.getSessions();
      if (res.success && res.data) {
        setSessions(Array.isArray(res.data) ? res.data : []);
      }
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const filtered = sessions.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.instructor?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "one-on-one" && s.type === "ONE_TO_ONE") ||
      (typeFilter === "group" && s.type === "GROUP");
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "free" && s.isFree) ||
      (priceFilter === "paid" && !s.isFree);
    return matchesSearch && matchesType && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center gap-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  Live right now
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Learn from experts,{" "}
                <span className="text-blue-200">live</span>
              </h1>
              <p className="text-blue-100 text-base sm:text-lg max-w-lg mb-8">
                1-on-1 mentorship or group sessions with video, chat,
                whiteboard, and screen sharing — all in one place.
              </p>

              {/* How it works — a real sequence, not decoration */}
              <div className="flex items-center flex-wrap gap-x-2 gap-y-3 text-sm">
                {[
                  { icon: BookOpen, label: "Book a slot" },
                  { icon: LogIn, label: "Join the call" },
                  { icon: GraduationCap, label: "Walk away sharper" },
                ].map((step, i, arr) => (
                  <React.Fragment key={step.label}>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white pl-2 pr-3 py-1.5 rounded-full">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px] font-semibold">
                        {i + 1}
                      </span>
                      <step.icon className="h-3.5 w-3.5 text-blue-100" />
                      <span className="font-medium">{step.label}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-white/40 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            {/* Signature: a live "on air" console — distinct from the roadmap/community hero visuals */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="hidden lg:flex flex-1 justify-end"
            >
              <div className="relative w-64 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-1.5 text-white text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                    ON AIR
                  </span>
                  <Video className="h-4 w-4 text-white/60" />
                </div>
                <div className="space-y-2">
                  {[70, 45, 85].map((width, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-white/20 shrink-0" />
                      <div className="h-2 rounded-full bg-white/20" style={{ width: `${width}%` }} />
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
                  <span className="text-white/70 text-xs">Whiteboard synced</span>
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sessions or instructors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-gray-50 dark:bg-zinc-800">
                  <SelectValue placeholder="Session Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="one-on-one">1-on-1</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full sm:w-36 bg-gray-50 dark:bg-zinc-800">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Sessions Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {searchQuery || typeFilter !== "all" || priceFilter !== "all"
                  ? `${filtered.length} session${filtered.length !== 1 ? "s" : ""} found`
                  : "Available Sessions"}
              </h2>
              {!searchQuery && typeFilter === "all" && priceFilter === "all" && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Browse upcoming live sessions
                </p>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : loadError ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Couldn't load sessions
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Something went wrong reaching the server. Try again.
              </p>
              <Button onClick={fetchSessions} variant="outline" size="sm">
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Retry
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState hasFilters={searchQuery !== "" || typeFilter !== "all" || priceFilter !== "all"} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((session, i) => (
                <SessionCard key={session.id} session={session} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SessionCard({ session, index }: { session: Session; index: number }) {
  const isLive = session.status === "LIVE";
  const isStartingSoon =
    new Date(session.scheduledAt).getTime() - Date.now() < 30 * 60 * 1000 &&
    new Date(session.scheduledAt).getTime() > Date.now();
  const isGroup = session.type === "GROUP";

  const formattedDate = new Date(session.scheduledAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedTime = new Date(session.scheduledAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/browseSessions/${session.id}`}>
        <Card className="group h-full overflow-hidden border border-gray-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-200 bg-white dark:bg-zinc-900">
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-zinc-800">
            {session.imageUrl ? (
              <Image
                src={session.imageUrl}
                alt={session.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
                <Video className="h-10 w-10 text-blue-400/40" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              {isLive && (
                <Badge className="bg-red-500 text-white border-0 text-[10px] px-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1" />
                  LIVE
                </Badge>
              )}
              {isStartingSoon && !isLive && (
                <Badge className="bg-amber-500 text-white border-0 text-[10px] px-2">
                  Starting Soon
                </Badge>
              )}
              <Badge
                variant="outline"
                className={`border-0 text-[10px] px-2 ${
                  isGroup
                    ? "bg-purple-500/90 text-white"
                    : "bg-blue-500/90 text-white"
                }`}
              >
                {isGroup ? "Group" : "1-on-1"}
              </Badge>
            </div>

            {/* Price badge */}
            <div className="absolute bottom-3 right-3">
              <Badge
                className={`border-0 text-xs font-semibold ${
                  session.isFree
                    ? "bg-green-500 text-white"
                    : "bg-white/90 dark:bg-zinc-900/90 text-gray-900 dark:text-white backdrop-blur-sm"
                }`}
              >
                {session.isFree ? "Free" : `$${session.price}`}
              </Badge>
            </div>
          </div>

          <CardContent className="p-4 space-y-3">
            {/* Date/time row */}
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formattedTime}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {session.duration}m
              </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {session.title}
            </h3>

            {/* Instructor */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {session.instructor?.user?.name || "Instructor"}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {session._count?.bookings || 0} booked
              </span>
            </div>

            {/* CTA */}
            <div className="pt-1">
              {isLive ? (
                <div className="w-full py-2 text-center text-sm font-medium text-white bg-red-500 rounded-lg">
                  Join Live
                </div>
              ) : (
                <div className="w-full py-2 text-center text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                  View Details
                  <ChevronRight className="inline h-3.5 w-3.5 ml-0.5" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Video className="h-7 w-7 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {hasFilters ? "No matching sessions" : "No sessions available"}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {hasFilters
          ? "Try adjusting your filters or search terms"
          : "Check back soon for new live sessions"}
      </p>
    </div>
  );
}
