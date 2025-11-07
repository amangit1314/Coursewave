
// app/forgot-password/page.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPassword } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, ArrowLeft, Lock, CheckCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { dmSans, poppins } from "@/lib/config/fonts";
import AuthBackgroundPattern from "@/components/auth/AuthBackgroundPattern";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const ForgotPasswordPage = () => {
  const forgotPasswordMutation = useForgotPassword();
  const [sent, setSent] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: any) => {
    try {
      await forgotPasswordMutation.mutateAsync(values.email, {
        onSuccess: () => {
          setSent(true);
          toast.success("If an account exists, a reset link was sent!");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to send reset link"
          );
        },
      });
    } catch (error: any) {
      toast.error(error?.message || "Failed to send reset link");
    }
  };

  if (sent) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-950">
        <AuthBackgroundPattern />
        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:bg-gray-800/80">
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h1
                  className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white`}
                >
                  Password Reset Requested
                </h1>
                <p
                  className={`${poppins.className} mt-2 text-sm text-gray-600 dark:text-gray-400`}
                >
                  Check your email for a link to reset your password.
                </p>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className={`${poppins.className} flex items-center justify-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200`}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-950">
      <AuthBackgroundPattern />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:bg-gray-800/80">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h1
                className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white`}
              >
                Forgot Your Password!
              </h1>
              <p
                className={`${poppins.className} mt-2 text-sm text-gray-600 dark:text-gray-400`}
              >
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${poppins.className} text-sm font-medium text-gray-700 dark:text-gray-300`}
                      >
                        Email address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            className="pl-10 h-12 rounded-xl border-gray-300 bg-white/50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder:text-gray-400 flex items-center"
                            placeholder="Enter your email address"
                            disabled={forgotPasswordMutation.isPending}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription
                        className={`${poppins.className} text-xs text-gray-500 dark:text-gray-400`}
                      >
                        We'll send a reset code to this email address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={
                    !form.formState.isValid || forgotPasswordMutation.isPending
                  }
                  className={`${dmSans.className} group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50`}
                >
                  {forgotPasswordMutation.isPending ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/0 to-cyan-600/0 transition-all duration-300 group-hover:from-blue-600/20 group-hover:to-cyan-600/20" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center mt-2">
              <Link
                href="/login"
                className={`${poppins.className} flex items-center justify-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200`}
              >
                <ArrowLeft className="mr-2  h-4 w-4" />
                Back to login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
