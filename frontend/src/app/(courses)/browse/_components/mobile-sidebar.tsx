import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Image from "next/image";
import Menu from './menu';
import { Josefin_Sans } from "next/font/google";
import SideBarRoutes from "./sidebar-routes";
import Link from 'next/link';

const josefinSans = Josefin_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const MobileSidebar = () => {
    return (
      <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
          <Menu />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="px-3 py-4 bg-white dark:bg-gray-800"
        >
          {/* <Sidebar /> */}
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
          <SideBarRoutes />
        </SheetContent>
      </Sheet>
    );
}

export default MobileSidebar