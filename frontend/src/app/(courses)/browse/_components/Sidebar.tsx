"use client";

import React from 'react'
import Image from 'next/image'
import { Poppins, Orbitron } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import SideBarRoutes from './SidebarRoutes';
import Link from 'next/link';

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

const Sidebar = () => {
  return (
    <div
      className="fixed border-r border-gray-200 dark:border-zinc-800 top-0 left-0 z-40 w-auto lg:w-64 h-screen scrollbar-thin transition-transform -translate-x-full sm:translate-x-0 shadow-sm bg-white dark:bg-zinc-900 overflow-y-auto"
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
            className={`${orbitron.className} pl-2 text-blue-500 font-bold text-lg`}
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