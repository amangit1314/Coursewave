import React from "react";
import Image from "next/image";
import { CgMenuRightAlt } from "react-icons/cg";
import { ThemeModeToggle } from "../themeModeToggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Grip } from "lucide-react";
import { absoluteUrl } from "@/utils/utils";
interface TestimonialItemProps {
  handleLoginClick: any;
}

const LandingPageHeader: React.FC<TestimonialItemProps> = ({
  handleLoginClick,
}) => {
  return (
    <div className="bg-transparent border-b sticky z-10 top-0 backdrop-blur-xl  p-[2rem] max-w-7xl h-[64px] w-full mx-auto flex justify-between items-center py-auto overflow-x-hidden overflow-y-hidden ">
      {/* coursewave logo and text */}
      <div className="flex cursor-pointer items-center py-auto">
        <Image
          src="/assets/images/logo/coursewave-favicon-color.png"
          alt="CourseWave Logo"
          width={30}
          height={8}
          priority
        />
        <p className="pl-2 text-blue-500 font-mono tracking-tight font-extrabold capitalize text-[1rem]">
          Coursewave
        </p>
      </div>

      {/* navigate links */}
      <div className="hidden lg:flex lg:visible justify-around lg:space-x-4">
        {/* <Link
          href=""
          className="text-[14px] text-gray-400 hover:text-blue-500 cursor-point font-medium"
        >
          About
        </Link> */}
        <Link
          // href={absoluteUrl('/browseCourses')}
          href={"/browseCourses"}
          className="text-[14px] text-gray-400 hover:text-blue-500 cursor-point font-medium"
        >
          Courses
        </Link>
        <Link
            // href={absoluteUrl('/browseArticles')}
            href={"/browseArticles"}
            className="text-[1rem] text-gray-400 hover:text-blue-500 cursor-point font-medium"
          >
            Articles
          </Link>
        {/* 
          <Link
            href="/browseSessions"
            className="text-[14px] text-gray-400 hover:text-blue-500 cursor-point font-medium"
          >
            Sessions
          </Link> */}
        <Link
          // href={absoluteUrl('/helpAndSupport')}
          href={"/helpAndSupport"}
          className="text-[14px] text-gray-400 hover:text-blue-500 cursor-point font-medium"
        >
          Contact
        </Link>
      </div>

      {/* theme and other icons */}
      <div className="flex justify-center items-center py-auto space-x-2">
        <ThemeModeToggle />

        <Link
          className="ml-2 hidden xl:visible lg:visible lg:flex  items-center py-auto"
          href="/login"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoginClick}
            className="flex justify-center items-center text-zinc-700 h-10 hover:text-white dark:hover:text-white text-[14px] bg-transparent dark:text-white dark:bg-transparent hover:shadow-xl font-medium dark:hover:bg-zinc-800 transition-all duration-200"
            color="gray"
          >
            Login
          </Button>
        </Link>

        <Button className="visible group md:hidden flex justify-center items-center h-10 w-10 rounded-md dark:bg-transparent dark:hover:bg-zinc-800 transition-all duration-200 border border-stroke">
          <Grip className="scale-100 md:scale-0 transition-all duration-200 text-black group-hover:text-white dark:text-white h-[1.2rem] w-[1.2rem]"  />
        </Button>
      </div>
    </div>
  );
};

export default LandingPageHeader;
