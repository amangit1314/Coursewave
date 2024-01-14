import React from "react";
import Image from "next/image";
import { BsFillArrowRightCircleFill } from "react-icons/bs";

function SessionsSection() {
  return (
    <div className="h-screen mb-12 max-w-7xl w-full">
      <div>
        <p className="text-2xl font-bold tracking-tight text-center text-[#333333] dark:text-white ">
          Upcomming Sessions
        </p>
        <p className="pt-4 text-[1rem] text-[#333333] dark:text-white text-center">
          Stay with us we will be back with more interesting and <br /> helpful
          sessions on <span className="text-blue-500">Trendy Tech!</span>
        </p>
      </div>

      <div className="w-full h-auto pt-12 mb-16 relative lg:flex justify-center mx-auto grid grid-cols-2 gap-3 lg:gap-4 place-items-center lg:grid-cols-4 ">
        <Image
          className="mb-3 lg:mb-0 mx-3 h-40 hover:cursor-pointer bg-blue-300 rounded-lg relative "
          src="/web3.png"
          alt="Next.js Logo"
          width={200}
          height={40}
          style={{
            objectFit: "cover",
          }}
          priority
        />
        <Image
          className="mb-3 lg:mb-0 mx-3 h-40 hover:cursor-pointer bg-blue-300 rounded-lg relative "
          src="/android-jetpack.png"
          alt="Next.js Logo"
          width={200}
          height={40}
          style={{
            objectFit: "cover",
          }}
          priority
        />
        <Image
          className="mb-3 lg:mb-0 mx-3 hover:cursor-pointer h-40 bg-blue-300 rounded-lg relative "
          src="/nextjs.png"
          alt="Next.js Logo"
          width={200}
          height={40}
          style={{
            objectFit: "cover",
          }}
          priority
        />
        <div className="h-40 w-auto  bg-blue-100 cursor-pointer lg:mx-3 hover:text-white text-blue-500 rounded-lg border border-dashed justify-center place-items-center hover:border-blue-500 hover:bg-blue-500">
          <a className="pl-12 flex flex-col lg:flex-row justify-center items-center align-middle mx-auto pt-16 pr-12 ">
            <BsFillArrowRightCircleFill size={20} />
            <div className="pl-1"></div>
            See All
          </a>
        </div>
      </div>
    </div>
  );
}

export default SessionsSection;
