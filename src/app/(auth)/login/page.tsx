"use client";

// import axios from "axios";
import Link from "next/link";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { LucideLoader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useUserStore } from "@/zustand/userStore";
import { motion } from "framer-motion";
import { orbitron, poppins } from "@/lib/fonts";

// axios.defaults.withCredentials = true;
// axios.defaults.headers.post["Content-Type"] = "application/json";

const Login = () => {
  const [user, setUserInfo] = React.useState({ email: "", password: "" });
  const [isButtonDisabled, setButtonDisabled] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { loginUser, loadingState } = useUserStore();

  const onLogin = async () => {
    loginUser(user.email, user.password);
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
                <div className="flex items-center space-x-2">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <span className={`${orbitron.className} text-white font-bold text-lg`}>CW</span>
                  </div>
                  <span className={`${orbitron.className} text-2xl font-bold text-gray-800 dark:text-white`}>
                    CourseWave
                  </span>
                </div>
                
                <div className="space-y-4">
                  <h1 className={`${poppins.className} text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl`}>
                    Welcome back to{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      CourseWave
                    </span>
                  </h1>
                  <p className={`${poppins.className} text-lg text-gray-600 dark:text-gray-300`}>
                    Sign in to continue your learning journey and unlock unlimited possibilities.
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <span className={`${poppins.className} text-sm text-gray-500 dark:text-gray-400`}>
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
                  <span className={`${poppins.className} text-sm text-gray-600 dark:text-gray-300`}>
                    Expert-led courses
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <span className={`${poppins.className} text-sm text-gray-600 dark:text-gray-300`}>
                    Lifetime access
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <span className="text-purple-600 dark:text-purple-400">✓</span>
                  </div>
                  <span className={`${poppins.className} text-sm text-gray-600 dark:text-gray-300`}>
                    Community support
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <span className="text-orange-600 dark:text-orange-400">✓</span>
                  </div>
                  <span className={`${poppins.className} text-sm text-gray-600 dark:text-gray-300`}>
                    Certificate included
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Section - Login Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:bg-gray-800/80">
                <div className="text-center">
                  <h2 className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white`}>
                    Sign in to your account
                  </h2>
                  <p className={`${poppins.className} mt-2 text-sm text-gray-600 dark:text-gray-400`}>
                    Welcome back! Please enter your details.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Google Sign In */}
                  <SignInWithGoogleButton />

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className={`${poppins.className} bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400`}>
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className={`${poppins.className} text-sm font-medium text-gray-700 dark:text-gray-300`}>
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        className="pl-10 h-12 rounded-xl border-gray-300 bg-white/50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder:text-gray-400"
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => {
                          setUserInfo({ ...user, email: e.target.value });
                        }}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className={`${poppins.className} text-sm font-medium text-gray-700 dark:text-gray-300`}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        className="pl-10 pr-10 h-12 rounded-xl border-gray-300 bg-white/50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder:text-gray-400"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={user.password}
                        onChange={(e) =>
                          setUserInfo({ ...user, password: e.target.value })
                        }
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="flex items-center justify-between">
                    <Link
                      href="/forgotPassword"
                      className={`${poppins.className} text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300`}
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <Button
                    onClick={onLogin}
                    disabled={isButtonDisabled || loadingState.loading}
                    className={`${orbitron.className} group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50`}
                  >
                    {loadingState.loading ? (
                      <LucideLoader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/0 to-cyan-600/0 transition-all duration-300 group-hover:from-blue-600/20 group-hover:to-cyan-600/20" />
                      </>
                    )}
                  </Button>

                  {/* Sign Up Link */}
                  <div className="text-center">
                    <p className={`${poppins.className} text-sm text-gray-600 dark:text-gray-400`}>
                      Don't have an account?{" "}
                      <Link 
                        href="/register" 
                        className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Sign up for free
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

const SignInWithGoogleButton = () => {
  return (
    <Button
      variant="outline"
      onClick={() => signIn()}
      className={`${poppins.className} group relative h-12 w-full overflow-hidden rounded-xl border-2 border-gray-300 bg-white font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
    >
      <FcGoogle className="mr-2 h-5 w-5" />
      Continue with Google
    </Button>
  );
};

export default Login;
