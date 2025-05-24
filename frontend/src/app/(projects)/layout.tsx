"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../(courses)/browse/_components/navbar";
import Sidebar from "../(courses)/browse/_components/sidebar";


interface ProjectsLayoutProps {
  children: React.ReactNode;
}

export default function ProjectsLayout({ children }: ProjectsLayoutProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isProjectPreviewPage, setIsProjectPreviewPage] = useState(false);

  // Ensure that the client-side rendering handles path-related checks
  useEffect(() => {
    setIsClient(true); // Set the flag to true after mounting
    setIsProjectPreviewPage(
      pathname?.startsWith("/projects/") ?? false,
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

      {!isProjectPreviewPage && (
        <div
          id="cta-button-sidebar"
          className="fixed inset-y-0 z-50 hidden h-full md:flex"
        >
          <Sidebar />
        </div>
      )}

      <div
        className={
          isProjectPreviewPage ? "mx-auto h-full max-w-6xl" : "h-full md:pl-64"
        }
      >
        {children}
      </div>
    </div>
  );
}
