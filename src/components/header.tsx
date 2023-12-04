"use client";

import React from 'react'
import Image from 'next/image'

import { CgMenuRightAlt } from 'react-icons/cg';
import { ThemeModeToggle } from './themeModeToggle';
import { UserButton } from '@clerk/nextjs';

interface TestimonialItemProps {
    handleLoginClick: any;
    handleSignUpClick: any;
}

const Header: React.FC<TestimonialItemProps> = ({
    handleLoginClick,
    handleSignUpClick
}) => {
   

 
    return (
        <div className="z-10 bg-transparent max-w-8xl flex w-full items-center py-auto justify-between">
            <div className="flex cursor-pointer items-center py-auto">
                <Image
                    src="/courseWaveFaviconColored.png"
                    alt="CourseWave Logo"
                    width={30}
                    height={8}
                    priority
                />
                <p className="pl-2 text-blue-500 font-bold font-mono text-sm md:text-xl">Coursewave</p>
            </div>

            <div className='hidden lg:flex lg:visible justify-around'>
                <a href="/browseCourses" className="text-md ml-2 hover:font-semibold hover:text-blue-500 border hover:border-blue-500 cursor-point bg-transparent font-md rounded-3xl px-4 py-2">Courses</a>
                <a href="" className="text-md ml-2 hover:font-semibold hover:text-blue-500 border hover:border-blue-500 cursor-point bg-transparent font-md rounded-3xl px-4 py-2">Articles</a>
                <a href="" className="text-md ml-2 hover:font-semibold hover:text-blue-500 border hover:border-blue-500 cursor-point bg-transparent font-md rounded-3xl px-4 py-2">Sessions</a>
                {/* <a href="" className="text-md ml-2 hover:font-semibold hover:text-blue-500 border hover:border-blue-500 cursor-point bg-transparent font-md rounded-3xl px-4 py-2">Mentorships</a> */}
            </div>

            <div className='flex justify-center items-center py-auto'>
                <ThemeModeToggle />

                {/* <UserButton afterSignOutUrl="/" /> */}
                <div className="mx-2 hidden xl:visible lg:visible lg:flex items-center py-auto">
                    <a href="/sign-in">
                        <button onClick={handleLoginClick} className="bg-blue-500 text-white font-md rounded-3xl px-4 py-2">Login</button>
                    </a> 
                </div>

                <CgMenuRightAlt size={20} className="ml-1.5 dark:bg-gray-700 dark:border-transparent h-10 w-10 visible xl:hidden lg:hidden md:hidden p-3 border rounded-full border-blue-300" />
            </div>
        </div>
    )
}

export default Header