"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Star,
  Calendar,
  Clock,
  MapPin,
  Award,
  Eye,
  MessageSquare,
  BookOpen,
  Code2,
  Palette,
  LineChart,
  Megaphone,
  Brain,
  Zap,
  Crown,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Enhanced coach data with more details
const coaches = [
  {
    id: "1",
    name: "Sarah Johnson",
    image: "/assets/images/user/user-01.png",
    profession: "Senior Software Engineer",
    company: "Google",
    about:
      "10+ years of experience in full-stack development. Expert in React, Node.js, and cloud architecture. Former tech lead at Google.",
    rating: 4.9,
    totalSessions: 156,
    totalStudents: 1247,
    hourlyRate: 85,
    categories: ["Development", "Programming"],
    expertise: ["React", "Node.js", "TypeScript", "AWS"],
    availability: "Available",
    isVerified: true,
    isFeatured: true,
    languages: ["English", "Spanish"],
    experience: "10+ years",
  },
  {
    id: "2",
    name: "Michael Chen",
    image: "/assets/images/user/user-02.png",
    profession: "UX Design Lead",
    company: "Apple",
    about:
      "Former designer at Google and Apple. Specializing in user research, product design systems, and design thinking methodologies.",
    rating: 4.8,
    totalSessions: 98,
    totalStudents: 892,
    hourlyRate: 95,
    categories: ["Design", "UX/UI"],
    expertise: ["Figma", "User Research", "Design Systems", "Prototyping"],
    availability: "Available",
    isVerified: true,
    isFeatured: false,
    languages: ["English", "Mandarin"],
    experience: "8+ years",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    image: "/assets/images/user/user-03.png",
    profession: "Marketing Strategist",
    company: "Meta",
    about:
      "Digital marketing expert with focus on growth hacking, SEO optimization, and social media strategy. Helped scale 50+ startups.",
    rating: 4.9,
    totalSessions: 124,
    totalStudents: 2156,
    hourlyRate: 75,
    categories: ["Marketing", "Business"],
    expertise: ["SEO", "Social Media", "Growth Hacking", "Analytics"],
    availability: "Available",
    isVerified: true,
    isFeatured: true,
    languages: ["English", "Spanish"],
    experience: "6+ years",
  },
  {
    id: "4",
    name: "David Kim",
    image: "/assets/images/user/user-04.png",
    profession: "Product Manager",
    company: "Microsoft",
    about:
      "Experienced in leading product teams at startups and enterprise companies. Expert in product strategy and agile methodologies.",
    rating: 4.7,
    totalSessions: 87,
    totalStudents: 678,
    hourlyRate: 90,
    categories: ["Business", "Product"],
    expertise: ["Product Strategy", "Agile", "User Stories", "Roadmapping"],
    availability: "Limited",
    isVerified: true,
    isFeatured: false,
    languages: ["English", "Korean"],
    experience: "7+ years",
  },
  {
    id: "5",
    name: "Lisa Wang",
    image: "/assets/images/user/user-05.png",
    profession: "Data Science Expert",
    company: "Netflix",
    about:
      "PhD in Machine Learning from Stanford. Specializes in AI, predictive analytics, and building scalable ML systems.",
    rating: 4.9,
    totalSessions: 143,
    totalStudents: 1678,
    hourlyRate: 120,
    categories: ["Data Science", "AI/ML"],
    expertise: ["Python", "TensorFlow", "Deep Learning", "Statistics"],
    availability: "Available",
    isVerified: true,
    isFeatured: true,
    languages: ["English", "Mandarin"],
    experience: "12+ years",
  },
  {
    id: "6",
    name: "Alex Thompson",
    image: "/assets/images/user/user-01.png",
    profession: "DevOps Engineer",
    company: "Amazon",
    about:
      "Cloud infrastructure specialist with expertise in AWS, Kubernetes, and CI/CD pipelines. Helped optimize costs for 100+ companies.",
    rating: 4.8,
    totalSessions: 112,
    totalStudents: 945,
    hourlyRate: 100,
    categories: ["Development", "DevOps"],
    expertise: ["AWS", "Kubernetes", "Docker", "Terraform"],
    availability: "Available",
    isVerified: true,
    isFeatured: false,
    languages: ["English"],
    experience: "9+ years",
  },
];

const categories = [
  { name: "All", count: coaches.length, icon: Users },
  { name: "Development", count: 2, icon: Code2 },
  { name: "Design", count: 1, icon: Palette },
  { name: "Marketing", count: 1, icon: Megaphone },
  { name: "Business", count: 2, icon: LineChart },
  { name: "Data Science", count: 1, icon: Brain },
];

export const MeetOurCoaches = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCoaches =
    selectedCategory === "All"
      ? coaches
      : coaches.filter((coach) => coach.categories.includes(selectedCategory));

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category?.icon || Users;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Meet Our Expert Coaches
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Learn from industry professionals with proven expertise
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            View All
          </Button>
          <Button className="gap-2 bg-gradient-to-r text-white tracking-tight from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-700">
            <MessageSquare className="h-4 w-4" />
            Become a Coach
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedCategory === category.name
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {category.name}
              <span className="text-xs opacity-75">({category.count})</span>
            </button>
          );
        })}
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredCoaches.map((coach, index) => (
          <CoachCard coach={coach} index={index} />
        ))}
      </div>

      {/* Empty State */}
      {filteredCoaches.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            No coaches found
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Try selecting a different category or check back later for new
            coaches.
          </p>
        </div>
      )}
    </div>
  );
};

const CoachCard = ({ coach, index }: { coach: any; index: number }) => {
  return (
    <motion.div
      key={coach.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto"
    >
      <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-800">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <div className="aspect-[4/3] relative">
            <Image
              src={coach.image}
              alt={coach.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Featured Badge */}
            {coach.isFeatured && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                ⭐ Featured
              </div>
            )}

            {/* Verified Badge */}
            {coach.isVerified && (
              <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                ✓ Verified
              </div>
            )}

            {/* Availability Badge */}
            <div
              className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                coach.availability === "Available"
                  ? "bg-green-500 text-white"
                  : "bg-yellow-500 text-white"
              }`}
            >
              {coach.availability}
            </div>

            {/* Rating */}
            <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-zinc-800/90 rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs font-medium">{coach.rating}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-1 line-clamp-1">
                {coach.name}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                {coach.profession} at {coach.company}
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <MapPin className="h-3 w-3" />
                <span>{coach.experience}</span>
                <span>•</span>
                <span>{coach.languages.join(", ")}</span>
              </div>
            </div>
            <Avatar className="h-12 w-12 ml-3">
              <AvatarImage src={coach.image} />
              <AvatarFallback>{coach.name[0]}</AvatarFallback>
            </Avatar>
          </div>

          {/* About */}
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-3 line-clamp-2">
            {coach.about}
          </p>

          {/* Expertise Tags */}
          {/* <div className="flex flex-wrap gap-1 mb-3 line-clamp-1">
            {coach.expertise.slice(0, 3).map((skill: string) => (
              <Badge key={skill} variant="secondary" className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-1">
                {skill}
              </Badge>
            ))}
            {coach.expertise.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{coach.expertise.length - 3} more
              </Badge>
            )}
          </div> */}
          <div className="flex flex-nowrap gap-1 mb-3 overflow-hidden">
            {coach.expertise.slice(0, 3).map((skill: string) => (
              <Badge
                key={skill}
                variant="secondary"
                className="flex-shrink-0 text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-1 whitespace-nowrap"
              >
                {skill}
              </Badge>
            ))}
            {coach.expertise.length > 3 && (
              <Badge
                variant="secondary"
                className="flex-shrink-0 text-xs whitespace-nowrap"
              >
                +{coach.expertise.length - 3} more
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{coach.totalSessions} sessions</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{coach.totalStudents} students</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>${coach.hourlyRate}/hr</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              asChild
              className="flex-1 gap-2 bg-gradient-to-r text-white tracking-tight from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link
                href={`/sessions/book/${coach.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <MessageSquare className="h-4 w-4" />
                Book Session
              </Link>
            </Button>
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
