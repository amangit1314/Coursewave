"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/zustand/userStore";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import { ThemeModeToggle } from "@/app/(shared)/theme-mode-toggle";
import Notifications from "@/app/(shared)/notification-button";
import UserAvatar from "@/app/(shared)/user-avatar";
import Sidebar from "../(courses)/browse/_components/Sidebar";

interface BrowseCommunityChatLayoutProps {
  children: React.ReactNode;
}

export default function BrowseCommunityChatLayout({
  children,
}: BrowseCommunityChatLayoutProps) {
  const pathname = usePathname();

  // Check if the current route matches "/communityChat/[communityId]"
  const isCommunityDetailPage =
    pathname.startsWith("/communityChat/") && pathname.split("/").length === 3;

  return (
    <div className="h-full min-h-screen dark:bg-zinc-900">
      {/* Only show Navbar if not on the community detail page */}
      {!isCommunityDetailPage && (
        <div className="inset-y-0 z-50 h-[64px] w-full md:pl-56">
          <ArticlesNavbar />
        </div>
      )}

      {/* Only show Sidebar if not on the community detail page */}
      {!isCommunityDetailPage && (
        <div className="fixed inset-y-0 z-50 hidden h-full md:flex">
          <Sidebar />
        </div>
      )}

      {/* Adjust padding based on the route */}
      <div className={`h-full ${!isCommunityDetailPage ? "md:pl-64" : ""}`}>
        {children}
      </div>
    </div>
  );
}

const ArticlesNavbar = () => {
  return (
    <div className="flex h-full w-full items-center justify-start border-b bg-white px-6 shadow-sm dark:bg-transparent md:px-0">
      <ArticlesNavbarRoutes />
    </div>
  );
};

const ArticlesNavbarRoutes = ({ name }: { name?: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useUserStore();
  const [isInstructor, setIsInstructor] = React.useState<boolean>(
    user?.roles?.includes("INSTRUCTOR") ?? false
  );

  // if (loadingState.loading) {
  //   return <Skeleton className="h-12 w-12 rounded-md" />;
  // }

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
  };

  const gotToSignIn = () => {
    router.push("/login");
  };

  const isBrowseCoursesScreen = pathname.match("/browseCourses");

  return (
    <div className="ml-auto flex w-full items-center justify-between md:ml-16 md:mr-8">
      {/* <div className="">
        <ArticlesSearchButton />
      </div> */}
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
