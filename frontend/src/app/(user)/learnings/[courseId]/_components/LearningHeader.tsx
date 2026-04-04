"use client";

import React from "react";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import UserAvatar from "@/components/common/UserAvatar";
import { CourseProgress } from "@/components/CourseProgress";
import Link from "next/link";
import { ChevronLeft, BookOpen, Home, Menu } from "lucide-react";

type LearningHeaderProps = {
  title: string;
  progress?: number;
  onMenuToggle?: () => void;
};

const LearningHeader = ({
  title,
  progress = 0,
  onMenuToggle,
}: LearningHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/95 shadow-lg shadow-blue-500/5 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:border-white/10 dark:bg-zinc-900/80 dark:shadow-blue-500/5 dark:supports-[backdrop-filter]:bg-gray-950/80">
      <div className="mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200/60 bg-white/50 text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-white hover:shadow-md active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:border-white/20 dark:hover:bg-white/10"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Back Button - Hidden on mobile */}
          <button
            className="hidden sm:flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white/50 px-3 py-2 text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-white hover:shadow-md active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:border-white/20 dark:hover:bg-white/10"
            onClick={() =>
              typeof window !== "undefined" && window.history.back()
            }
            aria-label="Go back"
          >
            <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center min-w-0 flex-1">
            {/* Desktop Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2 text-sm min-w-0 flex-1">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 shrink-0">
                <Home className="h-3.5 w-3.5" />
                <span className="font-medium">Learnings</span>
              </div>

              <div className="flex items-center text-gray-300 dark:text-gray-600 shrink-0">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-1.5 shrink-0">
                  <BookOpen className="h-3 w-3 text-white" />
                </div>
                <span className="truncate font-semibold text-gray-900 dark:text-white">
                  {title}
                </span>
              </div>
            </div>

            {/* Mobile Breadcrumb */}
            <div className="md:hidden flex items-center gap-2 min-w-0 flex-1 ml-2">
              <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-1.5 shrink-0">
                <BookOpen className="h-3 w-3 text-white" />
              </div>
              <span className="truncate font-semibold text-gray-900 dark:text-white text-sm">
                {title}
              </span>
            </div>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Progress - Hidden on mobile */}
          {progress > 0 && (
            <div className="hidden sm:flex items-center gap-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 px-3 py-2 dark:from-white/5 dark:to-white/10">
              <span className="hidden lg:inline text-xs font-medium text-gray-600 dark:text-gray-300">
                Progress
              </span>
              <div className="flex items-center gap-2">
                {/* Wrap CourseProgress in a div to control width */}
                <div className="w-20">
                  <CourseProgress
                    value={progress}
                    variant="default"
                    size="sm"
                  />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white min-w-[35px]">
                  {progress}%
                </span>
              </div>
            </div>
          )}

          {/* Theme Toggle */}
          <div className="rounded-xl bg-white/50 p-1.5 dark:bg-white/5">
            <ThemeModeToggle />
          </div>

          {/* User Avatar - Control size with CSS instead of prop */}
          <div className="relative">
            <div className="hidden sm:block">
              <UserAvatar />
            </div>
            <div className="sm:hidden">
              {/* For mobile, we can control size with CSS classes */}
              <div className="scale-90">
                <UserAvatar />
              </div>
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-950" />
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      {progress > 0 && (
        <div className="px-4 pb-2 sm:hidden">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <CourseProgress value={progress} variant="default" size="sm" />
        </div>
      )}

      {/* Subtle gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/10" />
    </header>
  );
};

export default LearningHeader;
