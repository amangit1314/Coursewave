"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { orbitron, poppins } from "@/lib/config/fonts";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import Link from "next/link";
import { LucideLoader2 } from "lucide-react";

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("resetToken");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const url =
      process.env.ENVIRONMENT === "DEVELOPMENT"
        ? "/api/auth/resetPassword"
        : "api/auth/resetPassword";
    await axios
      .patch(
        url,
        JSON.stringify({ token: token!, newPassword: values.password })
      )
      .then(() => {
        router.push(`/login`);
        toast.success("Password successfully changed ✔");
      })
      .catch((err: any) => {
        console.log("Error in changing password: ", err.message);
        toast.error(`Error in changing password: ${err.message}`);
      });
  };

  const benefits = [
    "Strong password protection",
    "Secure encryption",
    "Instant access after reset",
    "24/7 account security",
    "Multi-device compatibility",
  ];

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

              {/* Benefits */}
              {/* <div className="space-y-4">
                <h3
                  className={`${poppins.className} text-lg font-semibold text-gray-900 dark:text-white`}
                >
                  Why reset your password:
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span
                        className={`${poppins.className} text-sm text-gray-600 dark:text-gray-300`}
                      >
                        {benefit}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div> */}

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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:bg-gray-800/80">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h2
                        className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white`}
                      >
                        Reset Your Password
                      </h2>
                      <p
                        className={`${poppins.className} mt-2 text-sm text-gray-600 dark:text-gray-400`}
                      >
                        Enter your new password below
                      </p>
                    </div>

                    {/* New Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className={`${poppins.className} text-sm font-medium text-gray-700 dark:text-gray-300`}
                          >
                            New Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                              <Input
                                disabled={isSubmitting}
                                type={showPassword ? "text" : "password"}
                                className="pl-10 pr-10 h-12 rounded-xl border-gray-300 bg-white/50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder:text-gray-400"
                                placeholder="Enter your new password"
                                {...field}
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
                          </FormControl>
                          <FormDescription
                            className={`${poppins.className} text-xs`}
                          >
                            Must be at least 8 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className={`${poppins.className} text-sm font-medium text-gray-700 dark:text-gray-300`}
                          >
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                              <Input
                                disabled={isSubmitting}
                                type={showConfirmPassword ? "text" : "password"}
                                className="pl-10 pr-10 h-12 rounded-xl border-gray-300 bg-white/50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder:text-gray-400"
                                placeholder="Confirm your new password"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormDescription
                            className={`${poppins.className} text-xs`}
                          >
                            Must match your new password
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className={`${orbitron.className} group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50`}
                    >
                      {isSubmitting ? (
                        <LucideLoader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Reset Password
                          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/0 to-cyan-600/0 transition-all duration-300 group-hover:from-blue-600/20 group-hover:to-cyan-600/20" />
                        </>
                      )}
                    </Button>

                    {/* Back to Login Link */}
                    <div className="text-center">
                      <p
                        className={`${poppins.className} text-sm text-gray-600 dark:text-gray-400`}
                      >
                        Remember your password?{" "}
                        <Link
                          href="/login"
                          className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default ResetPassword;
