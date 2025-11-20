import { orbitron, poppins } from "@/lib/config/fonts";
import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";

type Props = {};

const LoginLeftSection = (props: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col justify-center space-y-8"
    >
      <div className="space-y-6">
      {/* Logo */}

        <div className="flex items-center space-x-2 transition-opacity">
          <Image
            src="/assets/images/logo/coursewave-favicon-color.png"
            alt="CourseWave Logo"
            width={32}
            height={32}
            priority
            className="h-8 w-8 sm:h-9 sm:w-9"
          />
          <p
            className={`${orbitron.className} text-lg font-extrabold capitalize tracking-tight text-blue-500 sm:text-xl`}
          >
            Coursewave
          </p>
        </div>

        <div className="space-y-4">
          <h1
            className={`${poppins.className} text-4xl tracking-tight font-bold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl`}
          >
            Welcome back to{" "}
            <span className="bg-gradient-to-r tracking-tight from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Coursewave
            </span>
          </h1>
          <p
            className={`${poppins.className} text-lg text-gray-600 dark:text-gray-300`}
          >
            Sign in to continue your learning journey and unlock unlimited
            possibilities.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <span
            className={`${poppins.className} text-sm text-gray-500 dark:text-gray-400`}
          >
            Join 50,000+ learners worldwide
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
          </div>
          <span
            className={`${poppins.className} text-sm text-gray-600 dark:text-gray-300`}
          >
            Expert-led courses
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
            <span className="text-green-600 dark:text-green-400">✓</span>
          </div>
          <span
            className={`${poppins.className} text-sm text-gray-600 dark:text-gray-300`}
          >
            Lifetime access
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <span className="text-purple-600 dark:text-purple-400">✓</span>
          </div>
          <span
            className={`${poppins.className} text-sm text-gray-600 dark:text-gray-300`}
          >
            Community support
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <span className="text-orange-600 dark:text-orange-400">✓</span>
          </div>
          <span
            className={`${poppins.className} text-sm text-gray-600 dark:text-gray-300`}
          >
            Certificate included
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginLeftSection;
