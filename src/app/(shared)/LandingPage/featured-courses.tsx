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
  TrendingUp
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FeaturedCourses = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const featuredCourses = [
    {
      id: "1",
      title: "Complete React Developer Bootcamp",
      instructor: "Sarah Johnson",
      rating: 4.9,
      students: "12,450",
      duration: "45 hours",
      price: "$89.99",
      originalPrice: "$199.99",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      category: "Frontend",
      level: "Beginner",
      badge: "Bestseller"
    },
    {
      id: "2",
      title: "Node.js & Express.js Masterclass",
      instructor: "Michael Chen",
      rating: 4.8,
      students: "8,920",
      duration: "32 hours",
      price: "$79.99",
      originalPrice: "$149.99",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
      category: "Backend",
      level: "Intermediate",
      badge: "Hot"
    },
    {
      id: "3",
      title: "Python for Data Science & AI",
      instructor: "Dr. Emily Rodriguez",
      rating: 4.9,
      students: "15,230",
      duration: "56 hours",
      price: "$99.99",
      originalPrice: "$249.99",
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
      category: "Data Science",
      level: "Advanced",
      badge: "Trending"
    },
    {
      id: "4",
      title: "Flutter App Development",
      instructor: "Alex Thompson",
      rating: 4.7,
      students: "6,780",
      duration: "38 hours",
      price: "$69.99",
      originalPrice: "$129.99",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
      category: "Mobile",
      level: "Intermediate",
      badge: "New"
    }
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

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

    // Animate cards with stagger
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

  }, []);

  return (
    <div ref={sectionRef} className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
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
          <h2 className="featured-title text-3xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-4xl lg:text-5xl">
            Most Popular
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}Courses
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
            Join thousands of students learning from our most popular and highly-rated courses
          </p>
        </motion.div>

        {/* Featured Courses Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCourses.map((course, index) => (
            <CourseCard key={course.id} {...course} index={index} />
          ))}
        </div>

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
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
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

const CourseCard = ({ 
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
  index 
}: any) => {
  return (
    <motion.div
      className="course-card group relative h-full cursor-pointer"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/courses/${id}`} className="block h-full">
        <div className="relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          {/* Badge */}
          {badge && (
            <div className="absolute top-3 left-3 z-10">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                badge === "Bestseller" ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" :
                badge === "Hot" ? "bg-gradient-to-r from-red-400 to-pink-500 text-white" :
                badge === "Trending" ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white" :
                "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
              }`}>
                {badge}
              </span>
            </div>
          )}

          {/* Course Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                <Play className="h-6 w-6 text-gray-800" />
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="p-6">
            {/* Category and Level */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {category}
              </span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {level}
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-2 line-clamp-2 text-lg font-bold text-zinc-800 dark:text-white">
              {title}
            </h3>

            {/* Instructor */}
            <p className="mb-3 text-sm text-zinc-600 dark:text-gray-300">
              by {instructor}
            </p>

            {/* Rating and Students */}
            <div className="mb-4 flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-zinc-800 dark:text-white">
                  {rating}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {students}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {duration}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-zinc-800 dark:text-white">
                  {price}
                </span>
                <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                  {originalPrice}
                </span>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>
    </motion.div>
  );
};

export default FeaturedCourses; 