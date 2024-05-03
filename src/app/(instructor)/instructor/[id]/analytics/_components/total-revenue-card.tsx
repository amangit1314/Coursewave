"use client";

import React from "react";
import { AiOutlineDollarCircle } from "react-icons/ai";

export default function TotalRevenueCard() {
  return (
    <div className="w-[22rem] dark:bg-zinc-800  border border-stroke  rounded-lg justify-start items-center overflow-hidden">
      <div className="flex justify-between px-4 pt-4">
        <div>
          <p className="text-base tracking-tight font-medium text-zinc-800 dark:text-white ">
            Total Revenue
          </p>
          <p className="text-xs dark:text-zinc-400 text-zinc-600">This month</p>
        </div>

        {/* <p className='px-2 text-xs flex justify-center items-center text-center border border-zinc-200 rounded-md'>All courses</p> */}
      </div>

      {/* <DateRangePickerSpanish /> */}

      <div className="flex mb-4 justify-between p-4 ">
        <div className="items-center py-auto pr-3">
          <p className="text-sm tracking-tight dark:text-zinc-200">Today</p>
          <p className="text-sm dark:text-zinc-50">$2.4</p>
        </div>

        <div className="items-center py-auto pr-3">
          <p className="text-sm tracking-tight dark:text-zinc-200">Yesterday</p>
          <p className="text-sm dark:text-zinc-50">$2.4</p>
        </div>

        <div className="items-center py-auto pr-3">
          <p className="text-sm tracking-tight dark:text-zinc-200">11-12-23</p>
          <p className="text-sm dark:text-zinc-50">$2.4</p>
        </div>

        <div className="items-center py-auto">
          <p className="text-sm tracking-tight dark:text-zinc-200">10-12-23</p>
          <p className="text-sm dark:text-zinc-50">$2.4</p>
        </div>
      </div>

      <div className="h-18 flex items-center justify-between w-full rounded-b-lg bg-zinc-50 dark:bg-zinc-900 p-4">
        <div>
          <p className="text-sm dark:text-zinc-300">Available</p>
          <p className="text-md font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            $49
          </p>
        </div>

        <div className="p-3 cursor-pointer hover:bg-blue-700 rounded-lg flex justify-center outline-none bg-blue-500 text-white text-xs border-none tracking-tight font-medium">
          <AiOutlineDollarCircle size={18} />{" "}
          <span className="ml-1 text-sm">Withdraw</span>
        </div>
      </div>
    </div>
  );
}
