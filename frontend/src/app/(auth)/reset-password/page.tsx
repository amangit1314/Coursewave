"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { dmSans, poppins } from "@/lib/config/fonts";
import AuthBackgroundPattern from "@/components/auth/AuthBackgroundPattern";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";

const schema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const csrf = searchParams.get("csrf");
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const resetPasswordMutation = useResetPassword();

  const onSubmit = async (values: any) => {
    try {
      await resetPasswordMutation.mutateAsync(
        {
          token: token || "",
          csrfToken: csrf || "",
          newPassword: values.newPassword,
        },
        {
          onSuccess: () => {
            setSuccess(true);
            toast.success("Password reset successful!");
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message || "Password reset failed"
            );
          },
        }
      );
    } catch (error: any) {
      toast.error(error?.message || "Password reset failed");
    }
  };

  if (!token || !csrf)
    return (
      <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-950">
        <AuthBackgroundPattern />
        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md text-center bg-white/80 p-8 rounded-2xl shadow-2xl backdrop-blur-xl dark:bg-gray-800/80"
          >
            <p className={`${poppins.className} text-red-600 text-lg`}>
              Invalid or expired link.
            </p>
            <Link
              href="/forgot-password"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Request a new reset link
            </Link>
          </motion.div>
        </div>
      </div>
    );

  if (success)
    return (
      <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-950">
        <AuthBackgroundPattern />
        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white/80 p-8 rounded-2xl shadow-2xl backdrop-blur-xl dark:bg-gray-800/80 text-center"
          >
            <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p
                  className={`${poppins.className} text-sm text-green-800 dark:text-green-200`}
                >
                  Your password has been successfully reset!
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <Button
                onClick={() => router.push("/login")}
                className={`${dmSans.className} w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white shadow-lg`}
              >
                Continue to Login
              </Button>

              <Link href="/">
                <Button
                  variant="outline"
                  className={`${poppins.className} w-full rounded-xl border-gray-300 bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300`}
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );

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
                Reset Your Password
              </h1>
              <p
                className={`${poppins.className} mt-2 text-sm text-gray-600 dark:text-gray-400`}
              >
                Enter your new password below.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${poppins.className} text-sm font-medium text-gray-700 dark:text-gray-300`}
                      >
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                          disabled={resetPasswordMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          disabled={resetPasswordMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={
                    !form.formState.isValid || resetPasswordMutation.isPending
                  }
                  className={`${dmSans.className} group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50`}
                >
                  {resetPasswordMutation.isPending
                    ? "Submitting..."
                    : "Reset Password"}
                </Button>
              </form>
            </Form>

            <div className="text-center mt-4">
              <Link
                href="/forgot-password"
                className={`${poppins.className} flex items-center justify-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200`}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Forgot Password
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
