"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserInfo } from "@/hooks/useUserInfo";
import { ThemeModeToggle } from "@/app/(shared)/theme-mode-toggle";
import Notifications from "@/app/(shared)/notification-button";
import UserAvatar from "@/app/(shared)/user-avatar";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const InstructorNavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const switchBack: any = () => {
    router.push("/browseCourses");
  };

  const user = useUserInfo();

  return (
    <div className="flex w-full items-center justify-between">
      <div className={poppins.className}>
        <div className="text-md hidden bg-transparent text-base font-semibold tracking-tight text-black dark:text-white md:flex">
          Instructor Dashboard
        </div>
      </div>
      <div className="ml-auto flex justify-end gap-x-2">
        <Button
          onClick={switchBack}
          className="mx-auto cursor-pointer items-center rounded-lg border border-black border-opacity-10 bg-transparent px-4 text-xs text-black hover:border-opacity-100 hover:bg-slate-50 dark:border-white dark:border-opacity-10 dark:text-white dark:hover:border-opacity-100 dark:hover:bg-zinc-700"
        >
          Go back
        </Button>
        
        <div className="mx-2">
          <ThemeModeToggle />
        </div>

        <Notifications />
        
        <div className={poppins.className}>
          <UserAvatar />
        </div>
      </div>
    </div>
  );
};

export default InstructorNavbarRoutes;
