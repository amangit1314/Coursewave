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
      <div className="md:ml-64 h-[64px] w-full">
        <InstructorNavbar />
      </div>

      <div className="z-50 h-full md:flex">
        <InstructorSidebar />
      </div>

      <div className="h-full md:pl-64">{children}</div>
    </div>
  );
}
