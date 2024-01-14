import React from 'react'
import Image from 'next/image'
import { CgMenuRightAlt } from 'react-icons/cg';
import { ThemeModeToggle } from '../themeModeToggle';
import Link from 'next/link';
import { Button } from '@tremor/react';

interface TestimonialItemProps {
    handleLoginClick: any;
}

const LandingPageHeader: React.FC<TestimonialItemProps> = ({
    handleLoginClick,
}) => {
   
    return (
      <div className="bg-transparent border-b sticky z-10 top-0 backdrop-blur-xl  p-[1rem] max-w-7xl h-[64px] w-full mx-auto flex justify-between items-center py-auto ">
        {/* coursewave logo and text */}
        <div className="flex cursor-pointer items-center py-auto">
          <Image
            src="/courseWaveFaviconColored.png"
            alt="CourseWave Logo"
            width={30}
            height={8}
            priority
          />
          <p className="pl-2 text-blue-500 tracking-tight font-bold capitalize text-[1rem]">
            Coursewave
          </p>
        </div>

        {/* navigate links */}
        <div className="hidden lg:flex lg:visible justify-around lg:space-x-4">
          <Link
            href=""
            className="text-[14px] text-gray-400 hover:text-blue-500 cursor-point font-medium"
          >
            About
          </Link>
          <Link
            href="/browseCourses"
            className="text-[14px] text-gray-400 hover:text-blue-500 cursor-point font-medium"
          >
            Courses
          </Link>
          {/* <Link
            href=""
            className="text-[1rem] text-gray-400 hover:text-blue-500 cursor-point font-medium"
          >
            Articles
          </Link> */}
          <Link
            href=""
            className="text-[14px] text-gray-400 hover:text-blue-500 cursor-point font-medium"
          >
            Sessions
          </Link>
          <Link
            href=""
            className="text-[14px] text-gray-400 hover:text-blue-500 cursor-point font-medium"
          >
            Contact
          </Link>
        </div>

        {/* theme and other icons */}
        <div className="flex justify-center items-center py-auto">
          <ThemeModeToggle />

          <Link
            className="ml-2 hidden xl:visible lg:visible lg:flex  items-center py-auto"
            href="/login"
          >
            <Button
            // onClick={handleLoginClick}
            className="hover:bg-blue-600 text-zinc-700 hover:text-white dark:hover:text-blue-600  text-base dark:border-none bg-transparent dark:text-white dark:bg-zinc-900 hover:shadow-xl font-medium"
            color="gray"
            >
              Login
            </Button>
          </Link>

          <CgMenuRightAlt
            size={20}
            className="ml-1.5 dark:bg-gray-700 dark:border-transparent h-10 w-10 visible xl:hidden lg:hidden md:hidden p-3 border rounded-full border-blue-300"
          />
        </div>
      </div>
    );
}

export default LandingPageHeader;