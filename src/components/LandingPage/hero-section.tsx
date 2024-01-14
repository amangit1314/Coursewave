'use client'; // required for lottie-react because it use (useState) internally

import React from "react";
import Lottie from "lottie-react";
import Image from 'next/image';

const HeroSection = ({scrollAnimation}: any) => {
  return (
    <div className="h-screen pt-15 relative flex flex-col place-items-center -z-1">
      <Image
        className="relative"
        src="/women-with-laptop.png"
        alt="Hero Image"
        width={200}
        height={45}
        priority
      />
      <div>
        <h1 className="pt-8 text-[4rem] text-[#333333] dark:text-white tracking-tight lg:text-4xl xl:tex-5xl font-bold text-center">
          Unlock Your Learning Potential with <br />
          <span className="text-blue-500">Coursewave!</span>
        </h1>
        <p className="pt-4 text-[1rem] text-[#333333] dark:text-gray-200 text-center">
          Unlock Your Infinte Learning and Professional Protential with <br />{" "}
          wide range of courses of{" "}
          <span className="text-blue-600">Coursewave!</span>
        </p>
      </div>

      {/* Browse Course Button */}
      <button className="bg-blue-500 hover:bg-blue-600 font-semibold tracking-tight text-white px-4 py-2 rounded-xl mt-8">
        Browse Courses
      </button>

      {/* scroll to bottom animation */}
      <div>
        {/* arrow to display in light mode */}
        <svg
          className="visible dark:hidden bottom-10 lg:bottom-20 absolute animate-bounce h-24 w-5 bg-red pb-8"
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
          className="dark:visible"
          animationData={scrollAnimation}
          loop={true}
        />
      </div>
    </div>
  );
}

export default HeroSection;