"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils/utils"; // optional if using a className utility

type VideoSummaryProps = {
  chapterId: string;
  chapterTitle: string;
};

const VideoSummary = ({ chapterId, chapterTitle }: VideoSummaryProps) => {
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState(false);

  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/summarize?chapterId=${chapterId}`);
      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
      } else {
        throw new Error(data.message || "Failed to generate summary");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-10 w-full max-w-3xl rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-md transition hover:shadow-lg dark:border-blue-900 dark:bg-[#0e1a2b]">
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          AI-Powered Summary
        </h3>
      </div>

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 w-full rounded bg-gray-300 dark:bg-gray-700" />
            <div className="h-4 w-5/6 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="h-4 w-4/5 rounded bg-gray-300 dark:bg-gray-700" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : summary ? (
          <div>
            <p
              className={cn(
                "text-sm text-gray-800 dark:text-gray-300 transition-all",
                expanded ? "" : "line-clamp-4"
              )}
            >
              {summary}
            </p>
            {summary.length > 150 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400"
              >
                {expanded ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Get a quick, AI-generated summary of the chapter:{" "}
              <span className="font-medium italic text-blue-600 dark:text-blue-400">
                "{chapterTitle}"
              </span>
            </p>
            <Button
              onClick={fetchSummary}
              disabled={isLoading}
              className="w-fit rounded-full bg-blue-600 px-6 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Summary
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSummary;
