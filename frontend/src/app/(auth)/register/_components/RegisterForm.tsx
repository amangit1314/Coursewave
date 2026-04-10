"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/useAuth";
import { dmSans } from "@/lib/config/fonts";
import { motion } from "framer-motion";
import { Eye, EyeOff, LucideLoader2, Mail, Lock } from "lucide-react";
import React, { useEffect } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fadeInUp } from "@/lib/config/motion";

const RegisterForm = () => {
  const { mutate: register, isPending } = useRegister();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [isButtonDisabled, setButtonDisabled] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const router = useRouter();

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onRegister = async () => {
    register(user, {
      onSuccess: (data) => {
        toast.success(data.message ?? "Registration successful");
        setTimeout(() => {
          router.push("/login");
        }, 100);
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
        <div className="text-center">
          <h2
            className={`${dmSans.className} text-2xl tracking-tight font-bold text-foreground`}
          >
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start your learning journey today. It&apos;s completely free!
          </p>
        </div>

        <div className="space-y-6">
          {/* Google Sign Up */}
          <Button
            variant="outline"
            className="h-11 w-full rounded-lg font-medium transition-colors"
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-muted-foreground">
                Or sign up with email
              </span>
            </div>
          </div>

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
                className="pl-10 h-11 rounded-lg border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-ring"
                id="email"
                type="email"
                autoComplete="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
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
                className="pl-10 pr-10 h-11 rounded-lg border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-ring"
                id="password"
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                autoComplete="new-password"
                placeholder="Create a strong password"
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
          </div>

          {/* Terms */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Register Button */}
          <Button
            onClick={onRegister}
            disabled={isButtonDisabled || isPending}
            className={`${dmSans.className} h-11 w-full rounded-lg font-semibold transition-all duration-200 disabled:opacity-50`}
          >
            {isPending ? (
              <LucideLoader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
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
