"use client";

// import { Button } from "./ui/button";
import UserAvatar from "./user-avatar";
import React, { Suspense } from "react";
import toast, { Toaster } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { Josefin_Sans } from "next/font/google";
import { ThemeModeToggle } from "./theme-mode-toggle";
import { useUserInfo } from "@/hooks/useUserInfo";
import Notifications from "@/components/notification-button";
import SearchButton from "@/components/search-button";
// import Cart from "@/components/cart-button";
import InstructorButton from "./instructor-button";
import { useUserStore } from "@/zustand/userStore";
import { Skeleton } from "./ui/skeleton";

const josefinSans = Josefin_Sans({
  weight: ["400", "500", "600", "700"],
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

  const switchToInstructorView = () => {
    if (!user?.id) {
      toast.error("Please provide user id ⚠ ...");
    } else if (isInstructor) {
      setIsInstructor(true);
      router.push(`/instructor/${user?.id}/analytics`);
    } else {
      setIsInstructor(false);
      toast.error("You are not an instructor ...");
      router.push(`/profile/${user?.id}`);
    }

    //! ---- for TESTING ONLY AFTER TESTING REMOVE BELOW CODE ---
    // router.push(`/instructor/${userId}/analytics`);
  };

  const gotToSignIn = () => {
    router.push("/login");
  };

  const isBrowseCoursesScreen = pathname.match("/browseCourses");

  return (
    <Suspense>
      <div className="flex w-full items-center justify-between">
        <div className="md:pl-64">
          {isBrowseCoursesScreen ? <SearchButton /> : <div></div>}
        </div>
        <div className="ml-auto flex justify-end gap-x-2">
          <Toaster />

          {/* instructor button */}
          <InstructorButton />

          {/* theme toggle */}
          <ThemeModeToggle />

          {/* cart */}
          {/* <Cart /> */}

          {/* notifications */}
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
    </Suspense>
  );
};

export default NavbarRoutes;
