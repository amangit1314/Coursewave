"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  ArrowRight,
  Sparkles,
  Code,
  Award,
  Zap,
  Star,
  HammerIcon,
  BrainIcon,
} from "lucide-react";
import { dmSans } from "@/lib/config/fonts";

const offerings = [
  {
    link: "/browseCourses",
    title: "Premium Courses",
    description:
      "Master in-demand skills with our comprehensive, project-based courses designed by industry experts.",
    icon: BookOpen,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    darkBgGradient: "dark:from-blue-950/20 dark:to-cyan-950/20",
    features: [
      "200+ Expert Courses",
      "Live Projects",
      "Industry Certificates",
      "Lifetime Access",
    ],
    stats: "50K+ Students",
    badge: "Most Popular",
  },
  {
    link: "/articles",
    title: "Community Articles",
    description:
      "Dive into cutting-edge technical content and insights shared by our vibrant developer community.",
    icon: Users,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    darkBgGradient: "dark:from-purple-950/20 dark:to-pink-950/20",
    features: [
      "Expert Insights",
      "Latest Trends",
      "Community Driven",
      "Free Access",
    ],
    stats: "1000+ Articles",
    badge: "Free",
  },
  {
    link: "/projects",
    title: "Project-Based Learning",
    description:
      "Gain hands-on experience by building real projects while taking our courses. Learn by doing, not just watching.",
    icon: HammerIcon,
    gradient: "from-yellow-500 to-rose-500",
    bgGradient: "from-yellow-50 to-rose-50",
    darkBgGradient: "dark:from-yellow-950/20 dark:to-rose-950/20",
    features: [
      "Build real-world projects",
      "Apply concepts in practical scenarios",
      "Receive feedback from instructors",
      "Showcase projects in a portfolio",
    ],
    stats: "100+ Projects",
    badge: "Hands-On",
  },
  {
    link: "/roadmaps",
    title: "AI Learning Roadmaps",
    description:
      "Enter any skill and instantly get a personalized, step-by-step roadmap powered by AI.",
    icon: BrainIcon,
    gradient: "from-indigo-500 to-cyan-500",
    bgGradient: "from-indigo-50 to-cyan-50",
    darkBgGradient: "dark:from-indigo-950/20 dark:to-cyan-950/20",
    features: [
      "AI-powered roadmap generation",
      "Personalized skill paths",
      "Downloadable & shareable",
      "Clear milestones and goals",
    ],
    stats: "100+ Skills Covered",
    badge: "AI-Powered",
  },
];

const highlights = [
  {
    icon: Code,
    title: "Hands-on Projects",
    description:
      "Build real-world applications with industry-standard tools and technologies",
  },
  {
    icon: Award,
    title: "Certified Learning",
    description:
      "Earn recognized certificates to boost your career and portfolio",
  },
  {
    icon: Zap,
    title: "Fast-track Success",
    description:
      "Accelerate your learning with proven methodologies and expert guidance",
  },
];

const badgeColorMap: Record<string, string> = {
  "Most Popular": "from-yellow-400 to-orange-500",
  Free: "from-green-400 to-emerald-500",
  "Hands-On": "from-yellow-500 to-rose-500",
  "AI-Powered": "from-indigo-400 to-cyan-500",
};

const Offerings = () => {
  return (
    <div className="flex flex-col space-y-20">
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
            Our Learning Ecosystem
          </span>
        </div>
        <h2
          className={`${dmSans.className} text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl`}
        >
          Everything You Need to{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Succeed in Tech
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">
          From beginner to expert, we provide the complete toolkit for your
          tech career journey
        </p>
      </motion.div>

      {/* Offerings grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {offerings.map((offering, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
            className="group"
          >
            <Link href={offering.link} className="block h-full">
              <div
                className={`relative h-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br ${offering.bgGradient} ${offering.darkBgGradient} p-6 transition-all duration-300 hover:shadow-xl dark:border-zinc-800`}
              >
                {/* Badge */}
                {offering.badge && (
                  <div className="absolute right-6 top-6">
                    <span
                      className={`inline-flex items-center rounded-full bg-gradient-to-r ${
                        badgeColorMap[offering.badge] ?? "from-blue-400 to-cyan-500"
                      } px-3 py-1 text-xs font-semibold text-white`}
                    >
                      {offering.badge}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${offering.gradient} shadow-lg`}
                >
                  <offering.icon className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <h3
                  className={`${dmSans.className} mb-2 text-xl font-bold text-zinc-900 dark:text-white`}
                >
                  {offering.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {offering.description}
                </p>

                {/* Stats */}
                <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{offering.stats}</span>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {offering.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${offering.gradient}`}
                      />
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Highlights */}
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
                Your Growth Starts Here
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Join thousands of successful developers who transformed their
                careers with our proven approach
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md">
                    <highlight.icon className="h-7 w-7 text-white" />
                  </div>
                  <h4
                    className={`${dmSans.className} mb-2 text-lg font-semibold text-zinc-900 dark:text-white`}
                  >
                    {highlight.title}
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {highlight.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3
          className={`${dmSans.className} mb-3 text-2xl font-bold text-zinc-900 dark:text-white`}
        >
          Ready to Transform Your Career?
        </h3>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          Start your journey today and join a vast community of successful developers
        </p>
        <Link href="/browse">
          <motion.button
            className={`${dmSans.className} group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-shadow duration-300 hover:shadow-xl`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Start Learning Now
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Offerings;
