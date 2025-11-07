"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { dmSans, poppins } from "@/lib/config/fonts";
import AuthBackgroundPattern from "@/components/auth/AuthBackgroundPattern";
import { useVerifyEmail } from "@/hooks/useAuth";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const csrf = searchParams.get("csrf");

  const verifyEmailMutation = useVerifyEmail();

  useEffect(() => {
    if (!token || !csrf) {
      verifyEmailMutation.reset();
      return;
    }
    verifyEmailMutation.mutate(
      { token, csrfToken: csrf },
      {
        onSuccess: (data) => {
          if (data.success) {
            toast.success("Email verified successfully!");
          }
        },
        onError: (error: any) => {
          toast.error(error?.message || "Verification failed.");
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, csrf]);

  let icon, header, content;
  if (verifyEmailMutation.isPending) {
    icon = <Mail className="h-8 w-8 text-white animate-pulse" />;
    header = "Verifying...";
    content = "Please wait while we verify your email.";
  } else if (
    verifyEmailMutation.isSuccess &&
    verifyEmailMutation.data?.success
  ) {
    icon = <CheckCircle className="h-8 w-8 text-white" />;
    header = "Email Verified!";
    content =
      "Your email has been successfully verified. You can now access your account.";
  } else if (
    verifyEmailMutation.isError ||
    (verifyEmailMutation.data && !verifyEmailMutation.data.success)
  ) {
    icon = <AlertCircle className="h-8 w-8 text-white" />;
    header = "Verification Failed";
    content =
      verifyEmailMutation.data?.message ||
      (verifyEmailMutation.error as any)?.message ||
      "Invalid or expired verification link.";
  } else {
    icon = <Mail className="h-8 w-8 text-white" />;
    header = "Verifying...";
    content = "Please wait while we verify your email.";
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-zinc-950">
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
                {icon}
              </div>
              <h1
                className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white`}
              >
                {header}
              </h1>
              <p
                className={`${poppins.className} mt-2 text-sm text-gray-600 dark:text-gray-400`}
              >
                {content}
              </p>
            </div>
            {verifyEmailMutation.isSuccess &&
              verifyEmailMutation.data?.success && (
                <div className="space-y-3">
                  <Link href="/login">
                    <Button
                      className={`${dmSans.className} w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white shadow-lg`}
                    >
                      Continue to Login
                    </Button>
                  </Link>
                  <Link href="/browse">
                    <Button
                      variant="outline"
                      className={`${poppins.className} w-full rounded-xl border-gray-300 bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300`}
                    >
                      Back to Home
                    </Button>
                  </Link>
                </div>
              )}
            {(verifyEmailMutation.isError ||
              (verifyEmailMutation.data &&
                !verifyEmailMutation.data.success)) && (
              <div className="text-center mt-4">
                <Link href="/helpAndSupport" className="text-blue-600 hover:underline">
                  Contact Support
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
