"use client";

import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Josefin_Sans } from "next/font/google";
import { ThemeModeToggle } from "@/components/themeModeToggle";
import UserAvatar from "@/components/user-avatar";
import useUserInfo from "@/hooks/use-user-info";
import Notifications from "@/components/notification-button";
import Link from "next/link";
import Image from "next/image";
import Cart from "@/components/cart-button";
import InstructorButton from "@/components/instructor-button";

const josefinSans = Josefin_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

function CourseNavbar({ courseName }: any) {
  const router = useRouter();
  const user = useUserInfo();
  const userId = user.user?.id;
  const isUserAnInstructor = user.user?.isInstructor;
  console.log("Is user instructor: ", isUserAnInstructor);

  const [isInstructor, setIsInstructor] = React.useState<boolean>(
    isUserAnInstructor!
  );

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
  };

  return (
    <div className="flex justify-between items-center w-full ">
      {/* breadcrumbs */}
      <div className="flex justify-start space-x-1 items-center">
        <div className="hidden md:flex text-sm breadcrumbs">
          <ul className="hidden md:flex">
            <li>
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
        <InstructorButton />

        {/* These */}
        <ThemeModeToggle />

        {/* cart */}
        {/* <Cart /> */}

        {/* notification */}
        <Notifications />

        {/* user profile */}
        {<UserAvatar />}
      </div>
    </div>
  );
}

export default CourseNavbar;
