"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../(browseCourses)/browseCourses/_components/sidebar";


interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  // Use regex to match specific URL patterns
  const hideSidebar =
    pathname.match(
    /dashboard\/enrolledCourses\/(undefined|null)/
  );

  return (
    <div className="min-h-screen h-full dark:bg-zinc-900">
      {/* Navbar goes here, comment as needed */}
      {/* {/* <div className="h-[60px] md:pl-56 fixed inset-y-0 w-full z-50 ">
        <Navbar />
      </div> */}

      {/* Hide Sidebar based on `hideSidebar` flag */}
      {/* {hideSidebar && ( */}
        <div className="hidden md:flex h-full fixed inset-y-0 z-50">
          <Sidebar />
        </div>
      {/* )} */}

      <div className="md:pl-72 h-full pr-8">{children}</div>
    </div>
  );
}
