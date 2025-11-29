import React from "react";
import InstructorMobileSidebar from "./InstructorMobileSidebar";
import InstructorNavbarRoutes from "./InstructorNavbarRoutes";

function InstructorNavbar() {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-zinc-700 h-full flex items-center dark:bg-zinc-900 bg-white">
      <InstructorMobileSidebar />
      <InstructorNavbarRoutes />
    </div>
  );
}

export default InstructorNavbar;
