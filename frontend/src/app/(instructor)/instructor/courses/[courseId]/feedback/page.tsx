"use client";

import React from "react";
import { MessageSquare } from "lucide-react";

export default function Feedback() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white py-16 dark:border-zinc-600 dark:bg-zinc-800">
          <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-700">
            <MessageSquare className="h-10 w-10 text-zinc-400" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-white">
            Course Feedback
          </h2>
          <p className="mt-1 text-sm font-medium text-amber-600 dark:text-amber-400">
            Coming Soon
          </p>
          <p className="mt-4 max-w-md text-center text-sm text-zinc-600 dark:text-zinc-400">
            Course feedback and reviews will be available here once the reviews API is integrated. You'll be able to see ratings, respond to reviews, and track satisfaction.
          </p>
        </div>
      </div>
    </div>
  );
}
