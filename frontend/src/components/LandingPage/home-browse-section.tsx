"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Code,
  Database,
  Smartphone,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
import { dmSans } from "@/lib/config/fonts";

const categories = [
  {
    icon: Code,
    title: "Frontend Development",
    description: "Master React, Vue, Angular and modern web technologies",
    courses: 45,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    darkBgGradient: "dark:from-blue-950/20 dark:to-cyan-950/20",
    features: ["React", "Vue.js", "Angular", "TypeScript"],
  },
  {
    icon: Database,
    title: "Backend Development",
    description: "Build robust APIs and server-side applications",
    courses: 38,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    darkBgGradient: "dark:from-purple-950/20 dark:to-pink-950/20",
    features: ["Node.js", "Python", "Java", "Go"],
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Create stunning mobile apps for iOS and Android",
    courses: 32,
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    darkBgGradient: "dark:from-emerald-950/20 dark:to-teal-950/20",
    features: ["React Native", "Flutter", "Swift", "Kotlin"],
  },
  {
    icon: Globe,
    title: "Full Stack Development",
    description: "End-to-end development from database to deployment",
    courses: 28,
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
    darkBgGradient: "dark:from-orange-950/20 dark:to-red-950/20",
    features: ["MERN Stack", "Next.js", "Docker", "AWS"],
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Learn to protect systems and data from threats",
    courses: 25,
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50",
    darkBgGradient: "dark:from-indigo-950/20 dark:to-purple-950/20",
    features: ["Ethical Hacking", "Network Security", "Cryptography"],
  },
  {
    icon: Zap,
    title: "DevOps & Cloud",
    description: "Master deployment, automation and cloud platforms",
    courses: 22,
    gradient: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-50 to-orange-50",
    darkBgGradient: "dark:from-yellow-950/20 dark:to-orange-950/20",
    features: ["Docker", "Kubernetes", "AWS", "CI/CD"],
  },
];

const HomeBrowseSection = () => {
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
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span className={`${dmSans.className} text-sm font-medium text-blue-700 dark:text-blue-300`}>
            Explore Categories
          </span>
        </div>
        <h2
          className={`${dmSans.className} text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl`}
        >
          Discover Your Perfect{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Learning Path
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">
          Choose from our curated collection of courses designed to accelerate
          your career growth
        </p>
      </motion.div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
            className="group"
          >
            <Link href="/browseCourses" className="block h-full">
              <div
                className={`relative h-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br ${category.bgGradient} ${category.darkBgGradient} p-6 transition-all duration-300 hover:shadow-lg dark:border-zinc-800`}
              >
                {/* Top row: icon + course count */}
                <div className="mb-5 flex items-center justify-between">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${category.gradient} shadow-md`}
                  >
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <span
                    className={`${dmSans.className} rounded-full bg-zinc-900/5 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-white/10 dark:text-zinc-300`}
                  >
                    {category.courses} courses
                  </span>
                </div>

                {/* Content */}
                <h3
                  className={`${dmSans.className} mb-2 text-lg font-bold text-zinc-900 dark:text-white`}
                >
                  {category.title}
                </h3>
                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {category.description}
                </p>

                {/* Tech pills */}
                <div className="flex flex-wrap gap-1.5">
                  {category.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className={`${dmSans.className} inline-flex rounded-full bg-gradient-to-r ${category.gradient} px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Link href="/roadmaps">
          <motion.button
            className={`${dmSans.className} group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-shadow duration-300 hover:shadow-xl`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Browse All
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default HomeBrowseSection;
