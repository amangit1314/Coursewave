import React from 'react'
import Image from 'next/image'
import { CgMenuRightAlt } from 'react-icons/cg';
import { ThemeModeToggle } from './themeModeToggle';
import Link from 'next/link';

interface TestimonialItemProps {
    handleLoginClick: any;
}

const Header: React.FC<TestimonialItemProps> = ({
    handleLoginClick,
}) => {
   
    return (
      <div className="z-10 bg-transparent max-w-7xl mx-auto flex w-full items-center py-auto justify-between">
        <div className="flex cursor-pointer items-center py-auto">
          <Image
            src="/courseWaveFaviconColored.png"
            alt="CourseWave Logo"
            width={30}
            height={8}
            priority
          />
          <p className="pl-2 text-blue-500 font-bold font-mono text-sm md:text-xl">
            Coursewave
          </p>
        </div>

        <div className="hidden lg:flex lg:visible justify-around">
          <a
            href="/browseCourses"
            className="text-md ml-2 opacity-70 hover:opacity-100  hover:text-white border hover:bg-blue-500 border-slate-400 cursor-point bg-transparent font-medium rounded-3xl px-4 py-2"
          >
            Courses
          </a>
          <a
            href=""
            className="text-md ml-2 opacity-70 hover:opacity-100  hover:text-white border hover:bg-blue-500 border-slate-400 cursor-point bg-transparent font-medium rounded-3xl px-4 py-2"
          >
            Articles
          </a>
          <a
            href=""
            className="text-md ml-2 opacity-70 hover:opacity-100  hover:text-white border hover:bg-blue-500 border-slate-400 cursor-point bg-transparent font-medium rounded-3xl px-4 py-2"
          >
            Sessions
          </a>
        </div>

        <div className="flex justify-center items-center py-auto">
          <ThemeModeToggle />

          <Link
            className="ml-2 hidden xl:visible lg:visible lg:flex  items-center py-auto"
            href="/sign-in"
          >
            <button
              onClick={handleLoginClick}
              className="hover:bg-blue-500 text-base bg-transparent text-blue-500 hover:text-white border border-blue-500 hover:border-none shadow-xl font-medium rounded-3xl px-4 py-2"
            >
              Login
            </button>
          </Link>

          <CgMenuRightAlt
            size={20}
            className="ml-1.5 dark:bg-gray-700 dark:border-transparent h-10 w-10 visible xl:hidden lg:hidden md:hidden p-3 border rounded-full border-blue-300"
          />
        </div>
      </div>
    );
}

export default Header