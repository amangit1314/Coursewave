"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./_components/Sidebar";
import Navbar from "./_components/Navbar";

interface BrowseCoursesLayoutProps {
  children: React.ReactNode;
}

export default function BrowseCoursesLayout({
  children,
}: BrowseCoursesLayoutProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isCourseOverviewPage, setIsCourseOverviewPage] = useState(false);

  // Ensure that the client-side rendering handles path-related checks
  useEffect(() => {
    setIsClient(true); // Set the flag to true after mounting
    setIsCourseOverviewPage(
      pathname?.startsWith("/browseCourses/courseDetails/") ?? false,
    );
  }, [pathname]);

  if (!isClient) {
    // Return a loading state or a fallback to avoid mismatch during SSR
    return null;
  }

  return (
    <div className="h-full min-h-screen dark:bg-zinc-900">
      <div className="fixed inset-y-0 z-50 h-[64px] w-full">
        <Navbar />
      </div>

      {!isCourseOverviewPage && (
        <div
          id="cta-button-sidebar"
          className="fixed inset-y-0 z-50 hidden h-full md:flex"
        >
          <Sidebar />
        </div>
      )}

      <div
        className={
          isCourseOverviewPage ? "mx-auto h-full max-w-6xl" : "h-full md:pl-64"
        }
      >
        {children}
      </div>
    </div>
  );
}
