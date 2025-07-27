"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Users, Video, Star, Clock, Zap } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-blue-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl opacity-20 -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 dark:bg-purple-800 rounded-full blur-3xl opacity-20 translate-y-48 -translate-x-48"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              {/* live learning and interactive capsules */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Live Learning
                  </span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Interactive
                  </span>
                </div>
              </div>

              {/* Text Content */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                Connect with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Expert Mentors
                </span>{" "}
                in Real-Time
              </h1>

              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                Book one-on-one sessions with industry experts, join group
                discussions, and accelerate your learning journey with
                personalized guidance.
              </p>
            </div>

            {/* Browse Session, Become Mentor Buttons */}
            {/* sm:flex-row */}
            <div className="flex flex-col  gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 text-sm tracking-tight to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Video className="h-5 w-5 mr-2" />
                Browse Sessions
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border border-stroke border-gray-300 shadow-xs text-sm tracking-tight group dark:border-zinc-600 group-hover:text-blue-500 group-hover:border-blue-500 dark:group-hover:border-blue-400 px-8 py-3 text-md font-semibold transition-all duration-300"
              >
                <Users className="h-5 w-5 mr-2" />
                Become a Mentor
              </Button>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8"
            >
              {/* Flexible Scheduling */}
              <div className="flex flex-col items-start gap-2 p-4 bg-white/50 dark:bg-zinc-800/50 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-zinc-700">
                <div className="flex items-start space-x-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>

                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    Flexible Scheduling
                  </p>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Book sessions at your convenience, 24/7 availability
                </p>
              </div>

              {/* HD Video Calls */}
              <div className="flex flex-col items-start gap-2 p-4 bg-white/50 dark:bg-zinc-800/50 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-zinc-700">
                <div className="flex items-start space-x-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Video className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>

                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    HD Video Calls
                  </p>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Crystal clear sessions with screen sharing
                </p>
              </div>

              {/* Expert Mentors */}
              <div className="flex flex-col items-start gap-2 p-4 bg-white/50 dark:bg-zinc-800/50 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-zinc-700">
                <div className="flex items-start space-x-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>

                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    Expert Mentors
                  </p>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Learn from verified industry professionals
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative h-[500px] lg:h-[600px] flex items-center justify-center"
          >
            <div className="relative w-full h-full max-w-md">
              <Image
                src="/assets/images/illus.webp"
                alt="Online Learning Illustration"
                // fill
                height={500}
                width={500}
                className="object-contain drop-shadow-2xl"
                priority
              />

              {/* Floating stats cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -top-4 -right-4 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      500+
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Active Mentors
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Sessions Completed */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute bottom-50 -left-4 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      10k+
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Sessions Completed
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
