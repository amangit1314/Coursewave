"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Play,
  Users,
  Award,
  Globe,
  Zap,
  BookOpen,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle2,
  Star,
} from "lucide-react";
import { dmSans } from "@/lib/config/fonts";
import Link from "next/link";
import { usePlatformStats } from "@/hooks/usePlatformStats";

const About = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: statsData, isLoading } = usePlatformStats();

  const features = [
    {
      icon: Users,
      title: "Expert Instructors",
      description:
        "Learn from industry professionals with years of experience at top tech companies",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: Award,
      title: "Quality Content",
      description:
        "Comprehensive courses with hands-on projects, quizzes, and real-world applications",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: Globe,
      title: "Global Community",
      description:
        "Join thousands of developers worldwide. Network, collaborate, and grow together",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: Zap,
      title: "Fast Learning",
      description:
        "Accelerated learning paths with AI-powered recommendations and progress tracking",
      gradient: "from-orange-500 to-red-600",
    },
  ];

  const stats = [
    {
      icon: Users,
      value: statsData?.totalUsers
        ? `${statsData.totalUsers.toLocaleString()}+`
        : "10,000+",
      label: "Active Learners",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: BookOpen,
      value: statsData?.totalCourses ? `${statsData.totalCourses}+` : "200+",
      label: "Expert Courses",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Award,
      value: statsData?.totalInstructors
        ? `${statsData.totalInstructors}+`
        : "50+",
      label: "Expert Instructors",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      value: "85%",
      label: "Career Growth",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const benefits = [
    "Industry-recognized certifications",
    "24/7 community support",
    "Lifetime access to course materials",
    "Career placement assistance",
    "Mobile and offline learning",
    "Regular content updates",
  ];

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-zinc-200 mx-auto dark:bg-zinc-800" />
            <div className="h-12 w-96 rounded bg-zinc-200 mx-auto dark:bg-zinc-800" />
            <div className="h-6 w-64 rounded bg-zinc-200 mx-auto dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-16 lg:space-y-20">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-2 dark:border-blue-500/20 dark:bg-blue-500/10">
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span className={`${dmSans.className} text-sm font-medium text-blue-700 dark:text-blue-300`}>
            About CourseWave
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
          Join the global community of developers who are transforming their
          careers with our comprehensive learning platform
        </p>
      </motion.div>

      {/* Two-column: Video + Content */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        {/* Video */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="order-2 lg:order-1"
        >
          <div className="relative group">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 p-1.5 shadow-xl dark:from-zinc-800 dark:to-zinc-900">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700">
                {isPlaying ? (
                  <video
                    src="https://cdn.pixabay.com/vimeo/26452/hourglass-26452-640.mp4?width=640&hash=4a72f010b5f1f84e38a5f6f39b4b2c621f081e0a"
                    className="h-full w-full rounded-xl object-cover"
                    controls
                    autoPlay
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-2xl backdrop-blur-sm transition-transform duration-300 hover:scale-110 dark:bg-zinc-800/95"
                      >
                        <Play className="ml-1 h-7 w-7 text-blue-600 dark:text-blue-400" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between rounded-lg bg-white/90 px-4 py-2 backdrop-blur-sm dark:bg-zinc-800/90">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Watch Our Story
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                          <Clock className="h-3 w-3" />
                          <span>3:24</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -bottom-3 -left-3 hidden sm:block">
              <div className="flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1.5 shadow-lg">
                <Shield className="h-3.5 w-3.5 text-white" />
                <span className="text-xs font-medium text-white">Trusted Platform</span>
              </div>
            </div>
            <div className="absolute -right-3 -top-3 hidden sm:block">
              <div className="flex items-center gap-2 rounded-full bg-purple-500 px-3 py-1.5 shadow-lg">
                <Star className="h-3.5 w-3.5 fill-current text-white" />
                <span className="text-xs font-medium text-white">4.9 Rating</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="order-1 space-y-6 lg:order-2"
        >
          <h3
            className={`${dmSans.className} text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl`}
          >
            Your Gateway to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Tech Excellence
            </span>
          </h3>

          <div className="space-y-3 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              CourseWave is more than a platform — it&apos;s your launchpad into the
              tech world. Learn, build, and grow with an ecosystem that empowers
              anyone, anywhere, to master in-demand skills.
            </p>
            <p>
              Learn from industry experts, build real projects, and grow with a
              community that pushes you to master the skills shaping
              tomorrow&apos;s tech world.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                viewport={{ once: true }}
              >
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>

          <Link
            href="/browse"
            className={`${dmSans.className} inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl`}
          >
            Start Learning Today
            <TrendingUp className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      {/* Features grid */}
      <div>
        <div className="mb-10 text-center">
          <h3
            className={`${dmSans.className} mb-3 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl`}
          >
            Why Choose CourseWave?
          </h3>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Experience the difference with our comprehensive learning ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} shadow-md`}
              >
                <feature.icon className="h-5 w-5 text-white" />
              </div>
              <h4
                className={`${dmSans.className} mb-2 text-lg font-semibold text-zinc-900 dark:text-white`}
              >
                {feature.title}
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
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
                Trusted by Developers Worldwide
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Join thousands who&apos;ve grown their careers with CourseWave
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div
                    className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r ${stat.gradient} shadow-md`}
                  >
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <p
                    className={`${dmSans.className} text-2xl font-bold text-zinc-900 dark:text-white`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {stat.label}
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

export default About;
