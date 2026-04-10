"use client";

import { dmSans } from "@/lib/config/fonts";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { loginSchema, LoginSchema } from "@/lib/validations/loginSchema";
import { useLogin } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fadeInUp } from "@/lib/config/motion";

const LoginForm = () => {
  const { mutate: login, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/browse");
  }, [router]);

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
        router.push("/browse");
      },
    });
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-center"
    >
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card/80 p-8 shadow-lg backdrop-blur-xl">
        {/* Heading */}
        <div className="text-center">
          <h2
            className={`${dmSans.className} text-2xl tracking-tight font-bold text-foreground`}
          >
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label
              className={`${dmSans.className} text-sm font-medium text-foreground`}
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="pl-10 h-11 rounded-lg border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-ring"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              className={`${dmSans.className} text-sm font-medium text-foreground`}
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className="pl-10 pr-10 h-11 rounded-lg border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className={`${dmSans.className} text-sm text-primary hover:text-primary/80 transition-colors`}
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || isPending || !!error}
            className={`${dmSans.className} h-11 w-full rounded-lg font-semibold transition-all duration-200 disabled:opacity-50`}
          >
            {isSubmitting || isPending ? "Signing In..." : "Sign In"}
          </Button>

          {/* Sign Up */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
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
