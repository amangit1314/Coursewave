import React from "react";
import InstructorMobileSidebar from "./instructor-mobile-sidebar";
import InstructorNavbarRoutes from "./instructor-navbar-routes";

function InstructorNavbar() {
  return (
    <div className="p-4 border-b dark:border-zinc-700 h-full flex items-center dark:bg-zinc-900 bg-white shadow-sm">
      <InstructorMobileSidebar />
      <InstructorNavbarRoutes />
    </div>
  );
}

export default InstructorNavbar;
