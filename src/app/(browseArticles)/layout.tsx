"use client";

import Navbar from "../(browseCourses)/browseCourses/_components/navbar";
import Sidebar from "../(browseCourses)/browseCourses/_components/sidebar";

interface BrowseArticlesLayoutProps {
  children: React.ReactNode;
}

export default function BrowseArticlesLayout({ children }: BrowseArticlesLayoutProps) {
  return (
    <div className="min-h-screen h-full dark:bg-zinc-900">
      <div className="h-[64px] md:pl-56 inset-y-0 w-full z-50 ">
        <ArticlesNavbar />
      </div>

      <div className="hidden md:flex h-full fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <div className="md:pl-64 h-full">{children}</div>
    </div>
  );
}

function ArticlesNavbar() {
  return (
    <div className="px-6 md:px-0 border-b w-full h-full flex justify-start items-center dark:bg-transparent bg-white shadow-sm">
      {/* <InstructorMobileSidebar /> */}
      <ArticlesNavbarRoutes />
    </div>
  );
}

import React from "react";
import UserAvatar from "@/components/user-avatar";
import { ThemeModeToggle } from "@/components/themeModeToggle";
import useUserInfo from "@/lib/hooks/use-user-info";
import Notifications from "@/components/notification-button";
import SearchButton from "@/components/search-button";
import ArticlesSearchButton from "./articles/_components/articles-search-button";

function ArticlesNavbarRoutes({ name }: any) {
  const user = useUserInfo();

  return (
    <div className="w-full ml-auto md:mr-8 md:ml-16 flex justify-between items-center">
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
      <div className="ml-auto flex justify-end items-center gap-x-2">
        <ThemeModeToggle />
        <Notifications />
        <UserAvatar />
      </div>
    </div>
  );
}
