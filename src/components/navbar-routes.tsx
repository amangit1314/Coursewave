"use client";

// import { Button } from "./ui/button";
import UserAvatar from "./user-avatar";
import React, { Suspense } from "react";
import toast, { Toaster } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { Josefin_Sans, Orbitron, Poppins } from "next/font/google";
import { ThemeModeToggle } from "./theme-mode-toggle";
import { useUserInfo } from "@/hooks/useUserInfo";
import Notifications from "@/components/notification-button";
import SearchButton from "@/components/search-button";
// import Cart from "@/components/cart-button";
import InstructorButton from "./instructor-button";
import { useUserStore } from "@/zustand/userStore";
import { Skeleton } from "./ui/skeleton";

const josefinSans = Orbitron({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const NavbarRoutes = () => {
  const router = useRouter();
  const pathname = usePathname();

  // const user = useUserInfo();
  const { user, loadingState } = useUserStore();

  // Move these calls before the if statement
  const [isInstructor, setIsInstructor] = React.useState<boolean>(
    user?.isInstructor ?? false,
  );

  if (loadingState.loading) {
    return <Skeleton className="h-12 w-12 rounded-md" />;
  }

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
          <div className={poppins.className}>
            {user ? <InstructorButton /> : <div></div>}
          </div>
          {/* theme toggle */}
          <ThemeModeToggle />

          {/* cart */}
          {/* <Cart /> */}

          {/* notifications */}
          <Notifications />

          {/* user profile */}
          <div className={poppins.className}>
            {user ? (
              <UserAvatar />
            ) : (
              <span className={josefinSans.className}>
                <button
                  onClick={gotToSignIn}
                  className="text-base hover:text-blue-600"
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
