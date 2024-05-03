import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import InstructorSidebar from './instructor-sidebar';
import { Menu } from '@/components/menu-icon';
import InstructorSideBarRoutes from './instructor-sidebar-routes';
import Image from "next/image";
import Link from "next/link";
import { Josefin_Sans } from "next/font/google";

const josefinSans = Josefin_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});


function InstructorMobileSidebar() {
    return (
      <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white">
          <Link
            href="/browseCourses"
            className="pb-6 flex cursor-pointer items-center"
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
              className={`pl-2 text-blue-500 font-bold text-xl ${josefinSans.className}`}
            >
              Coursewave
            </p>
        </Link>
                <InstructorSideBarRoutes />
          {/* <InstructorSidebar /> */}
        </SheetContent>
      </Sheet>
    );
}

export default InstructorMobileSidebar