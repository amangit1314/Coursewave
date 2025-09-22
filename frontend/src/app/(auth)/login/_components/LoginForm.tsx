

"use client";

import { dmSans, poppins } from "@/lib/config/fonts";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SignInWithGoogleButton from "./SignInWithGoogleButton";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { loginSchema, LoginSchema } from "@/lib/validations/loginSchema";
import { useLogin } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LoginForm = () => {
  const { mutate: login, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginSchema) => {
    login(data, {
      onSuccess: (data) => {
        toast.success(data.message ?? "Login successful");
        // redirect user after login success
        router.push("/browse");
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex items-center justify-center"
    >
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:bg-gray-800/80">
        {/* Heading */}
        <div className="text-center">
          <h2
            className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white`}
          >
            Sign in to your account
          </h2>
          <p
            className={`${poppins.className} mt-2 text-sm text-gray-600 dark:text-gray-400`}
          >
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Google Sign In */}
          <SignInWithGoogleButton />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`${poppins.className} bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400`}
              >
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label
              className={`${poppins.className} text-sm font-medium text-gray-700 dark:text-gray-300`}
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="pl-10 h-12 rounded-xl border-gray-300 bg-white/50 text-gray-900 placeholder:text-gray-500 
                  focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 
                  dark:text-white dark:placeholder:text-gray-400"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              className={`${poppins.className} text-sm font-medium text-gray-700 dark:text-gray-300`}
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className="pl-10 pr-10 h-12 rounded-xl border-gray-300 bg-white/50 text-gray-900 placeholder:text-gray-500 
                  focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 
                  dark:text-white dark:placeholder:text-gray-400"
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

          {/* Forgot Password */}
          <div className="flex items-center justify-between">
            <Link
              href="/forgotPassword"
              className={`${poppins.className} text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300`}
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || isPending || !!error}
            className={`${dmSans.className} group relative h-12 w-full overflow-hidden rounded-xl 
              bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white shadow-lg 
              transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50`}
          >
            {isSubmitting || isPending ? "Signing In..." : "Sign In"}
            <div
              className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/0 to-cyan-600/0 
              transition-all duration-300 group-hover:from-blue-600/20 group-hover:to-cyan-600/20"
            />
          </Button>

          {/* Sign Up */}
          <div className="text-center">
            <p
              className={`${poppins.className} text-sm text-gray-600 dark:text-gray-400`}
            >
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginForm;
