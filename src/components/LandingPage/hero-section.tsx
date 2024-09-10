"use client"; // required for lottie-react because it use (useState) internally

import React from "react";
import Lottie from "lottie-react";
import Image from "next/image";
import { PiInfinityBold } from "react-icons/pi";
import { IoArrowForwardCircle } from "react-icons/io5";
import BoxReveal from "../magicui/box-reveal";
import ShimmerButton from "../magicui/shimmer-button";
import RetroGrid from "../magicui/retro-grid";
import { Abril_Fatface, Orbitron } from "next/font/google";

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const HeroSection = ({ scrollAnimation }: any) => {
  const largeScreenLayout = (
    <div className="pt-15 -z-1 relative flex h-screen w-screen flex-col place-items-center">
      {/* bold and sub texts */}
      <div className="mx-auto w-full max-w-3xl">
        <div className="mx-auto flex items-center justify-center pt-16 text-center align-middle">
          <BoxReveal boxColor={"#5046e6"} duration={0.5}>
            <div className={orbitron.className}>
              <h1 className="text-center text-[48px] font-extrabold leading-10 tracking-tighter text-zinc-950 dark:text-white md:text-[52px]">
                <div className="ml-16 flex">
                  Unlock Your{" "}
                  <PiInfinityBold
                    size={48}
                    className="mx-[8px] text-blue-500"
                  />
                  Learning
                </div>
                Potential with
                <span className="ml-2 text-[56px] font-extrabold tracking-tighter text-blue-500 lg:text-4xl xl:text-5xl">
                  Coursewave!
                </span>
              </h1>
            </div>
          </BoxReveal>
        </div>

        <div className="mx-auto flex items-center justify-center pt-4 text-center">
          <BoxReveal boxColor={"#5046e6"} duration={0.5}>
            <p className="pt-4 text-center text-[1rem] text-[#333333] dark:text-gray-200">
              Unlock Your Infinte Learning and Professional Potential with our
              wide range of courses on different aspects.
            </p>
          </BoxReveal>
        </div>
      </div>

      {/* Browse Course Button */}
      <div className="group mt-4 flex items-center gap-2 transition-all duration-300">
        <BoxReveal>
          <ShimmerButton className="mt-4 bg-transparent p-0" color="blue">
            <button className="group flex items-center gap-2 rounded-full bg-transparent px-4 py-2 font-semibold tracking-tight text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-sky-400">
              Unlock Your Potential
              <IoArrowForwardCircle className="group-hover:anim hidden text-white transition-all duration-300 group-hover:flex group-hover:animate-pulse" />
            </button>
          </ShimmerButton>
        </BoxReveal>
      </div>

      {/* scroll to bottom animation */}
      <div>
        {/* arrow to display in light mode */}
        <svg
          className="bg-red visible absolute h-24 w-5 animate-bounce pt-12 dark:hidden"
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
    <div className="-z-1 relative flex h-full w-screen flex-col place-items-center px-[.75rem] pt-[1.25rem]">
      {/* Heading text and description text */}
      <div className="w-full space-y-6">
        {/* main bold heading text */}
        <div className={orbitron.className}>
          <h1 className="pt-16 text-center align-middle text-4xl font-bold leading-10 text-zinc-950 dark:text-white">
            Unlock Your Infinite Learning Potential with
            <p className="text-blue-500">Coursewave!</p>{" "}
          </h1>
        </div>

        {/* description text */}
        <p className="text-center text-[1rem] text-[#333333] dark:text-gray-200">
          Unlock Your Infinte Learning and Professional Potential with our wide
          range of courses on different aspects.
        </p>
      </div>

      {/* Browse Course Button */}
      <button className="group my-4 flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 font-extrabold tracking-tight text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-sky-400">
        Unlock Your Potential
        <IoArrowForwardCircle className="group-hover:anim hidden text-white transition-all duration-300 group-hover:flex group-hover:animate-pulse" />
      </button>

      {/* scroll to bottom animation */}
      <div>
        {/* arrow to display in light mode */}
        <svg
          className="bg-red visible absolute h-24 w-5 animate-bounce pt-12 dark:hidden"
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
    <div className="mx-auto flex items-center justify-center">
      <div className="hidden md:flex">{largeScreenLayout}</div>
      <div className="flex md:hidden">{mobileScreenLayout}</div>
    </div>
  );
};

export default HeroSection;
