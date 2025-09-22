"use client";

import React, { useRef, useEffect, useState } from "react";
import { IoArrowForward } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Play, Users, Award, Zap } from "lucide-react";
import { dmSans } from "@/lib/config/fonts";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Pre-calculate particle positions using a deterministic pattern
const particles = Array.from({ length: 20 }, (_, i) => {
  const angle = (i / 20) * Math.PI * 2; // Distribute particles in a circular pattern
  const radius = 40 + (i % 3) * 20; // Vary the radius to create depth
  const spiralFactor = i * 0.2; // Add a spiral effect

  return {
    left: 50 + Math.cos(angle) * radius + spiralFactor,
    top: 50 + Math.sin(angle) * radius + spiralFactor,
    delay: (i / 20) * 5, // Evenly distribute delays
  };
});

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Only render particles on client side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      // Title character animation with enhanced timing
      gsap.from(".char", {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.03,
        delay: 0.3,
      });

      // Subtitle animation
      gsap.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 1.2,
        ease: "power3.out",
      });

      // CTA animation
      gsap.from(ctaRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 1.6,
        ease: "power3.out",
      });

      // Stats animation
      gsap.from(".stat-item", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        delay: 2,
        ease: "back.out(1.2)",
      });

      // Enhanced grid animation
      gsap.fromTo(
        ".grid-line",
        { opacity: 0, scaleY: 0 },
        {
          opacity: 0.1,
          scaleY: 1,
          duration: 2,
          stagger: 0.05,
          ease: "power3.out",
          delay: 0.5,
        }
      );

      // Floating elements with more complex animation
      gsap.to(".floating-shape", {
        y: "+=30",
        x: "+=15",
        rotation: "+=8",
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3,
      });

      // Pulsing dots with enhanced effect
      gsap.to(".pulsing-dot", {
        scale: 1.5,
        opacity: 0.8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.6,
      });

      // Scroll indicator with bounce effect
      gsap.to(scrollIndicatorRef.current, {
        y: 15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: 3,
      });

      // Background particles animation with deterministic pattern
      gsap.to(".bg-particle", {
        y: "-=100",
        opacity: 0,
        duration: 8,
        repeat: -1,
        ease: "none",
        stagger: {
          each: 0.1,
          from: "random",
        },
      });
    },
    { scope: containerRef }
  );

  const renderAnimatedTitle = (text: string) => {
    return text.split("").map((char, index) => (
      <span key={index} className="char inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  const stats = [
    { icon: Users, value: "10K+", label: "Active Students" },
    { icon: Award, value: "200+", label: "Expert Courses" },
    { icon: Zap, value: "95%", label: "Success Rate" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative pt-8 flex min-h-screen w-full items-center justify-center overflow-hidden dark:bg-gradient-to-br dark:from-neutral-950 dark:via-neutral-900 dark:to-black px-4 sm:px-6 lg:px-8"
    >
      {/* Background Particles */}
      {/* <div className="absolute inset-0 overflow-hidden">
        {mounted &&
          particles.map((particle, i) => (
            <div
              key={i}
              className="bg-particle absolute h-1 w-1 rounded-full bg-transparent
              "
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
      </div> */}

      {/* Animated grid background */}
      {/* <div ref={gridRef} className="absolute inset-0 z-0 flex justify-center">
        <div className="absolute h-full w-full max-w-6xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="grid-line absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-blue-500/20 to-transparent"
              style={{ left: `${(i + 1) * 5}%` }}
            />
          ))}
        </div>
      </div> */}

      {/* Enhanced floating futuristic shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="floating-shape absolute left-[10%] top-[15%] h-32 w-32 rounded-full bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 blur-[80px] sm:h-40 sm:w-40" />
        <div className="floating-shape absolute right-[15%] top-[25%] h-40 w-40 rotate-45 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-[100px] sm:h-48 sm:w-48" />
        <div className="floating-shape absolute bottom-[20%] left-[20%] h-24 w-24 rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-[60px] sm:h-32 sm:w-32" />
        <div className="floating-shape absolute bottom-[10%] right-[10%] h-36 w-36 rotate-12 bg-gradient-to-r from-amber-500/30 to-orange-500/30 blur-[90px] sm:h-44 sm:w-44" />
      </div>

      {/* Enhanced pulsing connection dots */}
      {/* <div className="absolute inset-0 z-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="pulsing-dot absolute h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-60"
            style={{
              left: `${5 + i * 8}%`,
              top: `${20 + Math.sin(i) * 30}%`,
            }}
          />
        ))}
      </div> */}

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl text-center">
        {/* Sparkles decoration */}
        <motion.div
          className="mb-8 flex items-center justify-center space-x-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Sparkles className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">
            Welcome to CourseWave
          </span>
          <Sparkles className="h-5 w-5 text-blue-400" />
        </motion.div>

        {/* Main Title */}
        <h1
          ref={titleRef}
          className={`${dmSans.className} mb-6 text-4xl font-bold tracking-tighter dark:text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl`}
        >
          {renderAnimatedTitle("Master the Future")}
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 bg-clip-text text-transparent">
            {/* {renderAnimatedTitle("of Technology")} */}
            {"of Technology"}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mx-auto mb-10 max-w-3xl text-base text-md sm:text-lg dark:text-neutral-300"
        >
          Join thousands of developers mastering cutting-edge skills with our
          <span className="text-blue-400 font-semibold">
            {" "}
            interactive courses
          </span>
          ,
          <span className="text-cyan-400 font-semibold">
            {" "}
            expert mentorship
          </span>
          , and
          <span className="text-purple-400 font-semibold">
            {" "}
            vibrant community
          </span>
        </p>

        {/* CTA Section */}
        <div
          // ref={ctaRef}
          className="mb-16 flex flex-col items-center space-y-1 sm:flex-row sm:justify-center sm:space-x-6 sm:space-y-0"
        >
          <motion.button
            onClick={() => (window.location.href = "/browse")}
            className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:shadow-blue-500/25"
            // whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Start Learning Now</span>
            <IoArrowForward className="hidden group-hover:flex transition-transform group-hover:translate-x-1 group-hover:animate-pulse" />
            {/* <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 blur transition-opacity group-hover:opacity-20" /> */}
          </motion.button>

          {/* <motion.button
            className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="h-5 w-5" />
            <span>Watch Demo</span>
          </motion.button> */}
        </div>

        {/* Stats Section */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-item group relative rounded-2xl border border-blue-200 dark:border-white/10 bg-blue-500 group-hover:bg-blue-600 dark:bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 dark:hover:bg-white/10 hover:scale-105"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-500/20 dark:to-cyan-500/20">
                  <stat.icon className="h-6 w-6 text-white dark:text-blue-400 group-hover:text-white dark:group-hover:text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white group-hover:text-white dark:text-white dark:group-hover:text-white sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-300/60 group-hover:text-white/85 dark:text-neutral-300 dark:group-hover:text-neutral-300 sm:text-base">
                    {stat.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="h-12 w-2"></div>
      </div>

      {/* Enhanced scanning line */}
      <div className="absolute left-0 top-0 z-0 h-px w-full bg-gradient-to-r from-transparent via-blue-500/70 to-transparent opacity-70" />

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform"
      >
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          <div className="h-8 w-5 rounded-full border-2 border-white/30 p-1">
            <div className="h-3 w-1 rounded-full bg-gradient-to-b from-blue-400 to-cyan-400" />
          </div>
          <FiChevronDown className="mt-2 text-white/60" size={20} />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
