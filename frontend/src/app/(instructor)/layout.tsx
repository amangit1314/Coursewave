// "use client";

// import "@uploadthing/react/styles.css";
// import { usePathname } from "next/navigation";
// import InstructorNavbar from "./_components/InstructorNavbar";
// import InstructorSidebar from "./_components/InstructorSidebar";

// interface InstructorLayoutProps {
//   children: React.ReactNode;
// }

// export default function InstructorLayout({ children }: InstructorLayoutProps) {
//   const pathname = usePathname();

//   return (
//     <div className="h-full min-h-screen bg-gray-50 dark:bg-zinc-900">
//       {/* Sidebar - Hidden on mobile, visible on md+ */}
//       <InstructorSidebar />

//       {/* <div className="fixed inset-y-0 z-40 hidden h-full md:flex md:w-64">
//         <InstructorSidebar />
//       </div> */}

//       {/* <div className="fixed inset-y-0 z-50 hidden h-full md:flex">
//         <InstructorSidebar />
//       </div> */}

//       {/* Navbar - Full width on mobile, offset by sidebar on md+ */}
//       <InstructorNavbar />

//       {/* Main Content - Full width on mobile, offset by sidebar on md+ */}
//       {/* md:pl-65 */}
//       <main className="pb-14 min-h-screen md:pl-65">
//         <div className="px-6 pb-8">{children}</div>
//       </main>
//     </div>
//   );
// }

"use client";

import "@uploadthing/react/styles.css";
import { usePathname } from "next/navigation";
import InstructorNavbar from "./_components/InstructorNavbar";
import InstructorSidebar from "./_components/InstructorSidebar";
import { useEffect, useState } from "react";

// Custom hook to detect mobile viewport
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

interface InstructorLayoutProps {
  children: React.ReactNode;
}

export default function InstructorLayout({ children }: InstructorLayoutProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile(768);

  // List of routes to restrict on mobile
  const restrictedRoutes = [
    "/instructor/analytics",
    "/instructor/courses",
    "/instructor/earnings",
    "/instructor/students",
    "/instructor/articles",
    "/instructor/projects",
    "/instructor/sessions",
    "/instructor/communities",
    "/instructor/settings",
    "/instructor/helpAndSupport",
    // Add additional restricted routes here
  ];

  // Block content if on restricted route and mobile
  const shouldBlockMobile =
    isMobile && restrictedRoutes.some((r) => pathname.startsWith(r));

  if (shouldBlockMobile) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="p-8 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Desktop Only</h2>
          <p className="text-zinc-700 dark:text-zinc-300">
            This page is only available on desktop devices.
            <br />
            Please use a larger screen for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Sidebar - Hidden on mobile, visible on md+ */}
      {/* <div className="fixed inset-y-0 z-40 hidden h-full md:flex md:w-64"> */}
        <InstructorSidebar />
      {/* </div> */}
      {/* Navbar */}
      <InstructorNavbar />
      {/* Main Content */}
      <main className="pb-14 min-h-screen md:pl-72">
        <div className="px-6 pb-8">{children}</div>
      </main>
    </div>
  );
}
