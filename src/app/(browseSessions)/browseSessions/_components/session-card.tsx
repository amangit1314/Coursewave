import React from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge';

export function SessionCard({sessionName, sessionImage, instructor}: any) {
    return (
      <div className="max-h-[20rem] h-full cursor-pointer shadow-md bg-white dark:bg-zinc-900 dark:hover:border dark:hover:border-blue-500 hover:border-stoke transition-all duration-300 w-[15rem] rounded-xl ">
        <Image
          className="h-36 w-[15rem] bg-slate-700 rounded-tl-xl rounded-tr-xl relative"
          src={sessionImage}
          alt="Next.js Logo"
          width={256}
          height={145}
          style={{
            objectFit: "cover",
          }}
          unoptimized
        />

        <div className="flex flex-col pt-4 px-3">
          <p className="text-xs tracking-tight opacity-50">16 Feb 01: 29PM</p>

          <span className="text-md font-bold tracking-tight text-black dark:text-gray-100 line-clamp-2">
            {sessionName}
          </span>

          <div className="flex px-1 space-x-1 items-center my-4 ">
            <div className="relative flex items-center">
              <div className="h-7 w-7 bg-indigo-500 rounded-full flex items-center justify-center absolute -left-1 z-10">
                <Image
                  src="/assets/images/images1.jpg"
                  alt="Avatar 1"
                  className="h-5 w-5 rounded-full"
                  fill={true}
                />
              </div>
              <div className="h-7 w-7 bg-green-500 rounded-full flex items-center justify-center absolute left-3 z-20">
                <Image
                  src="/assets/images/images2.jpg"
                  alt="Avatar 2"
                  className="h-5 w-5 rounded-full"
                  fill={true}
                />
              </div>
              <div className="h-7 w-7 bg-red-500 rounded-full flex items-center justify-center absolute left-7 z-30">
                <Image
                  src="/assets/images/images3.jpg"
                  alt="Avatar 3"
                  className="h-5 w-5 rounded-full"
                  fill={true}
                />
              </div>
            </div>
            <p className="font-semibold pl-14 text-xs text-blue-500">200+</p>
            <p className="text-xs">Already enrolled </p>
          </div>
        </div>

        <div className="flex justify-between items-center pl-3">
          <div className="flex items-center ">
            <p className="text-xs text-gray-700 dark:text-gray-400">By</p>
            <p className="text-xs hover:underline text-blue-500 font-semibold dark:text-gray-100 ml-[3px]">
              {instructor}
            </p>
          </div>

          <div className="text-xs p-2 bg-blue-500 rounded-tl-xl rounded-br-xl font-semibold tracking-tight text-gray-200 hover:text-white cursor-pointer dark:text-slate-300 dark:hover:text-white">
            Join Now
          </div>
        </div>
      </div>
    );
}