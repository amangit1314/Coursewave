import React from 'react'
import Image from 'next/image'
import { Josefin_Sans } from "next/font/google";
import SideBarRoutes from './sidebar-routes';
import Link from 'next/link';

const josefinSans = Josefin_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const Sidebar = () => {
  return (
    <div
      className="fixed border-r top-0 left-0 z-40 w-auto lg:w-64 h-screen scrollbar-thin transition-transform -translate-x-full sm:translate-x-0 shadow-sm bg-white overflow-y-auto"
      aria-label="Sidebar"
    >
      <div className="h-full pl-3 md:px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-zinc-900">
        <Link
          href="/browseCourses"
          className="pb-6 flex cursor-pointer items-end"
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
      </div>
    </div>
  );
}

export default Sidebar