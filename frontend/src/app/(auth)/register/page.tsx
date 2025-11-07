"use client";

import React from "react";
import { motion } from "framer-motion";
import RegisterLeftSection from "./_components/RegisterLeftSection";
import RegisterForm from "./_components/RegisterForm";
import AuthBackgroundPattern from "@/components/auth/AuthBackgroundPattern";

const RegisterPage = () => {
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
            <RegisterLeftSection />

            {/* Right Section - Register Form */}
            <RegisterForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
