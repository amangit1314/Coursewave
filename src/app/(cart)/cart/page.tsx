import Navbar from "@/app/(browseCourses)/browseCourses/_components/navbar";
import InstructorButton from "@/components/instructor-button";
import Notifications from "@/components/notification-button";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { Toaster } from "@/components/ui/toaster";
import UserAvatar from "@/components/user-avatar";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Josefin_Sans } from "next/font/google";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const josefinSans = Josefin_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const CartPage = ({ params }: { params: { userId: string } }) => {
  return (
    <div className="max-w-7xl w-full h-full mx-auto items-center min-h-screen">
      <div className="flex justify-between px-8 my-2  items-center h-[60px] fixed inset-y-0 w-full z-50 ">
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

        <div className="ml-auto flex justify-end gap-x-2">
          {/* <Toaster /> */}

          {/* instructor button */}
          <InstructorButton />

          {/* theme toggle */}
          <ThemeModeToggle />

          {/* cart */}
          {/* <Cart /> */}

          {/* notifications */}
          <Notifications />

          {/* user profile */}
          {<UserAvatar />}
        </div>
      </div>
      <div className=" p-8 w-full h-full bg-transparent dark:bg-zinc-900">
        {/* <CartBreadcrumb /> */}
        <Breadcrumb />
      </div>
    </div>
  );
};

export default CartPage;

function CartBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>Themes</DropdownMenuItem>
              <DropdownMenuItem>GitHub</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
