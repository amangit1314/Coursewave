"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/useAuth";
import { dmSans, poppins } from "@/lib/config/fonts";
import { motion } from "framer-motion";
import { Eye, EyeOff, LucideLoader2, Mail, Lock } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for validation
const registerSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: register, isPending } = useRegister();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // instant validation + enables button only when valid
  });

  const onSubmit = (data: RegisterFormData) => {
    register(data, {
      onSuccess: (res) => {
        toast.success(res.message ?? "User registered successfully 🎉");
        router.push("/login");
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-center"
    >
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-xl dark:bg-gray-800/90 border border-white/20 dark:border-gray-700/30">
        <div className="text-center">
          <h2
            className={`${dmSans.className} text-2xl font-bold text-gray-900 dark:text-white`}
          >
            Create your account
          </h2>
          <p
            className={`${poppins.className} mt-2 text-sm text-gray-600 dark:text-gray-400`}
          >
            Start your learning journey today. It's completely free!
          </p>
        </div>

        <div className="space-y-6">
          {/* Google Sign Up */}
          {/* <Button
            variant="outline"
            className={`${dmSans.className} group relative h-12 w-full overflow-hidden rounded-xl border-2 border-gray-300 bg-white font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`${poppins.className} bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400`}
              >
                Or sign up with email
              </span>
            </div>
          </div> */}

          {/* Email Input */}
          <div className="space-y-2">
            <label
              className={`${dmSans.className} text-sm font-medium text-gray-700 dark:text-gray-300`}
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 h-12 rounded-xl border-gray-300 bg-white/50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder:text-gray-400"
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                {...formRegister("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              className={`${dmSans.className} text-sm font-medium text-gray-700 dark:text-gray-300`}
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 pr-10 h-12 rounded-xl border-gray-300 bg-white/50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder:text-gray-400"
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a strong password"
                {...formRegister("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Terms */}
          <div className="text-center">
            <p
              className={`${poppins.className} text-xs text-gray-500 dark:text-gray-400`}
            >
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Register Button */}
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isPending}
            className={`${dmSans.className} group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50`}
          >
            {isPending ? (
              <LucideLoader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Create Account
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/0 to-cyan-600/0 transition-all duration-300 group-hover:from-blue-600/20 group-hover:to-cyan-600/20" />
              </>
            )}
          </Button>

          {/* Sign In Link */}
          <div className="text-center">
            <p
              className={`${poppins.className} text-sm text-gray-600 dark:text-gray-400`}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className={` ${dmSans.className} font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300`}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
