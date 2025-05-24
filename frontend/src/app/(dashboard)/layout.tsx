// "use client";

// import { usePathname } from "next/navigation";
// import Navbar from "../(courses)/browse/_components/navbar";
// import Sidebar from "../(courses)/browse/_components/sidebar";

// interface DashboardLayoutProps {
//   children: React.ReactNode;
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const pathname = usePathname();

//   const hideSidebar = pathname.match(
//     /dashboard\/enrolledCourses\/(undefined|null)/,
//   );

//   return (
//     <div className="h-full min-h-screen dark:bg-zinc-900">
//       <div className="fixed inset-y-0 z-50 h-[64px] w-full">
//         <Navbar />
//       </div>

//       <div
//         id="cta-button-sidebar"
//         className="fixed inset-y-0 z-50 hidden h-full md:flex"
//       >
//         <Sidebar />
//       </div>

//       <div className="h-full md:pl-72">{children}</div>
//     </div>
//   );
// }

"use client";

import { usePathname } from "next/navigation";
import Navbar from "../(courses)/browse/_components/navbar";
import Sidebar from "../(courses)/browse/_components/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  // Hide sidebar when URL matches /user_[userId]/dashboard/enrolledCourses/course_[courseId]
  const hideSidebar = pathname.match(
    /\/user_[a-zA-Z0-9]+\/dashboard\/enrolledCourses\/course_[a-zA-Z0-9]+/,
  );

  return (
    <div className="h-full min-h-screen dark:bg-zinc-900">
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