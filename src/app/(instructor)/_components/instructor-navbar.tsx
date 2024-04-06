import React from "react";
import InstructorMobileSidebar from "./instructor-mobile-sidebar";
import InstructorNavbarRoutes from "./instructor-navbar-routes";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

function InstructorNavbar() {
  const path = usePathname();
  const isAnalyticsPage = !!path.includes("analytics");
  return (
    <div
      className={cn(
        "px-6 md:px-0 border-b w-full h-full flex justify-start items-center bg-white shadow-sm",
        isAnalyticsPage ? "dark:bg-gray-800" : "dark:bg-zinc-800"
      )}
    >
      <InstructorMobileSidebar />
      <InstructorNavbarRoutes />
    </div>
  );
}

export default InstructorNavbar;
