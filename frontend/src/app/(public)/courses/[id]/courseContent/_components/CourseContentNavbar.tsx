"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import UserAvatar from "@/components/common/UserAvatar";
import Notifications from "@/components/common/NotificationButton";
import { poppins } from "@/lib/config/fonts";
import { useCourseProgress } from "@/hooks/useCourses";
import { ProgressCircle } from "@tremor/react";
import { CourseProgress } from "@/types/courses.service.types";
import { useCoursesStore } from "@/zustand/coursesStore";

export default function CourseContentNavbar() {
  const { selectedCourse: course } = useCoursesStore();
  console.log("Course in the course content navbar: ", course);
  const courseId = course?.id ?? "";

  const {
    data: courseProgressData,
    isLoading,
    error,
  } = useCourseProgress(courseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center space-x-2 py-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></div>
        <p className="text-sm font-medium text-yellow-500">
          Loading course progress...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center space-x-2 py-2 text-red-500">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm font-medium">{error.message}</p>
      </div>
    );
  }

  const courseProgress = courseProgressData?.data ?? ({} as CourseProgress);
  const completedPercentage =
    (courseProgress?.completedChapters / courseProgress.totalChapters) * 100;

  return (
    <div className="flex w-full items-center justify-between px-4 md:h-[64px] md:px-8">
      {/* (big screens only) breadcrumbs */}
      <div className="hidden md:flex">
        <div className="breadcrumbs text-sm">
          <ul>
            <li className="">
              <Link
                href=""
                className={`text-xl font-bold text-blue-500 ${poppins.className} `}
              >
                <Image
                  src="/assets/images/logo/coursewave-favicon-color.png"
                  alt="CourseWave Logo"
                  className="mb-2 mr-1"
                  width={30}
                  height={8}
                  priority
                />
                Coursewave
              </Link>
            </li>
            <li>
              <span className="mr-1 inline-flex items-center gap-2">
                {course?.title}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Logo */}
      <Link href={`/browseCourses`} className="visible md:hidden">
        <Image
          src="/assets/images/logo/coursewave-favicon-color.png"
          alt="CourseWave Logo"
          className=""
          width={30}
          height={8}
          priority
        />
      </Link>

      <div className="ml-auto flex items-center justify-end space-x-3 py-2">
        {/* Progress bar */}
        <div className="flex flex-row items-center justify-center space-x-2">
          <ProgressCircle value={completedPercentage} size="sm">
            <span className="text-[10px] font-medium text-slate-700 dark:text-slate-50">
              {completedPercentage} %
            </span>
          </ProgressCircle>
          <p className="text-xs">Completed</p>
        </div>

        {/* theme toggle */}
        <ThemeModeToggle />

        {/* user profile */}
        {<UserAvatar />}

        {/* notification */}
        <Notifications />
      </div>
    </div>
  );
}
