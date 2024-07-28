"use client"; // required for lottie-react because it use (useState) internally

import React from "react";
import Lottie from "lottie-react";
import Image from "next/image";
import { PiInfinityBold } from "react-icons/pi";
import { IoArrowForwardCircle } from "react-icons/io5";
import BoxReveal from "../magicui/box-reveal";
import ShimmerButton from "../magicui/shimmer-button";
import RetroGrid from "../magicui/retro-grid";

const HeroSection = ({ scrollAnimation }: any) => {
  const largeScreenLayout = (
    <div className="h-screen w-screen pt-15 relative flex flex-col place-items-center -z-1">
      {/* bold and sub texts */}
      <div className="max-w-3xl w-full mx-auto">
        <div className="flex justify-center items-center mx-auto pt-16 align-middle text-center">
          <BoxReveal boxColor={"#5046e6"} duration={0.5}>
            <h1 className=" text-[48px] text-zinc-950 dark:text-white tracking-tighter md:text-[52px] text-center leading-10 font-extrabold ">
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
          </BoxReveal>
        </div>

        <div className="flex justify-center items-center mx-auto pt-4 text-center">
          <BoxReveal boxColor={"#5046e6"} duration={0.5}>
            <p className="pt-4 text-[1rem] text-[#333333] dark:text-gray-200 text-center">
              Unlock Your Infinte Learning and Professional Potential with our
              wide range of courses on different aspects.
            </p>
          </BoxReveal>
        </div>
      </div>

      {/* Browse Course Button */}
      <div className="group flex items-center gap-2 mt-4 transition-all duration-300">
        <BoxReveal>
          <ShimmerButton className="mt-4 p-0 bg-transparent" color="blue">
            <button className="group flex items-center gap-2 hover:bg-gradient-to-r hover:from-blue-500  hover:to-sky-400  bg-transparent text-white px-4 py-2 rounded-full  transition-all duration-300 tracking-tight font-semibold">
              Unlock Your Potential
              <IoArrowForwardCircle className="hidden text-white group-hover:flex group-hover:animate-pulse group-hover:anim transition-all duration-300" />
            </button>
          </ShimmerButton>
        </BoxReveal>
      </div>

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

      <RetroGrid />
    </div>
  );

  const mobileScreenLayout = (
    <div className="h-screen pt-15 relative flex flex-col place-items-center -z-1">
      <div className="w-full">
        <h1 className="pt-16 text-[48px] text-zinc-950 dark:text-white tracking-tight leading-10 font-extrabold align-middle text-center font-serif">
          Unlock Your Infinite Learning Potential with
          <p className="text-blue-500 tracking-tighter">Coursewave!</p>{" "}
          {/* <PiInfinityBold
            size={48}
            className="flex justify-center items-center text-blue-500 mx-auto"
          />
          <div className="flex leading-10 space-x-2 mx-auto">
            Potential with
            <p className="text-blue-500 tracking-tighter">
              Coursewave!
            </p>
          </div> */}
        </h1>

        {/* description text */}
        <p className="pt-4 text-[1rem] text-[#333333] dark:text-gray-200 text-center">
          Unlock Your Infinte Learning and Professional Potential with our wide
          range of courses on different aspects.
        </p>
      </div>

      {/* Browse Course Button */}
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

  return (
    <div className="flex justify-center items-center mx-auto">
      <div className="hidden md:flex">{largeScreenLayout}</div>
      <div className="flex md:hidden">{mobileScreenLayout}</div>
    </div>
  );
};

export default HeroSection;
