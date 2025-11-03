import React from "react";
import InstructorMobileSidebar from "./InstructorMobileSidebar";
import InstructorNavbarRoutes from "./InstructorNavbarRoutes";

function InstructorNavbar() {
  return (
    // <div className="fixed top-0 left-0 right-0 z-50 p-4 border-b dark:border-zinc-700 h-[64px] flex items-center dark:bg-zinc-900 bg-white shadow-sm md:left-64">
    <div className="p-4 border-b border-gray-200 dark:border-zinc-700 h-full flex items-center dark:bg-zinc-900 bg-white">
      <InstructorMobileSidebar />
      <InstructorNavbarRoutes />
    </div>
  );
}

export default InstructorNavbar;
