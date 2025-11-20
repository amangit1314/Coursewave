"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Play, Users, Award, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EnhancedHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Split text for character animation
  useEffect(() => {
    if (titleRef.current) {
      const text = titleRef.current.innerText;
      titleRef.current.innerHTML = text
        .split("")
        .map(char => char === " " 
          ? `<span class="char">&nbsp;</span>` 
          : `<span class="char">${char}</span>`)
        .join("");
    }
  }, []);

  // GSAP animations
  useEffect(() => {
    // Title character animation
    gsap.from(".char", {
      y: 100,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: 0.03,
      delay: 0.3,
    });

    // Subtitle animation
    if (subtitleRef.current) {
      gsap.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 1.2,
        ease: "power3.out",
      });
    }

    // CTA animation
    if (ctaRef.current) {
      gsap.from(ctaRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 1.6,
        ease: "power3.out",
      });
    }

    // Card animations
    gsap.from(".feature-card", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      delay: 2,
      ease: "back.out(1.2)",
    });
  }, []);

  return (
    <div ref={heroRef} className="relative w-full overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-500 opacity-10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500 opacity-10 blur-[100px]" />
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 -z-10 flex justify-between">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="grid-line h-full w-px bg-gray-200 dark:bg-gray-800 opacity-30"
          />
        ))}
      </div>

      {/* Hero content */}
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8">
        <div className="text-center">
          <h1 
            ref={titleRef}
            className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
          >
            Elevate Your Coding Journey
          </h1>
          
          <p 
            ref={subtitleRef}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl"
          >
            Master in-demand skills with expert-led courses, interactive projects, and a supportive community of developers.
          </p>
          
          <div ref={ctaRef} className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/browse"
                className="flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg"
              >
                Explore Courses
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/register"
                className="flex items-center justify-center rounded-md border border-blue-600 bg-white px-8 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 dark:bg-transparent dark:text-blue-400 dark:hover:bg-blue-900/20 md:py-4 md:px-10 md:text-lg"
              >
                Join Now
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <Sparkles className="h-6 w-6 text-blue-500" />,
              title: "Interactive Learning",
              description: "Hands-on projects and exercises to reinforce your skills"
            },
            {
              icon: <Users className="h-6 w-6 text-purple-500" />,
              title: "Expert Community",
              description: "Connect with industry professionals and fellow learners"
            },
            {
              icon: <Award className="h-6 w-6 text-green-500" />,
              title: "Recognized Certificates",
              description: "Earn credentials valued by top employers worldwide"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 dark:bg-blue-900/20">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-500 opacity-20"
              style={{
                width: 10 + Math.random() * 20,
                height: 10 + Math.random() * 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedHero;