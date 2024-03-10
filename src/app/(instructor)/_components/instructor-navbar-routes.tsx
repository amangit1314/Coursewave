"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

import { IoNotificationsOutline } from "react-icons/io5";
import UserAvatar from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { ThemeModeToggle } from "@/components/themeModeToggle";
import useUserInfo from "@/lib/hooks/use-user-info";
import Notifications from "@/components/notification-button";
// import Notifications from "@/app/(dashboard)/(routes)/notifications/page";

function InstructorNavbarRoutes() {
  const pathname = usePathname();
  const router = useRouter();

  const switchBack: any = () => {
    router.push("/browseCourses");
  };

  const user = useUserInfo();

  return (
    <div className="w-full ml-auto md:mx-8 flex justify-between items-center">
      <div className="hidden md:flex md:mr-auto text-black dark:text-white text-md text-base font-semibold tracking-tight bg-transparent">
        Instructor Dashboard
      </div>
      <div className="ml-auto flex justify-end items-center gap-x-2">
        <Button
          onClick={switchBack}
          className="cursor-pointer border-opacity-10 hover:bg-slate-50 dark:hover:border-opacity-100 dark:border-opacity-10 hover:border-opacity-100 dark:hover:bg-slate-700 border px-4 border-black text-black text-xs dark:border-white dark:text-white bg-transparent rounded-lg mx-auto items-center"
        >
          {"Go back"}
        </Button>
        <ThemeModeToggle />
        <Notifications />
        <UserAvatar />
      </div>
    </div>
  );
}

export default InstructorNavbarRoutes;
