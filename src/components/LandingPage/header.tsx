import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Grip } from "lucide-react";
import { Orbitron } from "next/font/google";
import { Button } from "@/components/ui/button";
import { ThemeModeToggle } from "../theme-mode-toggle";
import { MobileMenuDrawerButton } from "./menu";

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const LandingPageHeader = ({ handleLoginClick }: { handleLoginClick: any }) => {
  const links = [
    {
      name: "Courses",
      link: "/browseCourses",
    },
    {
      name: "Articles",
      link: "/articles",
    },
    {
      name: "Sessions",
      link: "/browseSessions",
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ];
  return (
    <div className="py-auto max-w-screen sticky top-0 z-10 mx-auto flex h-[64px] w-full items-center justify-between overflow-x-hidden overflow-y-hidden border-b bg-transparent px-[.75rem] py-[2rem] backdrop-blur-xl md:max-w-7xl md:p-[2rem]">
      {/* coursewave logo and text */}
      <div className="py-auto flex cursor-pointer items-center space-x-2">
        <Image
          src="/assets/images/logo/coursewave-favicon-color.png"
          alt="CourseWave Logo"
          width={30}
          height={8}
          priority
        />
        <div className={orbitron.className}>
          <p className="text-[1.1rem] font-extrabold capitalize tracking-tight text-blue-500 md:text-[1.1rem]">
            Coursewave
          </p>
        </div>
      </div>

      {/* navigate links */}
      <div className="hidden justify-around lg:visible lg:flex lg:space-x-4">
        {links.map((link, index) => {
          return (
            <div key={index} className={orbitron.className}>
              <Link
                href={link.link}
                className="cursor-pointer text-[.8rem] font-medium text-gray-800 transition-all duration-100 hover:text-blue-500 dark:text-white dark:hover:text-blue-500"
              >
                {link.name}
              </Link>
            </div>
          );
        })}
      </div>

      {/* theme and other icons */}
      <div className="py-auto flex items-center justify-center space-x-2">
        <ThemeModeToggle />

        <Link
          className="py-auto hidden items-center md:visible md:flex"
          href="/login"
        >
          <Button
            onClick={handleLoginClick}
            variant={"outline"}
            size={"icon"}
            className="border-stroke group visible flex h-10 w-10 items-center justify-center rounded-md border transition-all duration-200 dark:bg-transparent dark:hover:bg-zinc-800 md:hidden"
          >
            Login
          </Button>
        </Link>

        <div className="visible flex md:hidden">
          <MobileMenuDrawerButton />
        </div>
      </div>
    </div>
  );
};

export default LandingPageHeader;
