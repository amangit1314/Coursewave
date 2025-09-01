import React from "react";
import MobileSidebar from "./MobileSidebar";
import NavbarRoutes from "@/app/(shared)/NavbarRoutes";

const Navbar = () => {
  return (
    <div className="p-4 border-b dark:border-zinc-700 h-full flex items-center dark:bg-zinc-900 bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
