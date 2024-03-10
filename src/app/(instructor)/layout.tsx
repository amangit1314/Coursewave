import Navbar from "../(browseCourses)/browseCourses/_components/navbar";
import Sidebar from "../(browseCourses)/browseCourses/_components/sidebar";

import InstructorNavbar from "./_components/instructor-navbar";
import InstructorSidebar from "./_components/instructor-sidebar";

interface InstructorLayoutProps {
  children: React.ReactNode;
}

export default function InstructorLayout({ children }: InstructorLayoutProps) {
  return (
    <div className="min-h-screen h-full dark:bg-zinc-700">
      <div className="h-[60px] md:pl-64 fixed inset-y-0 w-full z-50 ">
        <InstructorNavbar />
      </div>{" "}
      <div className="hidden md:flex h-full fixed inset-y-0 z-50">
        <InstructorSidebar />
      </div>
      <div className="md:pl-64 min-h-screen h-full dark:bg-slate-900">{children}</div>
    </div>
  );
}
