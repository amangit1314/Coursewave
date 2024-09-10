import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import InstructorSidebar from "./instructor-sidebar";
import { Menu } from "@/components/menu-icon";
import InstructorSideBarRoutes from "./instructor-sidebar-routes";
import Image from "next/image";
import Link from "next/link";
import { Josefin_Sans } from "next/font/google";

const josefinSans = Josefin_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const InstructorMobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="pr-4 transition hover:opacity-75 md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="bg-white p-0">
        <Link
          href="/browseCourses"
          className="flex cursor-pointer items-center pb-6"
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
            className={`pl-2 text-xl font-bold text-blue-500 ${josefinSans.className}`}
          >
            Coursewave
          </p>
        </Link>
        <InstructorSideBarRoutes />
        {/* <InstructorSidebar /> */}
      </SheetContent>
    </Sheet>
  );
};

export default InstructorMobileSidebar;
