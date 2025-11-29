"use client";

import UserAvatar from "./UserAvatar";
import React, { Suspense } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";
import { ThemeModeToggle } from "./ThemeModeToggle";
import { dmSans, poppins } from "@/lib/config/fonts";
import Notifications from "./NotificationButton";
import { useUserStore } from "@/zustand/userStore";
import InstructorButton from "../InstructorButton";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useProjectDetails } from "@/hooks/useProjects";

const NavbarRoutes = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const { user } = useUserStore();

  console.log("Navbar user: ", JSON.stringify(user));

  const gotToSignIn = () => {
    router.push("/login");
  };

  const isBrowseCoursesScreen = pathname.match("/browse");
  const isDashboardScreen = pathname.includes("dashboard");

  // Check if we're on a project detail page
  const isProjectDetailPage = pathname?.startsWith("/projects/") && params?.slug;
  const projectSlug = isProjectDetailPage ? (params.slug as string) : undefined;

  // Fetch project details only if on project detail page
  const { data: project } = useProjectDetails(projectSlug);

  return (
    <Suspense>
      <div className="flex w-full items-center justify-between">
        {/* Breadcrumb for project pages */}
        {isProjectDetailPage ? (
          <div className={`${poppins.className} flex items-center gap-2 text-sm`}>
            <Link
              href="/browse"
              className="flex cursor-pointer items-center"
            >
              <Image
                src="/assets/images/logo/coursewave-favicon-color.png"
                alt="Coursewave Logo"
                width={30}
                height={30}
                priority
              />
              <p
                className={`${dmSans.className} pl-2 text-blue-500 font-bold text-lg`}
              >
                Coursewave
              </p>
            </Link>

            <ChevronRight className="w-4 h-4 dark:text-zinc-600 text-zinc-400" />

            <Link
              href="/projects"
              className="font-medium hover:text-blue-500 cursor-pointer hover:text-underline dark:hover:text-blue-400 dark:hover:text-underline transition-all duration-200 dark:text-zinc-400 text-zinc-600 hover:dark:text-white hover:text-zinc-900 transition-colors"
            >
              Projects
            </Link>

            <ChevronRight className="w-4 h-4 dark:text-zinc-600 text-zinc-400" />

            <span className="font-semibold dark:text-blue-400 text-blue-600 line-clamp-1 max-w-xs">
              {project?.title || "Loading..."}
            </span>
          </div>
        ) : (
          <div>
            <Link
              href="/browse"
              className="flex cursor-pointer items-center"

            >
              <Image
                src="/assets/images/logo/coursewave-favicon-color.png"
                alt="Coursewave Logo"
                width={30}
                height={30}
                priority
              />
              <p
                className={`${dmSans.className} pl-2 text-blue-500 font-bold text-lg`}
              >
                Coursewave
              </p>
            </Link>
          </div>
        )}

        <div className="ml-auto flex justify-end gap-x-2">
          {/* instructor button */}
          <div className={dmSans.className}>
            {user && !isDashboardScreen ? <InstructorButton /> : <div></div>}
          </div>

          {/* theme toggle */}
          <ThemeModeToggle />

          {/* notifications */}
          <Notifications />

          {/* user profile */}
          <div>
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
      </div>
    </Suspense>
  );
};

export default NavbarRoutes;
