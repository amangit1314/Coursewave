"use client";

import "@uploadthing/react/styles.css";
import { usePathname } from "next/navigation";
import InstructorNavbar from "./_components/instructor-navbar";
import InstructorSidebar from "./_components/instructor-sidebar";

interface InstructorLayoutProps {
  children: React.ReactNode;
}

export default function InstructorLayout({ children }: InstructorLayoutProps) {
  const path = usePathname();
  const isAnalyticsPage = path.includes("analytics");

  return (
    <div
      className={`h-full min-h-screen ${isAnalyticsPage ? "dark:bg-zinc-900" : "dark:bg-zinc-900"} `}
    >
      <div className="fixed inset-y-0 z-50 h-[60px] w-full md:pl-64">
        <InstructorNavbar />
      </div>
      <div className="flex h-full md:fixed md:inset-y-0 md:z-50">
        <InstructorSidebar />
      </div>
      <div
        className={`h-full min-h-screen md:pl-64 ${isAnalyticsPage ? "dark:bg-zinc-900" : "dark:bg-zinc-900"}`}
      >
        {children}
      </div>
    </div>
  );
}
