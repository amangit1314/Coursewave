import React, { useEffect } from "react";
import { Josefin_Sans } from "next/font/google";
import { ThemeModeToggle } from "@/components/themeModeToggle";
import { ProgressCircle } from "@tremor/react";
import UserAvatar from "@/components/user-avatar";
import { Course, CourseProgress, Enrollment } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import Notifications from "@/components/notification-button";
import useCourseProgressStore from "@/zustand/courseProgressStore";
import useUserInfo from "@/hooks/use-user-info";

const josefinSans = Josefin_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

async function CourseContentNavbar({ course }: any) {
  console.log("Course in the course content navbar: ", course);

  const { courseProgress, fetchCourseProgress } = useCourseProgressStore();
  const user = useUserInfo();
  const userId = user.user?.id;
  const courseId = course?.courseId!;

  useEffect(() => {
    fetchCourseProgress(userId, courseId);
  }, [fetchCourseProgress, userId, courseId]);

  if (!courseProgress) {
    return <p>Loading course progress ...</p>;
  }

  console.log("Course Progress Data: ", courseProgress);

  return (
    <div className="flex md:h-[64px] px-4 md:px-8 justify-between items-center w-full">
      <div className="hidden md:flex">
        <div className="text-sm breadcrumbs">
          <ul>
            <li className="">
              <Link
                href=""
                className={`text-blue-500 font-bold text-xl ${josefinSans.className} `}
              >
                <Image
                  src="/assets/images/logo/coursewave-favicon-color.png"
                  alt="CourseWave Logo"
                  className="mr-1 mb-2"
                  width={30}
                  height={8}
                  priority
                />
                Coursewave
              </Link>
            </li>
            <li>
              <span className="inline-flex mr-1 gap-2 items-center">
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
        <div className="flex flex-row justify-center items-center space-x-2">
          <ProgressCircle value={courseProgress.progress ?? 0} size="sm">
            <span className="text-[10px] font-medium text-slate-700 dark:text-slate-50">
              {courseProgress.progress ?? 0}%
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

export default CourseContentNavbar;
