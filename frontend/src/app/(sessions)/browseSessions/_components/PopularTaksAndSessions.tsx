"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Users,
  Star,
  Play,
  TrendingUp,
  Zap,
  Eye,
  Heart,
  Share2,
  BookmarkPlus,
  Video,
  Mic,
  Globe,
  Lock,
  Crown,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import { useUserStore } from "@/zustand/userStore";
import { UserSubscription } from "@/types/subscription.types";


// Define proper types for the session data
interface Session {
  id: string;
  title: string;
  instructor: {
    name: string;
    avatar: string;
    rating: number;
    students: number;
  };
  category: string;
  price: number;
  originalPrice: number;
  duration: string;
  attendees: number;
  maxAttendees: number;
  isLive: boolean;
  isTrending: boolean;
  image: string;
  description: string;
  tags: string[];
  requiresSubscription: boolean;
}

// Mock data for popular sessions
const popularSessions: Session[] = [
  {
    id: "1",
    title: "Advanced React Patterns",
    instructor: {
      name: "Sarah Johnson",
      avatar: "/images/user/user-01.png",
      rating: 4.9,
      students: 1247,
    },
    category: "Development",
    price: 0, // Free
    originalPrice: 29,
    duration: "2h 15m",
    attendees: 156,
    maxAttendees: 200,
    isLive: true,
    isTrending: true,
    image: "/images/cards/cards-01.png",
    description: "Master advanced React patterns and best practices",
    tags: ["React", "JavaScript", "Frontend"],
    requiresSubscription: false,
  },
  {
    id: "2",
    title: "AI & Machine Learning Fundamentals",
    instructor: {
      name: "Dr. Michael Chen",
      avatar: "/images/user/user-02.png",
      rating: 4.8,
      students: 892,
    },
    category: "AI/ML",
    price: 15,
    originalPrice: 49,
    duration: "3h 30m",
    attendees: 89,
    maxAttendees: 150,
    isLive: false,
    isTrending: true,
    image: "/images/cards/cards-02.png",
    description: "Learn the fundamentals of AI and machine learning",
    tags: ["AI", "Machine Learning", "Python"],
    requiresSubscription: true,
  },
  {
    id: "3",
    title: "Digital Marketing Masterclass",
    instructor: {
      name: "Emma Rodriguez",
      avatar: "/images/user/user-03.png",
      rating: 4.7,
      students: 2156,
    },
    category: "Marketing",
    price: 25,
    originalPrice: 79,
    duration: "4h 45m",
    attendees: 234,
    maxAttendees: 300,
    isLive: true,
    isTrending: false,
    image: "/images/cards/cards-03.png",
    description: "Master digital marketing strategies and techniques",
    tags: ["Marketing", "SEO", "Social Media"],
    requiresSubscription: true,
  },
  {
    id: "4",
    title: "Data Science Bootcamp",
    instructor: {
      name: "Alex Thompson",
      avatar: "/images/user/user-04.png",
      rating: 4.9,
      students: 1678,
    },
    category: "Data Science",
    price: 0, // Free for subscribers
    originalPrice: 99,
    duration: "6h 20m",
    attendees: 445,
    maxAttendees: 500,
    isLive: false,
    isTrending: true,
    image: "/images/cards/cards-01.png",
    description: "Complete data science bootcamp from scratch",
    tags: ["Data Science", "Python", "Statistics"],
    requiresSubscription: true,
  },
];

const categories = [
  { name: "All", count: popularSessions.length },
  { name: "Development", count: 1 },
  { name: "AI/ML", count: 1 },
  { name: "Marketing", count: 1 },
  { name: "Data Science", count: 1 },
];

export default function PopularTalksAndSessions() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userSubscription, setUserSubscription] =
    useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // const subscription = await getUserSubscriptionPlan(user.user.id);
        // setUserSubscription(subscription);
      } catch (error) {
        console.error(
          "Error fetching subscription, using default state:",
          error
        );
        // Set default state when backend is not available
        setUserSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user?.id]);

  const filteredSessions =
    selectedCategory === "All"
      ? popularSessions
      : popularSessions.filter(
          (session) => session.category === selectedCategory
        );

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Today&apos;s Popular Talks & Sessions
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Join live sessions and learn from industry experts
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            View All
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Zap className="h-4 w-4" />
            Join Live
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.name
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {category.name}
            <span className="ml-2 text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSessions.map((session, index) => (
          <SessionCard
            key={session.id}
            session={session}
            index={index}
            userSubscription={userSubscription}
          />
        ))}
      </div>
    </div>
  );
}

interface SessionCardProps {
  session: Session;
  index: number;
  userSubscription: UserSubscription | null;
}

const SessionCard = ({
  session,
  index,
  userSubscription,
}: SessionCardProps) => {
  const canAccessSession = (sessionData: Session) => {
    if (!sessionData.requiresSubscription) return true;
    return false;
    // checkSubscriptionAccess(userSubscription, "sessions");
  };

  const handleSessionClick = (sessionData: Session) => {
    if (!canAccessSession(sessionData)) {
      // Redirect to subscription page or show upgrade modal
      window.location.href = "/subscription";
      return;
    }

    // Handle session enrollment/booking
    console.log("Enrolling in session:", sessionData.id);
  };

  return (
    <motion.div
      key={session.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-800">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <div className="aspect-video relative">
            <Image
              src={session.image}
              alt={session.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Live Indicator */}
            {session.isLive && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            )}

            {/* Trending Badge */}
            {session.isTrending && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                🔥 Trending
              </div>
            )}

            {/* Subscription Lock */}
            {session.requiresSubscription && !canAccessSession(session) && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white dark:bg-zinc-800 rounded-full p-3">
                  <Lock className="h-6 w-6 text-zinc-600" />
                </div>
              </div>
            )}

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 dark:bg-zinc-800/90 rounded-full p-3">
                <Play className="h-6 w-6 text-zinc-900 dark:text-white" />
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Category */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {session.category}
            </Badge>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-xs font-medium">
                {session.instructor.rating}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-zinc-900 dark:text-white mb-2 line-clamp-2">
            {session.title}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={session.instructor.avatar} />
              <AvatarFallback>{session.instructor.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {session.instructor.name}
            </span>
          </div>

          {/* Session Info */}
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {session.duration}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {session.attendees}/{session.maxAttendees}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {session.price === 0 ? (
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  Free
                </span>
              ) : (
                <>
                  <span className="text-zinc-900 dark:text-white font-semibold">
                    ${session.price}
                  </span>
                  {session.originalPrice > session.price && (
                    <span className="text-zinc-500 line-through text-sm">
                      ${session.originalPrice}
                    </span>
                  )}
                </>
              )}
            </div>

            {session.requiresSubscription && (
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Crown className="h-3 w-3" />
                <span className="text-xs">Pro</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={() => handleSessionClick(session)}
            className={`w-full gap-2 text-white tracking-tight ${
              session.requiresSubscription && !canAccessSession(session)
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                : "bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            }`}
          >
            {session.requiresSubscription && !canAccessSession(session) ? (
              <>
                <Crown className="h-4 w-4" />
                Upgrade to Join
              </>
            ) : session.isLive ? (
              <>
                <Play className="h-4 w-4" />
                Join Live
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4" />
                Book Session
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
