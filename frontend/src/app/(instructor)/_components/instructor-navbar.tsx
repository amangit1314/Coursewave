import React from "react";
import InstructorMobileSidebar from "./instructor-mobile-sidebar";
import InstructorNavbarRoutes from "./instructor-navbar-routes";
import { cn } from "@/utils/utils";
import { usePathname } from "next/navigation";

function InstructorNavbar() {
  const path = usePathname();
  const isAnalyticsPage = !!path.includes("analytics");
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-start border-b bg-white px-6 shadow-sm md:px-0",
        isAnalyticsPage ? "dark:bg-zinc-800" : "dark:bg-zinc-800",
      )}
    >
      <InstructorMobileSidebar />
      <InstructorNavbarRoutes />
    </div>
  );
}

export default InstructorNavbar;
