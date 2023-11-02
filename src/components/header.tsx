"use client";

import React from 'react'
import Image from 'next/image'

import { CgMenuRightAlt } from 'react-icons/cg';
import { ThemeModeToggle } from './themeModeToggle';

interface TestimonialItemProps {
    handleLoginClick: any;
    handleSignUpClick: any;
}

const Header: React.FC<TestimonialItemProps> = ({
    handleLoginClick,
    handleSignUpClick
}) => {
   

 
    return (
        <div className="z-10 max-w-7xl flex w-full items-center py-auto justify-between  text-sm lg:flex">
            <div className="flex cursor-pointer items-center py-auto">
                <Image
                    src="/courseWaveFaviconColored.png"
                    alt="CourseWave Logo"
                    className="dark:invert"
                    width={30}
                    height={8}
                    priority
                />
                <p className="pl-2 text-blue-500 font-bold font-mono text-xl">Coursewave</p>
            </div>

            <div className='hidden lg:flex lg:visible justify-around'>
                <a href="/browse" className="text-md ml-2 hover:font-semibold hover:text-blue-500 border hover:border-blue-500 cursor-point bg-transparent font-md rounded-3xl px-4 py-2">Courses</a>
                <a href="" className="text-md ml-2 hover:font-semibold hover:text-blue-500 border hover:border-blue-500 cursor-point bg-transparent font-md rounded-3xl px-4 py-2">Articles</a>
                <a href="" className="text-md ml-2 hover:font-semibold hover:text-blue-500 border hover:border-blue-500 cursor-point bg-transparent font-md rounded-3xl px-4 py-2">Sessions</a>
                <a href="" className="text-md ml-2 hover:font-semibold hover:text-blue-500 border hover:border-blue-500 cursor-point bg-transparent font-md rounded-3xl px-4 py-2">Mentorships</a>
            </div>

            <div className='flex justify-center'>
                <ThemeModeToggle />

                <div className="mx-2 hidden xl:visible lg:visible lg:flex items-center py-auto">
                    <a href="/login">
                        <button onClick={handleLoginClick} className="bg-blue-500 text-white font-md rounded-3xl px-4 py-2">Login</button>
                    </a> 
                </div>

                <CgMenuRightAlt size={24} className="visible xl:hidden lg:hidden md:hidden " />
            </div>
        </div>
    )
}

export default Header