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
  rating
}) => {
  return (
    <div className=" md:max-h-[13rem] md:h-auto w-auto md:max-w-[25rem] dark:bg-zinc-900 bg-opacity-50 rounded-2xl  hover:shadow-sm cursor-pointer hover:border hover:border-stroke   backdrop-filter-blur backdrop-blur-xl space-y-3 dark:hover:border-white   ">
      {/* comment */}
      <p className=" text-base text-md px-4 pt-4 text-zinc-800 dark:text-zinc-200  line-clamp-5 ">
        “{comment}”
      </p>

      {/* user info and rating */}
      <div className=" flex flex-col px-4 pb-4 md:flex-row justify-start flex-shrink-0 w-auto transition-all duration-200 rounded-lg cursor-pointer align-center items-center md:items-start backdrop-filter-blur ">
        <Image
          className="items-center bg-white rounded-full w-12 h-12"
          src={imgUrl}
          alt={name}
          height={12}
          width={12}
          unoptimized
        />
        <div className="w-full ml-1 px-2 pt-1 md:pt-0 my-1 md:my-0 flex flex-col">
          <div className="flex justify-between items-center py-auto rating">
            <p className="text-sm md:mt-0 font-medium text-zinc-800 dark:text-white">
              {name}
            </p>
            <div className="flex items-center justify-end space-x-1">
              <p className="text-md font-semibold tracking-tight text-zinc-800 dark:text-white">
               {rating.toFixed(1) ?? 4.8}
              </p>
              <FaStar className="text-yellow-500" size={14} />
            </div>
          </div>

          <p className=" text-xs text-zinc-600 dark:text-zinc-400">
            {courseName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialItem;
