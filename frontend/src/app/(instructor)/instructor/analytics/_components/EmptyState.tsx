"use client";

import { BarChart3 } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 animate-in fade-in-50">
      <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800">
        <BarChart3 className="h-10 w-10 text-zinc-500 dark:text-zinc-400" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
          No analytics data available
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
          Once your students start engaging with your courses and content,
          analytics will appear here.
        </p>
      </div>
    </div>
  );
}
