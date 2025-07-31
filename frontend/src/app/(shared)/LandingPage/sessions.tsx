import React from "react";
import Image from "next/image";
import { BsFillArrowRightCircleFill } from "react-icons/bs";

function SessionsSection() {
  return (
    <div className="mb-12 h-screen w-full max-w-7xl">
      <div>
        <p className="text-center text-2xl font-bold tracking-tight text-[#333333] dark:text-white">
          Upcomming Sessions
        </p>
        <p className="pt-4 text-center text-[1rem] text-[#333333] dark:text-white">
          Stay with us we will be back with more interesting and <br /> helpful
          sessions on <span className="text-blue-500">Trendy Tech!</span>
        </p>
      </div>

      <div className="relative mx-auto mb-16 grid h-auto w-full grid-cols-2 place-items-center justify-center gap-3 pt-12 lg:flex lg:grid-cols-4 lg:gap-4">
        <Image
          className="relative mx-3 mb-3 h-40 rounded-lg bg-blue-300 hover:cursor-pointer lg:mb-0"
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
          className="relative mx-3 mb-3 h-40 rounded-lg bg-blue-300 hover:cursor-pointer lg:mb-0"
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
          className="relative mx-3 mb-3 h-40 rounded-lg bg-blue-300 hover:cursor-pointer lg:mb-0"
          src="/nextjs.png"
          alt="Next.js Logo"
          width={200}
          height={40}
          style={{
            objectFit: "cover",
          }}
          priority
        />
        <div className="h-40 w-auto cursor-pointer place-items-center justify-center rounded-lg border border-dashed bg-blue-100 text-blue-500 hover:border-blue-500 hover:bg-blue-500 hover:text-white lg:mx-3">
          <a className="mx-auto flex flex-col items-center justify-center pl-12 pr-12 pt-16 align-middle lg:flex-row">
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
