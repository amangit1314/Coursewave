"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { dmSans } from "@/lib/config/fonts";

const testimonials = [
  {
    name: "Josh Mayer",
    role: "Full Stack Developer",
    company: "TechCorp Inc.",
    comment:
      "CourseWave transformed my career completely! The hands-on projects and expert guidance helped me land my dream job. The community support is incredible.",
    rating: 5.0,
    initials: "JM",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Ankit Sharma",
    role: "Backend Engineer",
    company: "StartupXYZ",
    comment:
      "The Backend Pro course exceeded all my expectations. Real-world projects and industry best practices made all the difference. Now I build scalable systems with confidence.",
    rating: 4.8,
    initials: "AS",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Rohan Singh",
    role: "Mobile Developer",
    company: "MobileFirst",
    comment:
      "From complete beginner to confident developer in just 6 months! The structured learning path and mentorship sessions were absolute game-changers.",
    rating: 4.9,
    initials: "RS",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "Emily Johnson",
    role: "Frontend Developer",
    company: "WebScale",
    comment:
      "The React Mastery Workshop helped me build complex, production-ready projects independently. Highly recommended for anyone serious about frontend development!",
    rating: 5.0,
    initials: "EJ",
    gradient: "from-orange-500 to-red-500",
  },
  {
    name: "Priya Patel",
    role: "Data Scientist",
    company: "DataDriven",
    comment:
      "The Python for Data Science course was exactly what I needed. Clear explanations, practical exercises, and the projects gave me a portfolio that got me hired.",
    rating: 4.9,
    initials: "PP",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    name: "David Kim",
    role: "DevOps Engineer",
    company: "CloudNative",
    comment:
      "Finally found a platform that teaches real-world skills. The deployment and CI/CD courses are top-notch. Worth every penny and then some.",
    rating: 4.8,
    initials: "DK",
    gradient: "from-sky-500 to-blue-500",
  },
];

const Testimonials = () => {
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
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span
            className={`${dmSans.className} text-sm font-medium text-blue-700 dark:text-blue-300`}
          >
            Loved by Developers
          </span>
        </div>
        <h2
          className={`${dmSans.className} text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl`}
        >
          What our{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            students say
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Join thousands of developers who&apos;ve accelerated their careers
          with CourseWave
        </p>
      </motion.div>

      {/* Testimonial grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
            className="group relative rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          >
            {/* Quote icon */}
            <Quote className="mb-4 h-8 w-8 text-blue-100 dark:text-zinc-800" />

            {/* Rating */}
            <div className="mb-4 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(testimonial.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {testimonial.rating}
              </span>
            </div>

            {/* Comment */}
            <p className="mb-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              &ldquo;{testimonial.comment}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.gradient} text-sm font-bold text-white`}
              >
                {testimonial.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {testimonial.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
