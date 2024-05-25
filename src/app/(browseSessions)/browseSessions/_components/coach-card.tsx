import React from "react";
import Image from "next/image";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Button } from "@/components/ui/button";

export const CoachCard = ({image, name, profession, about }: any) => {
  return (
    <div className="max-h-[25rem] h-auto mt-2 shadow-md bg-white dark:bg-zinc-900 w-[15rem] rounded-2xl  mb-8 dark:hover:border dark:hover:border-blue-500 hover:border-stoke transition-all duration-300">
      <Image
        className="h-36 w-[15rem] bg-slate-700 rounded-tl-xl rounded-tr-xl relative"
        src={image}
        alt="Next.js Logo"
        width={256}
        height={145}
        style={{
          objectFit: "cover",
        }}
        unoptimized
      />
      <div className="flex flex-col pt-3 px-3">
        <div className="text-center justify-center items-center">
          <span className="text-md mt-[10px] font-semibold line-clamp-2 text-zinc-800 dark:text-gray-100">
            {name }
          </span>
          <p className="text-xs text-center pb-3 text-zinc-700 dark:text-gray-400 ml-2">
            {profession }
          </p>
        </div>

        <p className="text-xs text-center text-zinc-700 dark:text-gray-400">
          {about }
        </p>

        <Button className="flex hover:bg-blue-700 bg-blue-500 justify-center my-3">
          <IoMdAddCircleOutline style={{ color: "white" }} />
          <p className="p-2 text-xs font-bold cursor-pointer dark:text-slate-300">
            Book a Session
          </p>
        </Button>
      </div>
    </div>
  );
}
