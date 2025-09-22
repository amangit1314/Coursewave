"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  Zap,
  Globe,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const AchieveCodingGoals = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const goals = [
    {
      icon: Target,
      title: "Set Clear Goals",
      description:
        "Define your learning objectives and create a personalized roadmap to achieve them",
      features: [
        "Personalized Learning Path",
        "Progress Tracking",
        "Milestone Setting",
      ],
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      darkBgGradient: "from-blue-950/20 to-cyan-950/20",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description:
        "Monitor your advancement with detailed analytics and performance insights",
      features: [
        "Real-time Analytics",
        "Skill Assessment",
        "Performance Reports",
      ],
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      darkBgGradient: "from-emerald-950/20 to-teal-950/20",
    },
    {
      icon: Users,
      title: "Join Community",
      description:
        "Connect with fellow developers and learn from their experiences",
      features: ["Peer Learning", "Code Reviews", "Collaboration"],
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      darkBgGradient: "from-purple-950/20 to-pink-950/20",
    },
    {
      icon: Award,
      title: "Earn Certificates",
      description:
        "Get recognized for your achievements with industry-standard certifications",
      features: [
        "Verified Certificates",
        "Portfolio Building",
        "Career Recognition",
      ],
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      darkBgGradient: "from-orange-950/20 to-red-950/20",
    },
  ];

  const benefits = [
    "Learn at your own pace with flexible scheduling",
    "Access to expert instructors and industry professionals",
    "Hands-on projects and real-world applications",
    "Lifetime access to course materials and updates",
    "24/7 community support and mentorship",
    "Career guidance and job placement assistance",
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate section title
    gsap.fromTo(
      ".goals-title",
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
      ".goal-card",
      { y: 60, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 70%",
        },
      }
    );

    // Animate benefits list
    gsap.fromTo(
      ".benefit-item",
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );

    // Floating animation for icons
    gsap.to(".floating-goal-icon", {
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
              Your Success Journey
            </span>
            <Sparkles className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className="goals-title text-3xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-4xl lg:text-5xl">
            Achieve Your
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}
              Coding Goals
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
            Transform your career with our proven learning methodology and
            comprehensive support system
          </p>
        </motion.div>

        {/* Goals Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {goals.map((goal, index) => (
            <GoalCard key={index} {...goal} index={index} />
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Benefits List */}
          <motion.div
            className="space-y-7 px-1 sm:px-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-white sm:text-3xl md:text-4xl">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                CourseWave
              </span>
              ?
            </h3>
            <p className="max-w-xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
              Join thousands of successful developers who transformed their
              careers with our platform
            </p>

            <div className="space-y-5">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="benefit-item flex items-start space-x-4 rounded-lg p-1 transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-1">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-base font-medium text-zinc-700 dark:text-gray-200 sm:text-lg">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>

            <Link href="/browseCourses" className="mt-2 inline-block">
              <motion.button
                className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 sm:px-8 sm:py-4 sm:text-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Start Your Journey</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 p-8 shadow-2xl dark:from-blue-950/20 dark:to-cyan-950/20 sm:p-12">
              {/* Background Pattern */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />

              {/* Central Icon */}
              <div className="relative flex items-center justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-2xl">
                  <Globe className="h-16 w-16 text-white" />
                </div>

                {/* Orbiting Elements */}
                <div className="absolute inset-0 animate-spin-slow">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-4 w-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-80"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-60px)`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    50K+
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-gray-400">
                    Active Learners
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    95%
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-gray-400">
                    Success Rate
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const GoalCard = ({
  icon: Icon,
  title,
  description,
  features,
  gradient,
  bgGradient,
  darkBgGradient,
  index,
}: any) => {
  return (
    <motion.div
      className="goal-card group relative h-full cursor-pointer"
      // whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`relative h-full overflow-hidden rounded-2xl border border-gray-200/50 bg-gradient-to-br ${bgGradient} p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-gray-800/50 dark:bg-gradient-to-br ${darkBgGradient}`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,currentColor,transparent_70%)]" />
          <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-gradient-to-r from-transparent to-current opacity-10 blur-2xl" />
        </div>

        {/* Icon with animated glow */}
        <div className="relative mb-8">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-white/20 to-transparent blur-xl dark:from-white/10" />
          <div
            className={`relative inline-flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-r ${gradient} p-4 shadow-lg ring-1 ring-white/10`}
          >
            <Icon className="floating-goal-icon h-9 w-9 text-white drop-shadow-md" />
          </div>
        </div>

        {/* Content */}
        <div className="relative space-y-5">
          <h3 className="text-2xl font-bold text-zinc-800 dark:text-white">
            {title}
          </h3>

          <p className="text-base leading-relaxed text-zinc-600 dark:text-gray-300">
            {description}
          </p>

          {/* Features with improved styling */}
          <div className="space-y-3 pt-2">
            {features.map((feature: string, idx: number) => (
              <div key={idx} className="flex items-center space-x-3">
                <div
                  className={`h-2 w-2 rounded-full bg-gradient-to-r ${gradient} shadow-sm`}
                />
                <span className="text-sm font-medium text-zinc-700 dark:text-gray-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced hover effects */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
        />

        {/* Subtle border glow on hover */}
        <div className="absolute inset-0 rounded-2xl border border-transparent opacity-0 transition-all duration-300 group-hover:border-white/20 group-hover:opacity-100 dark:group-hover:border-white/10" />
      </div>
    </motion.div>
  );
};

export default AchieveCodingGoals;
