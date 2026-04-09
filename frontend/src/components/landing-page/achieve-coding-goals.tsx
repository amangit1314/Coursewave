"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, CheckCircle, Zap, Shield } from "lucide-react";
import { dmSans } from "@/lib/config/fonts";
import { Button } from "@/components/ui/button";

const benefits = [
  "Lifetime access to all purchased courses",
  "New content added every week",
  "Certificate of completion",
  "Community access & peer support",
];

const AchieveCodingGoals = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:px-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* Left: Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
                <Rocket className="h-4 w-4 text-cyan-300" />
                <span
                  className={`${dmSans.className} text-sm font-medium text-white/90`}
                >
                  Ready to level up?
                </span>
              </div>

              <h2
                className={`${dmSans.className} text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl`}
              >
                Start building your future{" "}
                <span className="text-cyan-300">today</span>
              </h2>

              <p className="mt-6 max-w-lg text-lg text-blue-100/80">
                Join a community of developers who are shipping real projects,
                landing better jobs, and building the careers they want.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className={`${dmSans.className} h-12 rounded-full bg-white px-8 text-base font-semibold text-blue-700 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl sm:h-14 sm:px-10 sm:text-lg`}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/browse">
                <Button
                  variant="outline"
                  size="lg"
                  className={`${dmSans.className} h-12 rounded-full border-white/30 px-8 text-base font-semibold text-white transition-all duration-300 hover:bg-white/10 sm:h-14 sm:px-10 sm:text-lg`}
                >
                  View Courses
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right: Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="w-full max-w-sm"
          >
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-300" />
                <h3
                  className={`${dmSans.className} text-lg font-semibold text-white`}
                >
                  What you get
                </h3>
              </div>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-300" />
                    <span className="text-sm text-white/90">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center gap-2 rounded-xl bg-white/10 p-3">
                <Zap className="h-5 w-5 text-yellow-300" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    No credit card required
                  </p>
                  <p className="text-xs text-white/60">
                    Start with free courses instantly
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AchieveCodingGoals;
