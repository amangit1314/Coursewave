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
    /dashboard\/enrolledCourses\/(undefined|null)/
  );

  return (
    <div className="min-h-screen h-full dark:bg-zinc-900">
      <div className="h-[64px] fixed inset-y-0 w-full z-50 ">
        <Navbar />
      </div>

      <div
        id="cta-button-sidebar"
        className="hidden md:flex h-full fixed inset-y-0 z-50"
      >
        <Sidebar />
      </div>

      <div className="md:pl-72 h-full">{children}</div>
    </div>
  );
}
