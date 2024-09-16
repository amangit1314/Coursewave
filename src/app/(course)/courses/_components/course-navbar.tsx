'use client';

import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { Josefin_Sans } from "next/font/google";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import UserAvatar from "@/components/user-avatar";
import Notifications from "@/components/notification-button";
import Link from "next/link";
import Image from "next/image";
import InstructorButton from "@/components/instructor-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";

const josefinSans = Josefin_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const CourseNavbar = ({ courseName }: { courseName: string }) => {
  const router = useRouter();
  // const user = useUserInfo();
  const { user, loadingState } = useUserStore();

  if (loadingState.loading) {
    return <Skeleton className="h-12 w-12 rounded-md" />;
  }

  const gotToSignIn = () => {
    router.push("/login");
  };

  return (
    <div className="flex w-full items-center justify-between">
      {/* breadcrumbs */}
      <div className="flex items-center justify-start space-x-1">
        <div className="breadcrumbs hidden text-sm md:flex">
          <ul className="hidden md:flex">
            <li>
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
                {courseName}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* theme, cart, notifications, profile */}
      <div className="ml-auto flex justify-end gap-x-2">
        <Toaster />

        {/* instructor button */}
        {user ? (
            <InstructorButton />
          ) : (
           <div></div>
          )}

        {/* These */}
        <ThemeModeToggle />

        {/* cart */}
        {/* <Cart /> */}

        {/* notification */}
        <Notifications />

        {/* user profile */}
        {user ? (
            <UserAvatar />
          ) : (
            <button
              onClick={gotToSignIn}
              className="text-base hover:text-blue-600"
            >
              Sign In
            </button>
          )}
      </div>
    </div>
  );
};

export default CourseNavbar;
