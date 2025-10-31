"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Code,
  Database,
  Smartphone,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
import { dmSans } from "@/lib/config/fonts";

gsap.registerPlugin(ScrollTrigger);

/// =============================================================================
const HomeBrowseSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const categories = [
    {
      icon: Code,
      title: "Frontend Development",
      description: "Master React, Vue, Angular and modern web technologies",
      courses: 45,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      darkBgGradient: "from-blue-950/20 to-cyan-950/20",
      features: ["React", "Vue.js", "Angular", "TypeScript"],
    },
    {
      icon: Database,
      title: "Backend Development",
      description: "Build robust APIs and server-side applications",
      courses: 38,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      darkBgGradient: "from-purple-950/20 to-pink-950/20",
      features: ["Node.js", "Python", "Java", "Go"],
    },
    {
      icon: Smartphone,
      title: "Mobile Development",
      description: "Create stunning mobile apps for iOS and Android",
      courses: 32,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      darkBgGradient: "from-emerald-950/20 to-teal-950/20",
      features: ["React Native", "Flutter", "Swift", "Kotlin"],
    },
    {
      icon: Globe,
      title: "Full Stack Development",
      description: "End-to-end development from database to deployment",
      courses: 28,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      darkBgGradient: "from-orange-950/20 to-red-950/20",
      features: ["MERN Stack", "Next.js", "Docker", "AWS"],
    },
    {
      icon: Shield,
      title: "Cybersecurity",
      description: "Learn to protect systems and data from threats",
      courses: 25,
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
      darkBgGradient: "from-indigo-950/20 to-purple-950/20",
      features: ["Ethical Hacking", "Network Security", "Cryptography"],
    },
    {
      icon: Zap,
      title: "DevOps & Cloud",
      description: "Master deployment, automation and cloud platforms",
      courses: 22,
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50",
      darkBgGradient: "from-yellow-950/20 to-orange-950/20",
      features: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate section title
    gsap.fromTo(
      ".browse-title",
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
      ".browse-card",
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

    // Floating animation for icons
    gsap.to(".floating-browse-icon", {
      scale: 1.1,
      opacity: 0.7,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

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
              Explore Categories
            </span>
            <Sparkles className="h-6 w-6 text-blue-500" />
          </div>
          <h2
            className={`${dmSans.className} browse-title text-3xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-4xl lg:text-5xl`}
          >
            Discover Your Perfect
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}
              Learning Path
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
            Choose from our curated collection of courses designed to accelerate
            your career growth
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} index={index} />
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
          <Link href="/roadmaps">
            <motion.button
              className={`${dmSans.className} group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105`}
              whileHover={{ scale: 1.0 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Browse All</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 blur transition-opacity group-hover:opacity-20" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeBrowseSection;

/// =============================================================================
const CategoryCard = ({
  icon: Icon,
  title,
  description,
  courses,
  gradient,
  bgGradient,
  darkBgGradient,
  features,
}: any) => {
  return (
    <motion.div
      className="group relative h-full cursor-pointer"
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link href="/browseCourses" className="block h-full">
        <div
          className={`relative h-full overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br ${bgGradient} p-6 sm:p-8 shadow-md transition-all duration-300 hover:shadow-2xl dark:border-zinc-800 dark:bg-gradient-to-br ${darkBgGradient}`}
        >
          {/* Icon */}
          <div className="mb-6 flex items-center justify-between">
            <div
              className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${gradient} shadow-md transition-transform duration-300 group-hover:scale-110`}
            >
              <Icon className="h-7 w-7 text-white" />
            </div>

            {/* Courses pill */}
            <span
              className={`${dmSans.className} inline-flex items-center rounded-full bg-zinc-900/5 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur-sm dark:bg-white/10 dark:text-zinc-200`}
            >
              {courses} courses
            </span>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h3
              className={`${dmSans.className} text-xl font-bold tracking-tight text-zinc-900 dark:text-white`}
            >
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {description}
            </p>

            {/* Features as pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {features.map((feature: string, idx: number) => (
                <span
                  key={idx}
                  className={` ${dmSans.className} inline-flex items-center rounded-full bg-gradient-to-r ${gradient} px-3 py-1 text-xs font-semibold text-white shadow-sm`}
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Arrow */}
            {/* <div className="pt-6">
              <ArrowRight
                className={`h-5 w-5 text-transparent transition-all duration-300 group-hover:translate-x-1 group-hover:text-current bg-gradient-to-r ${gradient} bg-clip-text`}
              />
            </div> */}
          </div>

          {/* Glow overlay */}
          <div
            className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-15`}
          />
        </div>
      </Link>
    </motion.div>
  );
};
