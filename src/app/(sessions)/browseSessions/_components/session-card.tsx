import React from "react";
import Image from "next/image";
import AvatarCircles from "@/components/magicui/avatar-circles";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const SessionCard = ({
  sessionId,
  sessionName,
  sessionImage,
  instructor,
  price,
  currency,
  dateAndTime,
  isBooked,
  isLive,
}: any) => {
  const avatarUrls = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_s8bqkElCOr8R2XL0I4LmiLQexffc-LMRjOaTCAj8ml1UxCXAohpoQ1soZ-GzyQx74l4&usqp=CAU",
    "https://i.pinimg.com/originals/c6/9d/d2/c69dd2fd36d5797c9472c738ddce44de.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScODbPIbdc7AAY2QzQApgWsCzbJ3saUiN-Nm5unofg_beDzFe350o0vHNApy9e17rjXPE&usqp=CAU",
  ];

  return (
    <div className="max-h-[25rem] h-full cursor-pointer hover:shadow-lg bg-white dark:bg-zinc-900 border hover:border-blue-700 border-stoke transition-all duration-100 w-[15rem] rounded-xl space-y-4">
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

      <div className="p-4 space-y-2">
        <div className="flex flex-col space-y-2">
          <div>
            <p className="text-xs tracking-tight dark:text-gray-400">
              {dateAndTime ?? "16 Feb 2024, 01:29 PM"}
            </p>

            <span className="text-md text-base font-semibold line-clamp-2 text-zinc-900 dark:text-white tracking-tight">
              {sessionName}
            </span>

            <div className="flex items-center space-x-1">
              <p className="text-xs dark:text-gray-400">By</p>
              <p className="text-xs hover:underline text-blue-500 dark:text-blue-700 tracking-tight font-semibold">
                {instructor}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <AvatarCircles numPeople={200} avatarUrls={avatarUrls!} />
            <p className="text-xs dark:text-gray-400">Already enrolled </p>
          </div>
        </div>

        {isBooked ? (
          isLive ? (
            <Link
              href={`/sessions/${sessionId}`}
              className="px-4 py-3 flex justify-center items-center text-sm text-white bg-blue-500 rounded-[6px] cursor-pointer hover:bg-blue-700 transition-all duration-100 font-bold"
            >
              Join Now
            </Link>
          ) : (
            <Button
              className="px-4 py-3 flex justify-center items-center text-sm text-white bg-blue-500 rounded-[6px] cursor-not-allowed opacity-50 w-full"
              disabled
              color="blue"
            >
              <div className="flex flex-col justify-center items-center align-middle text-center py-1">
                <p className="tracking-tight">Session Booked</p>
                <p className="text-[10px] text-center text-zinc-300 font-thin">
                  Starts on {dateAndTime.split(",")[1]}
                </p>
              </div>
            </Button>
          )
        ) : (
          <Link
            href={`/sessions/${sessionId}`}
            className="px-4 py-3 flex justify-center items-center text-sm tracking-tight text-white bg-blue-500 rounded-[6px] cursor-pointer hover:bg-blue-700 transition-all duration-100 font-bold"
          >
            {price > 0 ? `$ ${price}` : "Free"}
          </Link>
        )}
      </div>
    </div>
  );
};
