"use client";

import UserAvatar from "./user-avatar";
import React, { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { ThemeModeToggle } from "./theme-mode-toggle";
import { useUserStore } from "@/zustand/userStore";
import { Skeleton } from "@/components/ui/skeleton";
import { orbitron, poppins } from "@/lib/config/fonts";

import InstructorButton from "./instructor-button";
import SearchButton from "./search-button";
import Notifications from "./notification-button";
import Cart from "./cart-button";

const NavbarRoutes = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useUserStore();

  // if (loadingState.loading) {
  //   return <Skeleton className="h-12 w-12 rounded-md" />;
  // }

  const gotToSignIn = () => {
    router.push("/login");
  };

  const isBrowseCoursesScreen = pathname.match("/browseCourses");

  return (
    <Suspense>
      <div className="flex w-full items-center justify-between">
        <div className={poppins.className}>
          <div className="md:pl-64">
            {isBrowseCoursesScreen ? <SearchButton /> : <div></div>}
          </div>
        </div>
        
        <div className="ml-auto flex justify-end gap-x-2">
          <Toaster />

          {/* instructor button */}
          <div className={orbitron.className}>
            {user ? <InstructorButton /> : <div></div>}
          </div>

          {/* theme toggle */}
          <div className="mx-2">
            <ThemeModeToggle />
          </div>

          {/* cart */}
          {/* <Cart /> */}

          {/* notifications */}
          <Notifications />

          {/* user profile */}
          <div className={poppins.className}>
            {user ? (
              <UserAvatar />
            ) : (
              <span className={orbitron.className}>
                <button
                  onClick={gotToSignIn}
                  className="text-sm cursor-pointer hover:text-white h-10 text-center dark:hover:bg-blue-600 flex justify-center dark:hover:border-transparent items-center w-auto px-4 rounded-md border border-stroke hover:border-transparent bg-white dark:bg-zinc-800 hover:bg-blue-600 transition-all duration-100"
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
