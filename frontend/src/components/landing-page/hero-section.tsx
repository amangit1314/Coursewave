"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Users, Star } from "lucide-react";
import { dmSans } from "@/lib/config/fonts";
import { Button } from "@/components/ui/button";

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-[hsl(222,47%,6%)] dark:via-[hsl(222,47%,8%)] dark:to-[hsl(222,47%,6%)]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(hsl(217,91%,60%) 1px, transparent 1px), linear-gradient(90deg, hsl(217,91%,60%) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[120px] dark:bg-blue-500/10" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-cyan-400/10 blur-[100px] dark:bg-cyan-500/8" />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-2 backdrop-blur-sm dark:border-blue-500/20 dark:bg-blue-500/10">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span className={`${dmSans.className} text-sm font-medium text-blue-700 dark:text-blue-300`}>
              The platform developers love
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className={`${dmSans.className} max-w-4xl text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl`}
        >
          Master the skills{" "}
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            that matter
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl"
        >
          Project-based courses, expert articles, and structured roadmaps to
          take you from beginner to production-ready developer.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link href="/register">
            <Button
              size="lg"
              className={`${dmSans.className} group h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-8 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 sm:h-14 sm:px-10 sm:text-lg`}
            >
              Start Learning Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/browse">
            <Button
              variant="outline"
              size="lg"
              className={`${dmSans.className} group h-12 rounded-full border-zinc-300 px-8 text-base font-semibold text-zinc-700 transition-all duration-300 hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-blue-500 dark:hover:text-blue-400 sm:h-14 sm:px-10 sm:text-lg`}
            >
              <Play className="mr-2 h-4 w-4" />
              Browse Courses
            </Button>
          </Link>
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-16 flex flex-col items-center gap-6 sm:flex-row sm:gap-10"
        >
          {/* Avatars */}
          <div className="flex items-center">
            <div className="flex -space-x-3">
              {[
                "bg-gradient-to-br from-blue-400 to-blue-600",
                "bg-gradient-to-br from-cyan-400 to-teal-600",
                "bg-gradient-to-br from-purple-400 to-purple-600",
                "bg-gradient-to-br from-emerald-400 to-emerald-600",
              ].map((gradient, i) => (
                <div
                  key={i}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white dark:border-zinc-900 ${gradient}`}
                >
                  {["A", "S", "R", "M"][i]}
                </div>
              ))}
            </div>
            <div className="ml-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  4.9/5
                </span>{" "}
                from 1,000+ reviews
              </p>
            </div>
          </div>

          <div className="hidden h-8 w-px bg-zinc-200 dark:bg-zinc-700 sm:block" />

          {/* Stats */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className={`${dmSans.className} text-xl font-bold text-zinc-900 dark:text-white`}>
                10K+
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Active learners
              </p>
            </div>
            <div className="text-center">
              <p className={`${dmSans.className} text-xl font-bold text-zinc-900 dark:text-white`}>
                200+
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Expert courses
              </p>
            </div>
            <div className="text-center">
              <p className={`${dmSans.className} text-xl font-bold text-zinc-900 dark:text-white`}>
                95%
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Completion rate
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-[hsl(222,47%,6%)]" />
    </section>
  );
};

export default HeroSection;
