import React from "react";
import Image from "next/image";
import InstructorSidebarRoutes from "./instructor-sidebar-routes";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import Link from "next/link";

const InstructorSidebar = () => {
  const path = usePathname();
  const isAnalyticsPage = path.includes("analytics");
  // const isAnalyticsPage = false;
  return (
    <div
      className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full overflow-y-auto border-r bg-white shadow-sm transition-transform sm:translate-x-0"
      aria-label="InstructorSidebar"
    >
      <div
        className={cn(
          "h-full overflow-y-auto bg-zinc-50 py-4 pl-3 md:px-3",
          isAnalyticsPage ? "dark:bg-zinc-800" : "dark:bg-zinc-800",
        )}
      >
        <Link
          href="/browseCourses"
          className="flex cursor-pointer items-center pb-6"
        >
          <Image
            src="/assets/images/logo/coursewave-favicon-color.png"
            alt="CourseWave Logo"
            className=""
            width={30}
            height={8}
            priority
          />
          <p className="pl-2 font-mono text-xl font-bold text-blue-500">
            Coursewave
          </p>
        </Link>

        <InstructorSidebarRoutes />
      </div>
    </div>
  );
};

export default InstructorSidebar;
