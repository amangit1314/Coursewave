"use client";


import React from "react";

import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/zustand/userStore";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import { Sidebar } from "lucide-react";
import ArticlesSearchButton from "../../articles/_components/ArticlesSearchButton";
import { ThemeModeToggle } from "@/app/(shared)/ThemeModeToggle";
import Notifications from "@/app/(shared)/notification-button";
import UserAvatar from "@/app/(shared)/UserAvatar";

interface BrowseArticlesLayoutProps {
  children: React.ReactNode;
}

export default function BrowseArticlesLayout({
  children,
}: BrowseArticlesLayoutProps) {
  return (
    <div className="h-full min-h-screen dark:bg-zinc-900">
      <div className="inset-y-0 z-50 h-[64px] w-full md:pl-56">
        <ArticlesNavbar />
      </div>

      <div className="fixed inset-y-0 z-50 hidden h-full md:flex">
        <Sidebar />
      </div>
      <div className="h-full md:pl-64">{children}</div>
    </div>
  );
}

const ArticlesNavbar = () => {
  return (
    <div className="flex h-full w-full items-center justify-start border-b bg-white px-6 shadow-sm dark:bg-transparent md:px-0">
      {/* <InstructorMobileSidebar /> */}
      <ArticlesNavbarRoutes />
    </div>
  );
};

const ArticlesNavbarRoutes = ({ name }: { name?: string }) => {

  const router = useRouter();
  const pathname = usePathname();

  // const user = useUserInfo();
  const { user, loadingState } = useUserStore();

  // Move these calls before the if statement
  const [isInstructor, setIsInstructor] = React.useState<boolean>(
    user?.roles?.includes("INSTRUCTOR") ?? false
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
    <div className="ml-auto flex w-full items-center justify-between md:ml-16 md:mr-8">
      {/* <div className="hidden md:flex md:mr-auto text-black dark:text-white  tracking-tight items-center bg-transparent">
        <p className="text-md text-base font-bold">Hello, </p>
        <span className="text-blue-600 ml-1 text-xl font-bold">
          {user.user?.name}
        </span>
      </div> */}
      <div className="">
        {/* {isBrowseCoursesScreen ? */}
        <ArticlesSearchButton />
        {/* // : <div></div>} */}
      </div>
      <div className="ml-auto flex items-center justify-end gap-x-2">
        <ThemeModeToggle />
        <Notifications />
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
