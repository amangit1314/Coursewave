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
      className={`min-h-screen h-full ${isAnalyticsPage ? "dark:bg-zinc-900" : "dark:bg-zinc-900"} `}
    >
      <div className="h-[60px] md:pl-64 fixed inset-y-0 w-full z-50 ">
        <InstructorNavbar />
      </div>
      <div className="flex h-full md:fixed md:inset-y-0 md:z-50">
        <InstructorSidebar />
      </div>
      <div
        className={`md:pl-64 min-h-screen h-full ${isAnalyticsPage ? "dark:bg-zinc-900" : "dark:bg-zinc-900"}`}
      >
        {children}
      </div>
    </div>
  );
}
