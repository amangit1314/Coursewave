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
//     <div className="h-full min-h-screen dark:bg-zinc-900">
//       <div className="md:pl-60 h-[64px] w-full">
//         <InstructorNavbar />
//       </div>

//       <div className="z-50 h-full md:flex">
//         <InstructorSidebar />
//       </div>

//       <div className="h-full md:pl-64">{children}</div>
//     </div>
//   );
// }

"use client";

import "@uploadthing/react/styles.css";
import { usePathname } from "next/navigation";
import InstructorNavbar from "./_components/InstructorNavbar";
import InstructorSidebar from "./_components/InstructorSidebar";

interface InstructorLayoutProps {
  children: React.ReactNode;
}

export default function InstructorLayout({ children }: InstructorLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="h-full min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Sidebar - Hidden on mobile, visible on md+ */}
        <InstructorSidebar />

      {/* Navbar - Full width on mobile, offset by sidebar on md+ */}
      <InstructorNavbar />

      {/* Main Content - Full width on mobile, offset by sidebar on md+ */}
      <main className="pt-4 pb-14 md:pl-65 min-h-screen">
        <div className="px-6 pb-8">{children}</div>
      </main>
    </div>
  );
}
