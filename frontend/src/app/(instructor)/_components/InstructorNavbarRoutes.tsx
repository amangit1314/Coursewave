
"use client";

import React, { Suspense } from "react";
import UserAvatar from "@/components/common/UserAvatar";
import { usePathname, useRouter } from "next/navigation";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import { dmSans, poppins } from "@/lib/config/fonts";
import Notifications from "@/components/common/NotificationButton";
import { useUserStore } from "@/zustand/userStore";
import { Button } from "@/components/ui/button";

const InstructorNavbarRoutes = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useUserStore();

  console.log("Navbar user: ", JSON.stringify(user));

  const gotToSignIn = () => {
    router.push("/login?from=" + encodeURIComponent(pathname));
  };

  const switchBack = () => {
    router.push("/browse");
  };

  const isBrowseCoursesScreen = pathname.match("/browse");
  const isDashboardScreen = pathname.includes("dashboard"); // Checks for dashboard in pathname

  return (
    <Suspense>
      <div className="flex w-full items-center justify-between">
        {/* Left area - search button for Browse Courses */}
        {/* <div className={poppins.className}>
          <div className="md:pl-64">
            {isBrowseCoursesScreen ? <SearchButton /> : <div></div>}
          </div>
        </div> */}

        {/* Right area - actions */}
        <div className="ml-auto flex justify-end gap-x-2">
          {/* Instructor button visible outside dashboard */}
          <div className={dmSans.className}>
            <Button
              onClick={switchBack}
              variant="outline"
              size="sm"
              className="h-10 px-4 border-gray-200 dark:border-zinc-800"
            >
              Go back
            </Button>
          </div>

          {/* Theme toggle */}
          <ThemeModeToggle />

          {/* Notifications */}
          <Notifications />

          {/* User avatar or sign-in button */}
          <div>
            {user ? (
              <UserAvatar />
            ) : (
              <span className={dmSans.className}>
                <button
                  onClick={gotToSignIn}
                  className="text-sm cursor-pointer hover:text-white h-10 text-center dark:hover:bg-blue-600 flex justify-center dark:hover:border-transparent items-center w-auto px-4 rounded-md border border-gray-200 dark:border-zinc-800 hover:border-transparent bg-white dark:bg-zinc-800 hover:bg-blue-600 transition-all duration-100"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default InstructorNavbarRoutes;
