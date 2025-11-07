"use client";

import { motion } from "framer-motion";
import LoginLeftSection from "./_components/LoginLeftSection";
import AuthBackgroundPattern from "@/components/auth/AuthBackgroundPattern";
import LoginForm from "./_components/LoginForm";

const Login = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-950">
      {/* Background Pattern */}
      <AuthBackgroundPattern />
      
      <div className="relative flex min-h-screen items-center justify-center p-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-6xl"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <LoginLeftSection />
            <LoginForm />
          </div>
        </motion.div>
      </div>
   
    </div>
  );
};

export default Login;
