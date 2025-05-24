import React from "react";
import Image from "next/image";
import AvatarCircles from "@/components/magicui/avatar-circles";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Session } from "@/types/session";

interface SessionCardProps {
  session: Session;
  isBooked?: boolean;
}

export const SessionCard = ({ session, isBooked = false }: SessionCardProps) => {
  const avatarUrls = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_s8bqkElCOr8R2XL0I4LmiLQexffc-LMRjOaTCAj8ml1UxCXAohpoQ1soZ-GzyQx74l4&usqp=CAU",
    "https://i.pinimg.com/originals/c6/9d/d2/c69dd2fd36d5797c9472c738ddce44de.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScODbPIbdc7AAY2QzQApgWsCzbJ3saUiN-Nm5unofg_beDzFe350o0vHNApy9e17rjXPE&usqp=CAU",
  ];

  const isLive = session.status === 'LIVE';
  const formattedDate = new Date(session.scheduledAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="h-full w-full cursor-pointer hover:shadow-lg bg-white dark:bg-zinc-900 border hover:border-blue-700 border-stoke transition-all duration-100 rounded-xl space-y-3 sm:space-y-4">
      <div className="relative w-full aspect-[16/9]">
        <Image
          className="rounded-tl-xl rounded-tr-xl"
          src={session.imageUrl || '/assets/images/cards/default-session.png'}
          alt={session.title}
          fill
          style={{
            objectFit: "cover",
          }}
          unoptimized
        />
      </div>

      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div className="flex flex-col space-y-2">
          <div>
            <p className="text-[10px] sm:text-xs tracking-tight dark:text-gray-400">
              {formattedDate}
            </p>

            <span className="text-sm sm:text-base font-semibold line-clamp-2 text-zinc-900 dark:text-white tracking-tight">
              {session.title}
            </span>

            <div className="flex items-center space-x-1">
              <p className="text-[10px] sm:text-xs dark:text-gray-400">By</p>
              <p className="text-[10px] sm:text-xs hover:underline text-blue-500 dark:text-blue-700 tracking-tight font-semibold">
                {session.instructor.user.name}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <AvatarCircles numPeople={session._count.bookings} avatarUrls={avatarUrls!} />
            <p className="text-[10px] sm:text-xs dark:text-gray-400">Already enrolled </p>
          </div>
        </div>

        {isBooked ? (
          isLive ? (
            <Link
              href={`/sessions/${session.id}`}
              className="px-3 py-2 sm:px-4 sm:py-3 flex justify-center items-center text-xs sm:text-sm text-white bg-blue-500 rounded-[6px] cursor-pointer hover:bg-blue-700 transition-all duration-100 font-bold"
            >
              Join Now
            </Link>
          ) : (
            <Button
              className="px-3 py-2 sm:px-4 sm:py-3 flex justify-center items-center text-xs sm:text-sm text-white bg-blue-500 rounded-[6px] cursor-not-allowed opacity-50 w-full"
              disabled
              color="blue"
            >
              <div className="flex flex-col justify-center items-center align-middle text-center py-1">
                <p className="tracking-tight">Session Booked</p>
                <p className="text-[8px] sm:text-[10px] text-center text-zinc-300 font-thin">
                  Starts on {formattedDate.split(',')[1]}
                </p>
              </div>
            </Button>
          )
        ) : (
          <Link
            href={`/sessions/${session.id}`}
            className="px-3 py-2 sm:px-4 sm:py-3 flex justify-center items-center text-xs sm:text-sm tracking-tight text-white bg-blue-500 rounded-[6px] cursor-pointer hover:bg-blue-700 transition-all duration-100 font-bold"
          >
            {session.isFree ? "Free" : `${session.currency} ${session.price}`}
          </Link>
        )}
      </div>
    </div>
  );
};
