import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Sidebar from './sidebar';
import Image from "next/image";
import SideBarRoutes from "./sidebarRoutes";
import { Menu } from './menu';

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

