"use client";

// import { Button } from "./ui/button";
import UserAvatar from "./user-avatar";
import React, { Suspense } from "react";
import toast, { Toaster } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { Josefin_Sans } from "next/font/google";
import { ThemeModeToggle } from "./themeModeToggle";
import useUserInfo from "@/hooks/use-user-info";
import Notifications from "@/components/notification-button";
import SearchButton from "@/components/search-button";
// import Cart from "@/components/cart-button";
import InstructorButton from "./instructor-button";

const josefinSans = Josefin_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const NavbarRoutes = () => {
  const router = useRouter();
  const pathname = usePathname();

  const user = useUserInfo();
  const userId = user.user?.id!;
  const isUserAnInstructor = user.user?.isInstructor;
  console.log("Is user instructor: ", isUserAnInstructor);

  const [isInstructor, setIsInstructor] = React.useState<boolean>(
    isUserAnInstructor!
  );
  const [loading, setLoading] = React.useState(true);

  const switchToInstructorView = () => {
    if (!userId) {
      toast.error("Please provide user id ⚠ ...");
    } else if (isUserAnInstructor) {
      setIsInstructor(true);
      router.push(`/instructor/${userId}/analytics`);
    } else {
      setIsInstructor(false);
      toast.error("You are not an instructor ...");
      router.push(`/profile/${userId}`);
    }

    //! ---- for TESTING ONLY AFTER TESTING REMOVE BELOW CODE ---
    // router.push(`/instructor/${userId}/analytics`);
  };

  const isBrowseCoursesScreen = pathname.match("/browseCourses");

  return (
    <Suspense>
      <div className="flex justify-between items-center w-full">
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
          {<UserAvatar />}
        </div>
      </div>
    </Suspense>
  );
};

export default NavbarRoutes;
