"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  Calendar,
  ArrowRight,
  Sparkles,
  Code,
  Globe,
  Award,
  Zap,
  Play,
  Star
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Offerings = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const offerings = [
    {
      link: "/browseCourses",
      title: "Premium Courses",
      description: "Master in-demand skills with our comprehensive, project-based courses designed by industry experts.",
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      darkBgGradient: "from-blue-950/20 to-cyan-950/20",
      features: ["200+ Expert Courses", "Live Projects", "Industry Certificates", "Lifetime Access"],
      stats: "50K+ Students",
      badge: "Most Popular"
    },
    {
      link: "/articles",
      title: "Community Articles",
      description: "Dive into cutting-edge technical content and insights shared by our vibrant developer community.",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      darkBgGradient: "from-purple-950/20 to-pink-950/20",
      features: ["Expert Insights", "Latest Trends", "Community Driven", "Free Access"],
      stats: "1000+ Articles",
      badge: "Free"
    },
    {
      link: "/browseSessions",
      title: "1-on-1 Mentorship",
      description: "Get personalized guidance from industry professionals to accelerate your learning journey.",
      icon: MessageSquare,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      darkBgGradient: "from-emerald-950/20 to-teal-950/20",
      features: ["Personalized Guidance", "Flexible Schedule", "Direct Feedback", "Career Planning"],
      stats: "500+ Mentors",
      badge: "Premium"
    },
    {
      link: "/browseSessions",
      title: "Live Sessions",
      description: "Join interactive live sessions on the latest technology trends and industry best practices.",
      icon: Calendar,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      darkBgGradient: "from-orange-950/20 to-red-950/20",
      features: ["Live Q&A", "Real-time Learning", "Networking", "Recorded Sessions"],
      stats: "100+ Sessions/Month",
      badge: "Interactive"
    },
  ];

  const highlights = [
    {
      icon: Code,
      title: "Hands-on Projects",
      description: "Build real-world applications with industry-standard tools and technologies"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with developers worldwide and learn from diverse perspectives"
    },
    {
      icon: Award,
      title: "Certified Learning",
      description: "Earn recognized certificates to boost your career and portfolio"
    },
    {
      icon: Zap,
      title: "Fast-track Success",
      description: "Accelerate your learning with proven methodologies and expert guidance"
    }
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate section title
    gsap.fromTo(
      ".section-title",
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
      ".offering-card",
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

    // Animate highlights
    gsap.fromTo(
      ".highlight-item",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      }
    );

    // Floating animation for icons
    gsap.to(".floating-icon", {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.3,
    });

  }, []);

  return (
    <div ref={sectionRef} className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-20">
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
              Our Learning Ecosystem
            </span>
            <Sparkles className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className="section-title text-3xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-4xl lg:text-5xl">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}Succeed in Tech
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
            From beginner to expert, we provide the complete toolkit for your tech career journey
          </p>
        </motion.div>

        {/* Offerings Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {offerings.map((offering, index) => (
            <OfferingCard key={index} {...offering} index={index} />
          ))}
        </div>

        {/* Highlights Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl dark:from-blue-950/20 dark:to-cyan-950/20" />
          <div className="relative p-8 sm:p-12">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-zinc-800 dark:text-white sm:text-3xl mb-4">
                Why Choose CourseWave?
              </h3>
              <p className="text-lg text-zinc-600 dark:text-gray-300 max-w-2xl mx-auto">
                Join thousands of successful developers who transformed their careers with our proven approach
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((highlight, index) => (
                <HighlightCard key={index} {...highlight} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">
              Ready to Transform Your Career?
            </h3>
            <p className="text-lg text-zinc-600 dark:text-gray-300">
              Start your journey today and join our community of successful developers
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/browseCourses">
              <motion.button
                className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Learning Now</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 blur transition-opacity group-hover:opacity-20" />
              </motion.button>
            </Link>
            
            <Link href="/browseSessions">
              <motion.button
                className="group inline-flex items-center gap-3 rounded-full border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-zinc-800 transition-all duration-300 hover:bg-gray-50 hover:scale-105 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="h-5 w-5" />
                <span>Book a Session</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const OfferingCard = ({ 
  link, 
  title, 
  description, 
  icon: Icon, 
  gradient, 
  bgGradient, 
  darkBgGradient, 
  features, 
  stats,
  badge,
  index 
}: any) => {
  return (
    <motion.div
      className="offering-card group relative h-full cursor-pointer"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={link} className="block h-full">
        <div className={`relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br ${bgGradient} p-6 shadow-lg transition-all duration-300 hover:shadow-2xl dark:border-gray-800 dark:bg-gradient-to-br ${darkBgGradient}`}>
          {/* Badge */}
          {badge && (
            <div className="absolute -top-2 -right-2 z-10">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                badge === "Most Popular" ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" :
                badge === "Free" ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white" :
                badge === "Premium" ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white" :
                "bg-gradient-to-r from-blue-400 to-cyan-500 text-white"
              }`}>
                {badge}
              </span>
            </div>
          )}

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full bg-gradient-to-br from-current to-transparent" />
          </div>

          {/* Icon */}
          <div className="relative mb-6">
            <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${gradient} p-3 shadow-lg`}>
              <Icon className="floating-icon h-8 w-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="relative space-y-4">
            <div>
              <h3 className="text-xl font-bold text-zinc-800 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-gray-300">
                {description}
              </p>
            </div>

            {/* Stats */}
            {stats && (
              <div className="flex items-center space-x-2 text-sm text-zinc-600 dark:text-gray-400">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{stats}</span>
              </div>
            )}

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

            {/* Arrow */}
            <div className="pt-4">
              <ArrowRight className={`h-5 w-5 text-transparent transition-all duration-300 group-hover:text-current group-hover:translate-x-1 bg-gradient-to-r ${gradient} bg-clip-text`} />
            </div>
          </div>

          {/* Hover Effect */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
        </div>
      </Link>
    </motion.div>
  );
};

const HighlightCard = ({ icon: Icon, title, description }: any) => {
  return (
    <motion.div
      className="highlight-item text-center"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2">
            {title}
          </h4>
          <p className="text-sm text-zinc-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Offerings;
