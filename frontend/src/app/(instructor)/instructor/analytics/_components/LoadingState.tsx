"use client";

import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 animate-in fade-in-50">
      <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      <div>
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
          Loading analytics...
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Fetching insights and metrics from your instructor dashboard
        </p>
      </div>
    </div>
  );
}
