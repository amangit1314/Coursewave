/* eslint-disable @next/next/no-img-element */
import { Badge } from "@tremor/react";
import React from "react";
import { FaStar } from "react-icons/fa6";

type ReviewProps = {
  authorName: string;
  authorImgUrl: string;
  date: string;
  review: JSX.Element | string;
  starRating: number;
};

const Reviewcard = ({
  authorName,
  date,
  authorImgUrl,
  review,
  starRating,
}: ReviewProps) => {
  return (
    <div className="flex-col hover:border hover:z-50 hover:shadow-xl items-center p-3 rounded-xl cursor-pointer max-w-1/3 w-full h-auto align-center dark:bg-slate-800 bg-slate-50 dark:bg-opacity-80 bg-clip-padding backdrop-filter-blur transition-all duration-300">
      <blockquote className="mb-2">
        <p className="text-sm text-start tracking-normal w-full text-gray-800 dark:text-slate-200 line-clamp-6">
          {/* “{review}” */}
          {review}
        </p>
      </blockquote>
      <div className="flex justify-between items-center mt-3 w-xs">
        {/* <img className="rounded-full w-14 h-14" src={imgUrl} alt={name} /> */}
        <div className="flex justify-start items-center">
          <img
            className="w-10 h-10 rounded-full "
            src={authorImgUrl}
            alt={authorName}
          />

          <figcaption className="ml-2 ">
            {/*  */}
            <div className=" tracking-tight text-gray-800 font-semibold text-sm dark:text-slate-100">
              {authorName}
            </div>
            <div className="text-[#333333] text-xs tracking-tight dark:text-slate-300 line-clamp-2">
              {date}
            </div>
          </figcaption>
        </div>

        <div className="flex flex-row justify-center item-center rounded-badge text-xs px-2 py-1 space-x-1 border border-stroke bg-zinc-900 text-white dark:bg-black dark:border dark:border-stroke">
          <p>{starRating ? starRating : 4.0}</p>
          <FaStar className="text-yellow-400" />
        </div>
      </div>
    </div>
  );
};

export default Reviewcard;
