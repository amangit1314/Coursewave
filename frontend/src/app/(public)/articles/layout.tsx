"use client";

import React from "react";
import ArticlesSearchButton from "./_components/ArticlesSearchButton";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/zustand/userStore";

import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import UserAvatar from "@/components/common/UserAvatar";
import Sidebar from "../browse/_components/Sidebar";
import Notifications from "@/components/common/NotificationButton";
import { dmSans } from "@/lib/config/fonts";

interface BrowseArticlesLayoutProps {
  children: React.ReactNode;
}

export default function BrowseArticlesLayout({
  children,
}: BrowseArticlesLayoutProps) {
  const pathname = usePathname();

  // Check if the current route matches "/articles/[articleId]"
  const isArticleDetailPage =
    pathname.startsWith("/articles/") && pathname.split("/").length === 3;

  const isEditPage = pathname.endsWith("/edit");

  return (
    <div className="h-full min-h-screen dark:bg-zinc-900">
      {/* Only show Navbar if not on the article detail page */}
      {!isArticleDetailPage && !isEditPage && (
        <div className="inset-y-0 z-50 h-[64px] w-full md:pl-56">
          <ArticlesNavbar />
        </div>
      )}

      {/* Only show Sidebar if not on the article detail page */}
      {!isArticleDetailPage && !isEditPage && (
        <div className="fixed inset-y-0 z-50 hidden h-full md:flex">
          <Sidebar />
        </div>
      )}

      {/* Adjust padding based on the route */}
      <div className={`h-full ${!isArticleDetailPage && !isEditPage ? "md:pl-64" : ""}`}>
        {children}
      </div>
    </div>
  );
}

const ArticlesNavbar = () => {
  return (
    <div className="flex h-full w-full items-center justify-start border-b border-gray-200 bg-white px-6 shadow-sm dark:bg-transparent md:px-0">
      <ArticlesNavbarRoutes />
    </div>
  );
};

const ArticlesNavbarRoutes = ({ name }: { name?: string }) => {
  const router = useRouter();

  const { user } = useUserStore();

  const gotToSignIn = () => {
    router.push("/login");
  };

  return (
    <div className="ml-auto flex w-full items-center justify-between md:ml-16 md:mr-8">
      <div className="">
        <ArticlesSearchButton />
      </div>
      <div className="ml-auto flex items-center justify-end gap-x-2">
        <ThemeModeToggle />
        <Notifications />
        {user ? (
          <UserAvatar />
        ) : (
          <span className={dmSans.className}>
            <button
              onClick={gotToSignIn}
              className="text-sm cursor-pointer hover:text-white h-10 text-center dark:hover:bg-blue-600 flex justify-center dark:hover:border-transparent items-center w-auto px-4 rounded-md border border-gray-200 dark:border-zinc-800 hover:border-transparent bg-white dark:bg-zinc-800 hover:bg-blue-600 transition-all duration-100"
            >
              Sign In
            </button>
          </span>
        )}
      </div>
    </div>
  );
};
