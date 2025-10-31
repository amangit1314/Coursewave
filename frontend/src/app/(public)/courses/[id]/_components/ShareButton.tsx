"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FaShare } from "react-icons/fa6";
import toast from "react-hot-toast";
import { dmSans } from "@/lib/config/fonts";

export const ShareButton = () => {
  const pathname = usePathname();

  const notify = (content: string) => toast(`${content}`);

  const handleShare = () => {
    const currentUrl = `${window.location.origin}${pathname}`;
    navigator.clipboard.writeText(currentUrl).then(
      () => {
        notify("✅ URL copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy URL:", err);
        notify("❌ Failed to copy URL!");
      }
    );
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300 hover:scale-105 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 group"
    >
      <FaShare className="h-4 w-4 transition-transform group-hover:scale-110" />
      <span className={dmSans.className}>Share</span>
    </button>
  );
};
