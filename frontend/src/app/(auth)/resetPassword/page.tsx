"use client";

import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { dmSans, poppins } from "@/lib/config/fonts";
import ResetForm from "./_components/ResetForm";
import AuthBackgroundPattern from "@/components/auth/AuthBackgroundPattern";

const ResetPassword = () => {
  return (
    <div className="relative min-h-screen overflow-hidden  bg-white dark:bg-gray-950">
      <AuthBackgroundPattern />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-6xl"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Section - Hero */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col justify-center space-y-8"
            >
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1
                    className={`${poppins.className} text-4xl tracking-tight font-bold text-gray-900 dark:text-white sm:text-5xl lg:text-5xl 2xl:text-6xl`}
                  >
                    Reset Your{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Password
                    </span>
                  </h1>
                  <p
                    className={`${poppins.className} text-lg text-gray-600 dark:text-gray-300`}
                  >
                    Secure your account with a new password and continue your
                    learning journey.
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <span
                    className={`${poppins.className} text-sm text-gray-500 dark:text-gray-400`}
                  >
                    Trusted by 50,000+ learners worldwide
                  </span>
                </div>
              </div>

              {/* Security Info */}
              <div className="space-y-2">
                <h4
                  className={`${poppins.className} text-lg font-semibold text-gray-900 dark:text-white`}
                >
                  Password Security Tips
                </h4>
                <ul
                  className={`${poppins.className} list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300`}
                >
                  <li>Use at least 8 characters</li>
                  <li>Include numbers and special characters</li>
                  <li>Avoid common words or phrases</li>
                  <li>Don't reuse passwords from other sites</li>
                </ul>
              </div>
            </motion.div>

            {/* Right Section - Reset Form */}
            <ResetForm />
          </div>
        </motion.div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default ResetPassword;
