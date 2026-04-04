"use client";

import React from "react";
import Link from "next/link";
import { dmSans } from "@/lib/config/fonts";
import { Button } from "@/components/ui/button";

export default function CancelSubscription() {
  return (
    <div
      className={`${dmSans.className} flex min-h-screen items-center justify-center px-4 pt-[80px]`}
    >
      <div className="mx-auto max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <svg
            className="h-10 w-10 text-amber-600 dark:text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-white">
          Subscription Cancelled
        </h1>
        <p className="mb-4 text-lg text-zinc-600 dark:text-zinc-400">
          Your subscription has been cancelled. You will continue to have access
          to premium features until the end of your current billing period.
        </p>

        <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            What you will lose access to
          </h3>
          <ul className="space-y-3 text-left text-sm text-zinc-700 dark:text-zinc-300">
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Premium course content and materials
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Certificate generation for completed courses
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Priority support and exclusive features
            </li>
          </ul>
        </div>

        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
          Changed your mind? You can resubscribe at any time to regain full
          access.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/subscriptions">
            <Button className="w-full sm:w-auto">Resubscribe</Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline" className="w-full sm:w-auto">
              Browse Free Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
