"use client";

import Navbar from "@/app/(public)/browse/_components/Navbar";
import Sidebar from "@/app/(public)/browse/_components/Sidebar";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  // Hide sidebar when URL matches /user_[userId]/dashboard/enrolledCourses/course_[courseId]
  const hideSidebar = pathname.match(
    /\/user_[a-zA-Z0-9]+\/dashboard\/enrolledCourses\/course_[a-zA-Z0-9]+/
  );

  return (
    <div className="h-full min-h-screen bg-background">
      <div className="fixed inset-y-0 z-50 h-[64px] w-full">
        <Navbar />
      </div>

      {!hideSidebar && (
        <div
          id="cta-button-sidebar"
          className="fixed inset-y-0 z-50 hidden h-full md:flex"
        >
          <Sidebar />
        </div>
      )}

      <div className={`h-full ${!hideSidebar ? "md:pl-72" : ""}`}>
        {children}
      </div>
    </div>
  );
}
