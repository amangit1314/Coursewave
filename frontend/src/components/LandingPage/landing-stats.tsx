"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Star,
  Zap,
  Target,
  Rocket,
} from "lucide-react";
import NumberTicker from "@/components/magicui/number-ticker";
import { dmSans } from "@/lib/config/fonts";
import { usePlatformStats } from "@/hooks/usePlatformStats";

const LandingCoursewaveStats = () => {
  const { data: stats, isLoading, error } = usePlatformStats();

  const statsData = [
    {
      icon: BookOpen,
      number: stats?.totalCourses || 0,
      title: "Online Courses",
      description:
        "Comprehensive courses covering the latest technologies and frameworks",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      number: stats?.totalInstructors || 0,
      title: "Expert Instructors",
      description:
        "Learn from industry professionals with years of real-world experience",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Award,
      number: stats?.totalUsers || 0,
      title: "Active Learners",
      description:
        "Join a thriving community of developers advancing their careers",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const achievements = [
    { icon: Star, text: "100% Success Rate", color: "text-yellow-500" },
    { icon: Target, text: "Industry Recognition", color: "text-blue-500" },
    { icon: Rocket, text: "Career Acceleration", color: "text-emerald-500" },
    { icon: Zap, text: "Real-time Learning", color: "text-purple-500" },
  ];

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="mx-auto h-8 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mx-auto h-12 w-96 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="h-48 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 dark:border-red-800 dark:bg-red-900/20">
          <h3 className="mb-2 text-lg font-medium text-red-800 dark:text-red-300">
            Failed to load statistics
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400">
            {error.message || "Please try refreshing the page"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-16">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-2 dark:border-blue-500/20 dark:bg-blue-500/10">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          <span className={`${dmSans.className} text-sm font-medium text-blue-700 dark:text-blue-300`}>
            Our Impact
          </span>
        </div>
        <h2
          className={`${dmSans.className} text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl`}
        >
          Empowering Developers{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Worldwide
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">
          Join thousands of developers who have transformed their careers with
          our comprehensive learning platform
        </p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
            className="group rounded-2xl border border-zinc-200 bg-white p-8 transition-shadow duration-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div
              className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-md`}
            >
              <stat.icon className="h-7 w-7 text-white" />
            </div>
            <div className={`${dmSans.className} space-y-2`}>
              <h3 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                <NumberTicker value={stat.number} />
                <span className="text-2xl text-blue-500">+</span>
              </h3>
              <h4 className="text-xl font-semibold text-zinc-900 dark:text-white">
                {stat.title}
              </h4>
            </div>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              {stat.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-zinc-800/40 dark:to-zinc-900/40" />
          <div className="relative px-8 py-12 sm:px-12 sm:py-16">
            <div className="mb-10 text-center">
              <h3
                className={`${dmSans.className} mb-3 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl`}
              >
                Surf the Future of Learning
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Join thousands who&apos;ve grown their careers with CourseWave
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                  </div>
                  <p className="text-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {achievement.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingCoursewaveStats;
