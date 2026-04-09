"use client";

import React from "react";
import { Users } from "lucide-react";

export default function CommunitiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white py-16 dark:border-zinc-600 dark:bg-zinc-800">
          <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-700">
            <Users className="h-10 w-10 text-zinc-400" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-white">
            Communities
          </h2>
          <p className="mt-1 text-sm font-medium text-amber-600 dark:text-amber-400">
            Coming Soon
          </p>
          <p className="mt-4 max-w-md text-center text-sm text-zinc-600 dark:text-zinc-400">
            Community management requires backend integration. This feature will
            let you create and manage communities for your students once the API
            is available.
          </p>
        </div>
      </div>
    </div>
  );
}
