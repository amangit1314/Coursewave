import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa6";

interface TestimonialItemProps {
  name: string;
  courseName: string;
  imgUrl: string;
  comment: string;
  rating: number;
}

const TestimonialItem: React.FC<TestimonialItemProps> = ({
  name,
  courseName,
  imgUrl,
  comment,
  rating,
}) => {
  return (
    <div className="hover:border-stroke backdrop-filter-blur w-auto cursor-pointer space-y-3 rounded-2xl bg-opacity-50 backdrop-blur-xl hover:border hover:shadow-sm dark:bg-zinc-900 dark:hover:border-white md:h-auto md:max-h-[13rem] md:max-w-[25rem]">
      {/* comment */}
      <p className="text-md line-clamp-5 px-4 pt-4 text-base text-zinc-800 dark:text-zinc-200">
        “{comment}”
      </p>

      {/* user info and rating */}
      <div className="align-center backdrop-filter-blur flex w-auto flex-shrink-0 cursor-pointer flex-col items-center justify-start rounded-lg px-4 pb-4 transition-all duration-200 md:flex-row md:items-start">
        <Image
          className="h-12 w-12 items-center rounded-full bg-white"
          src={imgUrl}
          alt={name}
          height={12}
          width={12}
          unoptimized
        />
        <div className="my-1 ml-1 flex w-full flex-col px-2 pt-1 md:my-0 md:pt-0">
          <div className="py-auto rating flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-800 dark:text-white md:mt-0">
              {name}
            </p>
            <div className="flex items-center justify-end space-x-1">
              <p className="text-md font-semibold tracking-tight text-zinc-800 dark:text-white">
                {rating.toFixed(1) ?? 4.8}
              </p>
              <FaStar className="text-yellow-500" size={14} />
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            {courseName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialItem;
