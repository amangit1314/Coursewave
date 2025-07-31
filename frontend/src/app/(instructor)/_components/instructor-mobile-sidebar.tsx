"use client";

import Link from "next/link";
import { Orbitron } from "next/font/google";
import { 
  Menu,
  X
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import InstructorSideBarRoutes from "./instructor-sidebar-routes";
import Image from "next/image";

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const InstructorMobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition cursor-pointer">
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
          <SheetClose className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors duration-200">
            <X className="h-5 w-5" />
          </SheetClose>
        </div>
        <InstructorSideBarRoutes />
      </SheetContent>
    </Sheet>
  );
};

export default InstructorMobileSidebar;
