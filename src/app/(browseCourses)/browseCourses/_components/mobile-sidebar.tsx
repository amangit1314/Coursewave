import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Sidebar from './sidebar';
import Image from "next/image";
import SideBarRoutes from "./sidebarRoutes";

function MobileSidebar() {
    return (
      <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="px-3 py-4 bg-white dark:bg-gray-800">
          {/* <Sidebar /> */}
          <a
            href="/browseCourses"
            className="pb-6 flex cursor-pointer items-center"
          >
            <Image
              src="/courseWaveFaviconColored.png"
              alt="CourseWave Logo"
              className=""
              width={30}
              height={8}
              priority
            />
            <p className="pl-2 text-blue-500 font-bold font-mono text-xl">
              Coursewave
            </p>
          </a>
          <SideBarRoutes />
        </SheetContent>
      </Sheet>
    );
}

export default MobileSidebar

export function Menu() {
    return (
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
    );
} 