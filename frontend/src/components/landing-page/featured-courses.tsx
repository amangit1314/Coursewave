"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Sparkles,
  Star,
  Clock,
  Users,
  Play,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/utils";
import { dmSans } from "@/lib/config/fonts";
import { useCourses } from "@/hooks/useCourses"; // Import the hook

gsap.registerPlugin(ScrollTrigger);

const FeaturedCourses = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  // Use the courses hook
  const { data: courses, isLoading, isError, error } = useCourses();

  // Filter featured courses - you might want to adjust this logic based on your data
  const featuredCourses = courses 
    ? courses
        .filter(course => course.isPublished) // Only show published courses
        .slice(0, 4) // Show first 4 courses, or implement your own featured logic
        .map(course => ({
          id: course.id,
          title: course.title,
          instructor: course.instructor?.user?.name || "Unknown Instructor",
          rating: course.averageRating || 5.0,
          students: "1,000+", // You might want to add enrollment count to your schema
          duration: "20 hours", // You might want to add duration to your schema
          price: course.isFree ? "Free" : `$${course.price}`,
          originalPrice: (course.discount || 0) > 0 ? `$${course.price + (course.discount || 0)}` : null,
          image: course.imageUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
          category: course.Category?.name || "Uncategorized",
          level: "All Levels", // You might want to add level to your schema
          badge: course.isFree ? "Free" : "Popular",
        }))
    : [];

  useEffect(() => {
    if (!sectionRef.current || !courses) return;

    // Animate section title
    gsap.fromTo(
      ".featured-title",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    // Animate cards with stagger - only if we have courses
    if (featuredCourses.length > 0) {
      gsap.fromTo(
        ".course-card",
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 70%",
          },
        }
      );
    }
  }, [courses]); // Re-run when courses data changes

  // Loading state
  if (isLoading) {
    return (
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="flex flex-col space-y-16">
          {/* Header Section Skeleton */}
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center space-x-2">
              <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
          </div>

          {/* Courses Grid Skeleton */}
          <div
            ref={cardsRef}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-3xl"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h3 className="text-red-800 font-medium text-lg mb-2">
              Failed to load courses
            </h3>
            <p className="text-red-600 text-sm">
              {error?.message || 'Please try refreshing the page'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col space-y-16">
        {/* Header Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex items-center justify-center space-x-2">
            <Sparkles className="h-6 w-6 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Featured Courses
            </span>
            <Sparkles className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className={`${dmSans.className} featured-title text-3xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-4xl lg:text-5xl`}>
            Most Popular
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}
              Courses
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
            Join thousands of students learning from our most popular and
            highly-rated courses
          </p>
        </motion.div>

        {/* Featured Courses Grid */}
        {featuredCourses.length > 0 ? (
          <div
            ref={cardsRef}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {featuredCourses.map((course, index) => (
              <CourseCard key={course.id} {...course} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No featured courses available at the moment.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link href="/browseCourses">
            <motion.button
              className={`${dmSans.className} group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View All Courses</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 blur transition-opacity group-hover:opacity-20" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

const badgeColors: Record<string, string> = {
  Bestseller: "from-yellow-400 to-orange-500",
  Hot: "from-red-400 to-pink-500",
  Trending: "from-purple-400 to-pink-500",
  Free: "from-green-400 to-emerald-500",
  Popular: "from-blue-400 to-cyan-500",
  Default: "from-gray-400 to-zinc-500",
};

export const CourseCard = ({
  id,
  title,
  instructor,
  rating,
  students,
  duration,
  price,
  originalPrice,
  image,
  category,
  level,
  badge,
}: any) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative h-full cursor-pointer course-card"
    >
      <Link
        href={`/courses/${id}`}
        className="block h-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3 z-20">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow-sm",
                `bg-gradient-to-r ${
                  badgeColors[badge] ?? badgeColors["Default"]
                }`
              )}
            >
              {badge}
            </span>
          </div>
        )}

        {/* Course Image */}
        <div className="relative h-44 sm:h-48 overflow-hidden rounded-t-3xl">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm">
              <Play className="h-6 w-6 text-gray-800" />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-col justify-between p-5 sm:p-6">
          {/* Category + Level */}
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {category}
            </span>
            <span className="text-gray-500 dark:text-gray-400">{level}</span>
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-base sm:text-lg font-semibold text-zinc-900 dark:text-white">
            {title}
          </h3>

          {/* Instructor */}
          <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
            by <span className="font-medium">{instructor}</span>
          </p>

          {/* Stats */}
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-zinc-800 dark:text-white">
                {rating}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {students}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {duration}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                {price}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                  {originalPrice}
                </span>
              )}
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
        </div>

        {/* Hover Glow */}
        <div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-blue-500/50 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-15`}
        />
      </Link>
    </motion.div>
  );
};

export default FeaturedCourses;