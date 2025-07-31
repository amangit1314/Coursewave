"use client";

import React, { useState } from "react";
import { Poppins, Orbitron } from "next/font/google";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import SideBarRoutes from "./SidebarRoutes";
import Image from "next/image";
import Link from "next/link";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const MobileSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="md:hidden hover:opacity-75 transition cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="px-3 py-4 bg-white dark:bg-zinc-900 h-screen overflow-y-auto scrollbar-thin"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/browseCourses"
            className="flex cursor-pointer items-center"
          >
            <Image
              src="/assets/images/logo/coursewave-favicon-color.png"
              alt="CourseWave Logo"
              className=""
              width={30}
              height={8}
              priority
            />
            <p
              className={`${orbitron.className} pl-2 text-blue-500 font-bold text-lg`}
            >
              CourseWave
            </p>
          </Link>
          <button
            className="h-[10px] w-[10px] flex items-center justify-center rounded-full text-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={10} />
          </button>
        </div>
        <SideBarRoutes />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
