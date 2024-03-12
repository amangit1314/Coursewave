"use client";

import { Sidebar } from "lucide-react";
import { usePathname } from "next/navigation";
import Navbar from "../(browseCourses)/browseCourses/_components/navbar";

interface BrowseArticlesLayoutProps {
  children: React.ReactNode;
}

export default function BrowseArticlesLayout({ children }: BrowseArticlesLayoutProps) {
  const pathname = usePathname();
  const isCourseOverviewPage = pathname?.startsWith(
    "/browseCourses/courseDetails/"
  );

  return (
    <div className="min-h-screen h-full dark:bg-zinc-900">
      {isCourseOverviewPage ? (
        <div className="h-[60px] fixed inset-y-0 w-full z-50 ">
          <Navbar />
        </div>
      ) : (
        <div className="h-[64px] fixed inset-y-0 w-full z-50 ">
          <Navbar />
        </div>
      )}

      {isCourseOverviewPage ? (
        <div></div>
      ) : (
        <div
          id="cta-button-sidebar"
          className="hidden md:flex h-full fixed inset-y-0 z-50"
        >
          <Sidebar />
        </div>
      )}

      {isCourseOverviewPage ? (
        <div className="h-full max-w-6xl mx-auto items-center">{children}</div>
      ) : (
        <div className="md:pl-64 h-full">{children}</div>
      )}
    </div>
  );
}
