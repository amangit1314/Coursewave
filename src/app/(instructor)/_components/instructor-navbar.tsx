import React from "react";
import InstructorMobileSidebar from "./instructor-mobile-sidebar";
import InstructorNavbarRoutes from "./instructor-navbar-routes";

function InstructorNavbar() {
  return (
    <div className="px-6 md:px-0 border-b w-full h-full flex justify-start items-center dark:bg-slate-800 bg-white shadow-sm">
      <InstructorMobileSidebar />
      <InstructorNavbarRoutes />
    </div>
  );
}

export default InstructorNavbar;
