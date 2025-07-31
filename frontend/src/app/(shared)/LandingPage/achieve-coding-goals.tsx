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
  Globe
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const AchieveCodingGoals = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const goals = [
    {
      icon: Target,
      title: "Set Clear Goals",
      description: "Define your learning objectives and create a personalized roadmap to achieve them",
      features: ["Personalized Learning Path", "Progress Tracking", "Milestone Setting"],
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      darkBgGradient: "from-blue-950/20 to-cyan-950/20"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your advancement with detailed analytics and performance insights",
      features: ["Real-time Analytics", "Skill Assessment", "Performance Reports"],
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      darkBgGradient: "from-emerald-950/20 to-teal-950/20"
    },
    {
      icon: Users,
      title: "Join Community",
      description: "Connect with fellow developers and learn from their experiences",
      features: ["Peer Learning", "Code Reviews", "Collaboration"],
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      darkBgGradient: "from-purple-950/20 to-pink-950/20"
    },
    {
      icon: Award,
      title: "Earn Certificates",
      description: "Get recognized for your achievements with industry-standard certifications",
      features: ["Verified Certificates", "Portfolio Building", "Career Recognition"],
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      darkBgGradient: "from-orange-950/20 to-red-950/20"
    }
  ];

  const benefits = [
    "Learn at your own pace with flexible scheduling",
    "Access to expert instructors and industry professionals",
    "Hands-on projects and real-world applications",
    "Lifetime access to course materials and updates",
    "24/7 community support and mentorship",
    "Career guidance and job placement assistance"
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
      y: -8,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.3,
    });

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
              Your Success Journey
            </span>
            <Sparkles className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className="goals-title text-3xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-4xl lg:text-5xl">
            Achieve Your
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}Coding Goals
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
            Transform your career with our proven learning methodology and comprehensive support system
          </p>
        </motion.div>

        {/* Goals Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {goals.map((goal, index) => (
            <GoalCard key={index} {...goal} index={index} />
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Benefits List */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-white sm:text-3xl">
              Why Choose CourseWave?
            </h3>
            <p className="text-lg text-zinc-600 dark:text-gray-300">
              Join thousands of successful developers who transformed their careers with our platform
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-zinc-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>

            <Link href="/browseCourses">
              <motion.button
                className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Your Journey</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 blur transition-opacity group-hover:opacity-20" />
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
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">50K+</div>
                  <div className="text-sm text-zinc-600 dark:text-gray-400">Active Learners</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">95%</div>
                  <div className="text-sm text-zinc-600 dark:text-gray-400">Success Rate</div>
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
  index 
}: any) => {
  return (
    <motion.div
      className="goal-card group relative h-full cursor-pointer"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br ${bgGradient} p-6 shadow-lg transition-all duration-300 hover:shadow-2xl dark:border-gray-800 dark:bg-gradient-to-br ${darkBgGradient}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-gradient-to-br from-current to-transparent" />
        </div>

        {/* Icon */}
        <div className="relative mb-6">
          <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${gradient} p-3 shadow-lg`}>
            <Icon className="floating-goal-icon h-8 w-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="relative space-y-4">
          <h3 className="text-xl font-bold text-zinc-800 dark:text-white">
            {title}
          </h3>
          
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-gray-300">
            {description}
          </p>

          {/* Features */}
          <div className="space-y-2">
            {features.map((feature: string, idx: number) => (
              <div key={idx} className="flex items-center space-x-2">
                <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${gradient}`} />
                <span className="text-xs font-medium text-zinc-700 dark:text-gray-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hover Effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
      </div>
    </motion.div>
  );
};

export default AchieveCodingGoals;
