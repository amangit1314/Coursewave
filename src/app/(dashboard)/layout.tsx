"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../(browseCourses)/browseCourses/_components/sidebar";
import Navbar from "../(browseCourses)/browseCourses/_components/navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const hideSidebar = pathname.match(
    /dashboard\/enrolledCourses\/(undefined|null)/,
  );

  return (
    <div className="h-full min-h-screen dark:bg-zinc-900">
      <div className="fixed inset-y-0 z-50 h-[64px] w-full">
        <Navbar />
      </div>

      <div
        id="cta-button-sidebar"
        className="fixed inset-y-0 z-50 hidden h-full md:flex"
      >
        <Sidebar />
      </div>

      <div className="h-full md:pl-72">{children}</div>
    </div>
  );
}
