"use client";

import React from "react";
import { AiOutlineDollarCircle } from "react-icons/ai";

export default function TotalRevenueCard() {
  return (
    <div className="border-stroke w-[22rem] items-center justify-start overflow-hidden rounded-lg border dark:bg-zinc-800">
      <div className="flex justify-between px-4 pt-4">
        <div>
          <p className="text-base font-medium tracking-tight text-zinc-800 dark:text-white">
            Total Revenue
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">This month</p>
        </div>

        {/* <p className='px-2 text-xs flex justify-center items-center text-center border border-zinc-200 rounded-md'>All courses</p> */}
      </div>

      {/* <DateRangePickerSpanish /> */}

      <div className="mb-4 flex justify-between p-4">
        <div className="py-auto items-center pr-3">
          <p className="text-sm tracking-tight dark:text-zinc-200">Today</p>
          <p className="text-sm dark:text-zinc-50">$2.4</p>
        </div>

        <div className="py-auto items-center pr-3">
          <p className="text-sm tracking-tight dark:text-zinc-200">Yesterday</p>
          <p className="text-sm dark:text-zinc-50">$2.4</p>
        </div>

        <div className="py-auto items-center pr-3">
          <p className="text-sm tracking-tight dark:text-zinc-200">11-12-23</p>
          <p className="text-sm dark:text-zinc-50">$2.4</p>
        </div>

        <div className="py-auto items-center">
          <p className="text-sm tracking-tight dark:text-zinc-200">10-12-23</p>
          <p className="text-sm dark:text-zinc-50">$2.4</p>
        </div>
      </div>

      <div className="h-18 flex w-full items-center justify-between rounded-b-lg bg-zinc-50 p-4 dark:bg-zinc-900">
        <div>
          <p className="text-sm dark:text-zinc-300">Available</p>
          <p className="text-md font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            $49
          </p>
        </div>

        <div className="flex cursor-pointer justify-center rounded-lg border-none bg-blue-500 p-3 text-xs font-medium tracking-tight text-white outline-none hover:bg-blue-700">
          <AiOutlineDollarCircle size={18} />{" "}
          <span className="ml-1 text-sm">Withdraw</span>
        </div>
      </div>
    </div>
  );
}
