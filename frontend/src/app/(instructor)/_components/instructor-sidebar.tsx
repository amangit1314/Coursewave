import React from "react";
import Image from "next/image";
import InstructorSidebarRoutes from "./instructor-sidebar-routes";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const InstructorSidebar = () => {
  return (
    <div
      className="fixed border-r border-gray-200 dark:border-zinc-800 top-0 left-0 z-40 w-auto lg:w-64 h-screen scrollbar-thin transition-transform -translate-x-full sm:translate-x-0 shadow-sm bg-white dark:bg-zinc-900 overflow-y-auto"
      aria-label="InstructorSidebar"
    >
      <div className="h-full pl-3 md:px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-zinc-900 space-y-4">
        <Logo />

        <InstructorSidebarRoutes />
      </div>
    </div>
  );
};

export default InstructorSidebar;

const Logo = () => {
  return (
    <Link href="/instructor/analytics" className="flex cursor-pointer items-end">
      <Image
        src="/assets/images/logo/coursewave-favicon-color.png"
        alt="CourseWave Logo"
        className=""
        width={30}
        height={8}
        priority
      />
      <p
        className={`${orbitron.className} pl-2 text-blue-500 font-bold text-lg`}
      >
        Coursewave
      </p>
    </Link>
  );
};
