'use client'; // required for lottie-react because it use (useState) internally

import React from "react";
import Lottie from "lottie-react";
import Image from 'next/image';
import { PiInfinityBold } from "react-icons/pi";
import { IoArrowForwardCircle } from "react-icons/io5";

const HeroSection = ({scrollAnimation}: any) => {
  return (
    <div className="h-screen pt-15 relative flex flex-col place-items-center -z-1">
      {/* <Image
        className="relative hidden md:flex"
        src="/women-with-laptop.png"
        alt="Hero Image"
        width={200}
        height={45}
        priority
      /> */}

      <div className="max-w-3xl w-full mx-auto">
        <h1 className="pt-16 text-[48px] text-zinc-950 dark:text-white tracking-tighter md:text-[52px] text-center leading-10 font-extrabold align-middle">
          <div className="flex ml-16">
            Unlock Your{" "}
            <PiInfinityBold size={48} className="text-blue-500 mx-[8px]" />
            Learning
          </div>
          Potential with
          <span className="text-blue-500 text-[56px] tracking-tighter ml-2 lg:text-4xl xl:text-5xl font-extrabold">
            Coursewave!
          </span>
        </h1>
        <p className="pt-4 text-[1rem] text-[#333333] dark:text-gray-200 text-center">
          Unlock Your Infinte Learning and Professional Potential with our wide
          range of courses on different aspects.{" "}
          {/* <span className="text-blue-600">Coursewave!</span> */}
        </p>
      </div>

      {/* Browse Course Button */}
      {/* <button className="group flex items-center gap-2 bg-blue-500 hover:bg-blue-600  text-white px-4 py-2 rounded-full mt-4 transition-all duration-300 tracking-tight font-extrabold"> */}
      <button className="group flex items-center gap-2 hover:bg-gradient-to-r hover:from-blue-500  hover:to-sky-400  bg-blue-500 text-white px-4 py-2 rounded-full mt-4 transition-all duration-300 tracking-tight font-extrabold">
        Unlock Your Potential
        <IoArrowForwardCircle className="hidden text-white group-hover:flex group-hover:animate-pulse group-hover:anim transition-all duration-300" />

      </button>

      {/* scroll to bottom animation */}
      <div>
        {/* arrow to display in light mode */}
        <svg
          className="visible dark:hidden absolute animate-bounce h-24 w-5 bg-red pt-12"
          viewBox="0 0 16 132"
          fill="black"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.29289 131.707C7.68341 132.098 8.31658 132.098 8.7071 131.707L15.0711 125.343C15.4616 124.953 15.4616 124.319 15.0711 123.929C14.6805 123.538 14.0474 123.538 13.6568 123.929L7.99999 129.586L2.34314 123.929C1.95262 123.538 1.31945 123.538 0.928927 123.929C0.538402 124.319 0.538402 124.953 0.928927 125.343L7.29289 131.707ZM7 -4.37114e-08L6.99999 131L8.99999 131L9 4.37114e-08L7 -4.37114e-08Z"
            fillRule="evenodd"
            fill="black"
          />
        </svg>

        {/* lottie to display in dark mode */}
        <Lottie
          className="hidden text-zinc-950 dark:flex"
          animationData={scrollAnimation}
          loop={true}
        />
      </div>
    </div>
  );
}

export default HeroSection;