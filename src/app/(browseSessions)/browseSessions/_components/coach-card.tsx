import React from "react";
import Image from "next/image";
import { IoMdAddCircleOutline } from "react-icons/io";
import Link from "next/link";

export const CoachCard = ({ image, name, profession, about }: any) => {
  return (
    <div className="max-h-[25rem] h-auto hover:shadow-lg bg-white dark:bg-zinc-900 w-[15rem] rounded-xl border border-stoke hover:border-blue-700 transition-all duration-100">
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

      <div className="flex flex-col p-3 space-y-4">
        <div className="text-center justify-center items-center">
          <p className="text-md text-base font-semibold line-clamp-2 text-zinc-800 dark:text-gray-100 tracking-tight">
            {name}
          </p>
          <p className="text-xs text-center text-zinc-700 dark:text-gray-400">
            {profession}
          </p>
        </div>

        <p className="text-sm text-center line-clamp-3 text-ellipsis">{about}</p>

        <Link
          href={``}
          className="flex hover:bg-blue-700 bg-blue-500 justify-center items-center rounded-[6px] px-4 py-2"
        >
          <IoMdAddCircleOutline className="text-white" />
          <p className="text-xs cursor-pointer text-white px-2 py-1">
            Book a Session
          </p>
        </Link>
      </div>
    </div>
  );
};
