/// ====================================================

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";
import InstructorButton from "@/components/InstructorButton";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import UserAvatar from "@/components/common/UserAvatar";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";
import Notifications from "@/components/common/NotificationButton";
import { dmSans } from "@/lib/config/fonts";
import { Button } from "@/components/ui/button";

const CourseNavbar = ({ courseName }: { courseName: string }) => {
  const router = useRouter();
  const { user } = useUserStore();

  const gotToSignIn = () => {
    router.push("/login");
  };

  const goBack = () => {
    router.back();
  };

  return (
    <>

      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3 md:px-6">
          {/* Left Section - Logo and Breadcrumbs */}
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            {/* Back Button - Mobile Only */}
            <Button
              onClick={goBack}
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            {/* Logo and Brand */}
            <Link
              href="/browse"
              className="flex items-center space-x-2 rounded-xl px-2 py-1.5 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
            >
              <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                <Image
                  src="/assets/images/logo/coursewave-favicon-color.png"
                  alt="CourseWave Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span
                className={`hidden sm:inline text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent ${dmSans.className}`}
              >
                Coursewave
              </span>
            </Link>

            {/* Breadcrumb Separator */}
            <div className="hidden h-5 w-px bg-zinc-300 dark:bg-zinc-700 md:block shrink-0" />

            {/* Course Name Breadcrumb - Desktop */}
            <div className="hidden items-center space-x-1.5 text-sm md:flex min-w-0">
              <Link
                href="/browse"
                className="flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 shrink-0"
              >
                <Home className="h-4 w-4" />
                <span className="font-medium">Courses</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-zinc-400 dark:text-zinc-600 shrink-0" />
              <div className="flex items-center max-w-md">
                <span
                  className="truncate font-semibold text-zinc-900 dark:text-white"
                  title={courseName}
                >
                  {courseName}
                </span>
              </div>
            </div>

            {/* Course Name - Mobile (Truncated) - REMOVED to prevent conflict, shown in sub-header */}
            {/* <div className="flex md:hidden min-w-0 flex-1">
              <span
                className="truncate text-sm font-semibold text-zinc-900 dark:text-white"
                title={courseName}
              >
                {courseName}
              </span>
            </div> */}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-1.5 md:space-x-2 shrink-0">
            {/* Instructor Button - Hidden on small screens */}
            {/* {user && (
              <div className="hidden lg:block">
                <InstructorButton />
              </div>
            )} */}

            {/* Theme Toggle */}
            <div className="flex items-center">
              <ThemeModeToggle />
            </div>

            {/* Notifications */}
            {user && (
              <div className="flex items-center">
                <Notifications />
              </div>
            )}

            {/* User Profile or Sign In */}
            <div className="flex items-center">
              {user ? (
                <UserAvatar />
              ) : (
                <Button
                  onClick={gotToSignIn}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 px-4 py-2 text-sm border-0 h-9"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Sign In</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Breadcrumb - Below main nav */}
        <div className="flex md:hidden border-t border-zinc-200/50 dark:border-zinc-800/50 px-4 py-2">
          <Link
            href="/browseCourses"
            className="flex items-center space-x-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Courses</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <span className="flex items-center space-x-1 text-xs text-blue-500">
            {courseName}
          </span>
        </div>
      </nav>
    </>
  );
};

export default CourseNavbar;
