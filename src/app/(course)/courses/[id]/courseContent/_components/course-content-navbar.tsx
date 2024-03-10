import React from "react";
import { Josefin_Sans } from "next/font/google";
import { ThemeModeToggle } from "@/components/themeModeToggle";
import { ProgressCircle } from "@tremor/react";
import UserAvatar from "@/components/user-avatar";
import { Course } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import Notifications from "@/components/notification-button";

const josefinSans = Josefin_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

function CourseContentNavbar({ course }: any) {

  return (
    <div className="flex h-[64px] px-8 justify-between items-center w-full">
      <div className="flex justify-start space-x-1 items-center">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link
                href=""
                className={`text-blue-500 font-bold text-xl ${josefinSans.className} underline-offset-0`}
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

      <div className="ml-auto flex justify-end gap-x-3">
        {/* <Toaster /> */}

        <div className="flex justify-center items-center space-x-2">
          <ProgressCircle value={75} size="sm">
            <span className="text-[10px] font-medium text-slate-700 dark:text-slate-50">
              75%
            </span>
          </ProgressCircle>
          <p className="text-xs">Your Progress</p>
        </div>

        <ThemeModeToggle />

        {/* notification */}
        <Notifications />

        {/* user profile */}
        {<UserAvatar />}
      </div>
    </div>
  );
}

export default CourseContentNavbar;