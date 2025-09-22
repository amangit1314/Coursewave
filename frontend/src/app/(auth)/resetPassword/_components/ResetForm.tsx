import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dmSans, poppins } from "@/lib/config/fonts";
import { motion } from "framer-motion";
import { Eye, EyeOff, LucideLoader2, Mail, Lock } from "lucide-react";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassSchema } from "@/lib/validations/resetPassSchema";
import z from "zod";
import router, { useRouter } from "next/router";
import toast from "react-hot-toast";
import { apiManager } from "@/lib/api/api-manager";
import { useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Props = {};

const ResetForm = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("resetToken");

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(resetPassSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof resetPassSchema>) => {
    const url =
      process.env.ENVIRONMENT === "DEVELOPMENT"
        ? "/api/auth/resetPassword"
        : "api/auth/resetPassword";
    await apiManager
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex items-center justify-center"
    >
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:bg-gray-800/80">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormDescription className={`${poppins.className} text-xs`}>
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
                  <FormDescription className={`${poppins.className} text-xs`}>
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
              className={`${dmSans.className} group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50`}
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
  );
};

export default ResetForm;
