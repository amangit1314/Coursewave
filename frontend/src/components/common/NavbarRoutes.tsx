"use client";

import UserAvatar from "./UserAvatar";
import React, { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ThemeModeToggle } from "./ThemeModeToggle";
import { dmSans, poppins } from "@/lib/config/fonts";
import SearchButton from "../SearchButton";
import Notifications from "./NotificationButton";
import { useUserStore } from "@/zustand/userStore";
// import InstructorButton from "../InstructorButton";

const NavbarRoutes = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useUserStore();

  const gotToSignIn = () => {
    router.push("/login");
  };

  const isBrowseCoursesScreen = pathname.match("/browseCourses");
  const isDashboardScreen = pathname.includes("dashboard"); // Checks for dashboard in pathname


  return (
    <Suspense>
      <div className="flex w-full items-center justify-between">
        <div className={poppins.className}>
          <div className="md:pl-64">
            {isBrowseCoursesScreen ? <SearchButton /> : <div></div>}
          </div>
        </div>

        <div className="ml-auto flex justify-end gap-x-2">
          {/* instructor button */}
          {/* <div className={dmSans.className}>
            {user && !isDashboardScreen ? <InstructorButton /> : <div></div>}
          </div> */}

          {/* theme toggle */}
          <ThemeModeToggle />

          {/* cart */}
          {/* <Cart /> */}

          {/* notifications */}
          <Notifications />

          {/* user profile */}
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

export default NavbarRoutes;
