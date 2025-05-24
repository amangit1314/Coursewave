"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Josefin_Sans } from "next/font/google";
// import { Callout, ProgressCircle } from "@tremor/react";
import Image from "next/image";
import Link from "next/link";
import { useCoursesStore } from "@/zustand/coursesStore";
import { useUserStore } from "@/zustand/userStore";
import { ThemeModeToggle } from "@/app/(shared)/theme-mode-toggle";
import UserAvatar from "@/app/(shared)/user-avatar";
import Notifications from "@/app/(shared)/notification-button";

const josefinSans = Josefin_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

function CourseContentNavbar({ course }: any) {
  console.log("Course in the course content navbar: ", course);

  const { courseProgress, fetchCourseProgress, loadingState } =
    useCoursesStore();
  const { user } = useUserStore();
  const userId = user?.id || "";
  const courseId = course?.courseId;

  useEffect(() => {
    fetchCourseProgress(userId, courseId);
  }, [fetchCourseProgress, userId, courseId]);

  if (loadingState.loading) {
    return (
      <p className="text-[8px] font-medium text-yellow-500">
        Loading course progress ...
      </p>
    );
  }

  if (loadingState.error) {
    return (
      <p className="text-[8px] font-medium text-red-500">
        {loadingState.error} ...
      </p>
    );
  }

  console.log("Course Progress Data: ", courseProgress);

  return (
    <div className="flex w-full items-center justify-between px-4 md:h-[64px] md:px-8">
      <div className="hidden md:flex">
        <div className="breadcrumbs text-sm">
          <ul>
            <li className="">
              <Link
                href=""
                className={`text-xl font-bold text-blue-500 ${josefinSans.className} `}
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
                {course?.courseTitle}
              </span>
            </li>
          </ul>
        </div>
      </div>

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
        <div className="flex flex-row items-center justify-center space-x-2">
          {/* <ProgressCircle
            value={courseProgress?.completedPercentage ?? 0}
            size="sm"
          >
            <span className="text-[10px] font-medium text-slate-700 dark:text-slate-50">
              {courseProgress?.completedPercentage ?? 0} %
            </span>
          </ProgressCircle> */}
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

export default CourseContentNavbar;
