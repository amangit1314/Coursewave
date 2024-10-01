"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../(browseCourses)/browseCourses/_components/navbar";
import Sidebar from "../(browseCourses)/browseCourses/_components/sidebar";

interface RoadmapsLayoutProps {
  children: React.ReactNode;
}

export default function RoadmapsLayout({ children }: RoadmapsLayoutProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isRoadmapPreviewPage, setIsRoadmapPreviewPage] = useState(false);

  // Ensure that the client-side rendering handles path-related checks
  useEffect(() => {
    setIsClient(true); // Set the flag to true after mounting
    setIsRoadmapPreviewPage(
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

      {!isRoadmapPreviewPage && (
        <div
          id="cta-button-sidebar"
          className="fixed inset-y-0 z-50 hidden h-full md:flex"
        >
          <Sidebar />
        </div>
      )}

      <div
        className={
          isRoadmapPreviewPage ? "mx-auto h-full max-w-6xl" : "h-full md:pl-64"
        }
      >
        {children}
      </div>
    </div>
  );
}
