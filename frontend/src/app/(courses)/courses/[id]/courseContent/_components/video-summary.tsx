'use client';

import { Button } from "@/components/ui/button";
import React from "react";

type VideoSummaryProps = {
    chapterId: string;
    chapterTitle: string;
  };
  
  const VideoSummary = ({ chapterId, chapterTitle }: VideoSummaryProps) => {
    const [summary, setSummary] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [expanded, setExpanded] = React.useState(false);
  
    // const fetchSummary = async () => {
    //   setIsLoading(true);
    //   setError(null);
    //   try {
    //     // Replace with your actual API call
    //     const response = await fetch(`/api/summarize?chapterId=${chapterId}`);
    //     const data = await response.json();
    //     if (response.ok) {
    //       setSummary(data.summary);
    //     } else {
    //       throw new Error(data.message || "Failed to generate summary");
    //     }
    //   } catch (err) {
    //     setError(err instanceof Error ? err.message : "An unknown error occurred");
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
  
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-950 dark:text-gray-300">
          AI Summary
        </h3>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          {isLoading ? (
            <div className="flex flex-col space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 dark:text-red-400">{error}</div>
          ) : summary ? (
            <div>
              <p className={`text-gray-700 dark:text-gray-300 ${expanded ? "" : "line-clamp-3"}`}>
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
            <div className="flex flex-col items-start space-y-4">
              <p className="text-gray-700 dark:text-gray-400">
                Get a concise AI-generated summary of this video.
              </p>
              {/* <Button
                onClick={fetchSummary}
                color="blue"
                size="sm"
                className="rounded-full"
              >
                Generate Summary
              </Button> */}
            </div>
          )}
        </div>
      </div>
    );
  };

  export default VideoSummary;