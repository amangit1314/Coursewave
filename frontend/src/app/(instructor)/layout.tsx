"use client";

import "@uploadthing/react/styles.css";
import { usePathname } from "next/navigation";
import InstructorNavbar from "./_components/instructor-navbar";
import InstructorSidebar from "./_components/instructor-sidebar";

interface InstructorLayoutProps {
  children: React.ReactNode;
}

export default function InstructorLayout({ children }: InstructorLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="h-full min-h-screen dark:bg-zinc-900">
      <div className="fixed inset-y-0 z-50 h-[64px] w-full">
        <InstructorNavbar />
      </div>

      {/* {(() => {
        // Hide sidebar if pathname is exactly /instructor/:id, show otherwise
        // /instructor/123  => hide
        // /instructor/123/anything  => show
        // /instructor/  => show (not a profile page)
        // /instructor   => show
        // /instructor/   => show
        // /instructor/123/edit => show
        // /instructor/abc/def => show
        // /instructor/abc => hide

        // Remove trailing slash for consistency
        // const normalizedPath = pathname.endsWith("/") && pathname.length > 1
        //   ? pathname.slice(0, -1)
        //   : pathname;

        // Match /instructor/:id exactly (no more segments)
        // const match = normalizedPath.match(/^\/instructor\/([^\/]+)$/);

        // if (match) {
        //   // Hide sidebar
        //   return null;
        // }

        // Show sidebar for all other instructor routes
        return (
          <div
            id="cta-button-sidebar"
            className="fixed inset-y-0 z-50 hidden h-full md:flex"
          >
            <InstructorSidebar />
          </div>
        );
      })()} */}

      {/* <div
        id="cta-button-sidebar"
        className="fixed inset-y-0 z-50 hidden h-full md:flex"
      > */}
        <InstructorSidebar />
      {/* </div> */}

      <div className="h-full md:pl-72">{children}</div>
    </div>
  );
}
