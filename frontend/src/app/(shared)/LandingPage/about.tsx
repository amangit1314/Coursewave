"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Sparkles, 
  Play, 
  Users, 
  Award, 
  Globe, 
  Zap,
  CheckCircle
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of real-world experience"
    },
    {
      icon: Award,
      title: "Quality Content",
      description: "Meticulously crafted courses designed for practical application"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with developers worldwide and share knowledge"
    },
    {
      icon: Zap,
      title: "Fast Learning",
      description: "Accelerated learning paths designed for career growth"
    }
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate section title
    gsap.fromTo(
      ".about-title",
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

    // Animate content sections
    gsap.fromTo(
      ".about-content",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );

    // Animate features
    gsap.fromTo(
      ".feature-item",
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
              About CourseWave
            </span>
            <Sparkles className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className="about-title text-3xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-4xl lg:text-5xl">
            Empowering Developers
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}Worldwide
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
            We're on a mission to democratize tech education and help developers achieve their career dreams
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Video Section */}
          <motion.div 
            ref={videoRef}
            className="about-content relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-2 shadow-2xl dark:from-blue-950/20 dark:to-cyan-950/20">
              {/* Video Placeholder */}
              <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
                    <Play className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                {/* Overlay Stats */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between rounded-lg bg-white/90 px-4 py-2 backdrop-blur-sm dark:bg-gray-800/90">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Watch Our Story
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      2 min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div 
            className="about-content space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Description */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-zinc-800 dark:text-white sm:text-3xl">
                Your Gateway to Tech Excellence
              </h3>
              
              <div className="space-y-4 text-lg text-zinc-600 dark:text-gray-300">
                <p>
                  CourseWave is more than just a learning platform—it's a comprehensive ecosystem designed to accelerate your career in technology. We believe that quality education should be accessible to everyone, regardless of their background or location.
                </p>
                <p>
                  Our expert-led courses, hands-on projects, and vibrant community create the perfect environment for you to master in-demand skills and build a successful career in tech.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-zinc-800 dark:text-white">50K+</div>
                  <div className="text-sm text-zinc-600 dark:text-gray-400">Active Learners</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-zinc-800 dark:text-white">95%</div>
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

const FeatureCard = ({ icon: Icon, title, description }: any) => {
  return (
    <motion.div
      className="feature-item group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start space-x-3">
        {/* h-10 w-10  */}
        <div className="flex items-center p-5 justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-zinc-800 dark:text-white">
            {title}
          </h4>
          <p className="mt-1 text-sm text-zinc-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
