"use client";

import React, { useState } from "react";
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
import { dmSans } from "@/lib/config/fonts";
import { Button } from "@/components/ui/button";

const MobileSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden flex justify-center shadow-none border-gray-200 dark:border-zinc-800 cursor-pointer items-center h-10 w-10 rounded-md dark:bg-transparent dark:hover:bg-zinc-800 transition-all duration-200"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="px-3 py-4 bg-white dark:bg-zinc-900 h-screen overflow-y-auto scrollbar-thin w-[280px] sm:w-[320px] [&>button]:hidden"
      >
        {/* Header with logo and close button */}
        <div className="flex items-center justify-between mb-6 pr-2">
          <Link
            href="/browse"
            className="flex cursor-pointer items-center"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/assets/images/logo/coursewave-favicon-color.png"
              alt="Coursewave Logo"
              width={30}
              height={30}
              priority
            />
            <p
              className={`${dmSans.className} pl-2 text-blue-500 font-bold text-lg`}
            >
              Coursewave
            </p>
          </Link>

          {/* Close Button */}
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </Button>
          </SheetClose>
        </div>

        {/* Sidebar Routes */}
        <div onClick={() => setOpen(false)}>
          <SideBarRoutes />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;