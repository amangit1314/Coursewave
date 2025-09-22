/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";
import InstructorButton from "@/components/InstructorButton";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import UserAvatar from "@/components/common/UserAvatar";
import { ChevronRight, Home } from "lucide-react";
import Notifications from "@/components/common/NotificationButton";
import { dmSans } from "@/lib/config/fonts";

const CourseNavbar = ({ courseName }: { courseName: string }) => {
  const router = useRouter();
  const { user } = useUserStore();

  const gotToSignIn = () => {
    router.push("/login");
  };

  return (
    <nav className="flex w-full items-center justify-between rounded-xl bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md dark:bg-zinc-900/90 lg:px-6">
      <Toaster />
      
      {/* Left Section - Logo and Breadcrumbs */}
      <div className="flex items-center space-x-3">
        {/* Logo and Brand */}
        <Link
          href="/browse"
          className="flex items-center space-x-2 rounded-lg px-2 py-1 transition-all hover:bg-gray-100 dark:hover:bg-zinc-800"
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
          <span className={`text-lg font-bold text-blue-600 dark:text-blue-400 ${dmSans.className}`}>
            CourseWave
          </span>
        </Link>

        {/* Breadcrumb Separator */}
        <div className="hidden h-4 w-px bg-gray-300 dark:bg-gray-600 md:block" />

        {/* Course Name Breadcrumb */}
        <div className="hidden items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 md:flex">
          <Link
            href="/browseCourses"
            className="flex items-center space-x-1 rounded-md px-2 py-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Home className="h-4 w-4" />
            <span>Courses</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="max-w-xs truncate font-medium text-gray-900 dark:text-white">
            {courseName}
          </span>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-2">
        {/* Instructor Button */}
        {user && (
          <div className="hidden sm:block">
            <InstructorButton />
          </div>
        )}

        {/* Theme Toggle */}
        <div className="flex items-center">
          <ThemeModeToggle />
        </div>

        {/* Notifications */}
        <div className="flex items-center">
          <Notifications />
        </div>

        {/* User Profile or Sign In */}
        <div className="flex items-center">
          {user ? (
            <UserAvatar />
          ) : (
            <button
              onClick={gotToSignIn}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CourseNavbar;
