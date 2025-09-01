"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Course } from "@/types";
import React from "react";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { IoMdTrendingUp } from "react-icons/io";

// interface TotalRevenueCardProps {
//   totalEarning: string;
//   courses: Course[];
// }

// export default function TotalRevenueCard({ totalEarning, courses }: TotalRevenueCardProps) {

//   const recentEarnings = courses.slice(0, 4).map(course => ({
//     date: new Date(course.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }),
//     amount: parseFloat(course.price.toString()) || 0
//   }));

//   return (
//     <div className="border-stroke w-[22rem] items-center justify-start overflow-hidden rounded-lg border dark:bg-zinc-800">
//       <div className="flex justify-between px-4 pt-4">
//         <div>
//           <p className="text-base font-medium tracking-tight text-zinc-800 dark:text-white">
//             Total Revenue
//           </p>
//           <p className="text-xs text-zinc-600 dark:text-zinc-400">Lifetime</p>
//         </div>

//         {/* <p className='px-2 text-xs flex justify-center items-center text-center border border-zinc-200 rounded-md'>All courses</p> */}
//       </div>

//       {/* <DateRangePickerSpanish /> */}

//       <div className="mb-4 flex justify-between p-4">
//         {recentEarnings.map((earning, index) => (
//           <div className="py-auto items-center pr-3" key={index}>
//             <p className="text-sm tracking-tight dark:text-zinc-200">{earning.date}</p>
//             <p className="text-sm dark:text-zinc-50">${earning.amount.toFixed(2)}</p>
//           </div>
//         ))}
//       </div>

//       <div className="h-18 flex w-full items-center justify-between rounded-b-lg bg-zinc-50 p-4 dark:bg-zinc-900">
//         <div>
//           <p className="text-sm dark:text-zinc-300">Available</p>
//           <p className="text-md font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
//             ${parseFloat(totalEarning).toFixed(2)}
//           </p>
//         </div>

//         <div className="flex cursor-pointer justify-center rounded-lg border-none bg-blue-500 p-3 text-xs font-medium tracking-tight text-white outline-none hover:bg-blue-700">
//           <AiOutlineDollarCircle size={18} />{" "}
//           <span className="ml-1 text-sm">Withdraw</span>
//         </div>
//       </div>
//     </div>
//   );
// }

interface TotalRevenueCardProps {
  totalEarning: string;
  courses: Course[];
}

export const TotalRevenueCard: React.FC<TotalRevenueCardProps> = ({
  totalEarning,
  courses,
}) => {
  const recentEarnings = courses.slice(0, 4).map((course) => ({
    date: new Date(course.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    amount: parseFloat(course.price.toString()) || 0,
  }));

  const totalRevenue = parseFloat(totalEarning) || 0;
  const previousRevenue = totalRevenue * 0.85; // Mock previous period
  const growthRate = (
    ((totalRevenue - previousRevenue) / previousRevenue) *
    100
  ).toFixed(1);

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-200  dark:border-zinc-700 bg-white shadow-sm transition-all hover:shadow-md dark:bg-zinc-800">
      {/* Header */}
      <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Total Revenue
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Lifetime earnings
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <IoMdTrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              +{growthRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Recent Earnings Timeline */}
      <div className="p-6">
        <ScrollArea className="w-full">
          <div className="flex space-x-6">
            {recentEarnings.map((earning, index) => (
              <div key={index} className="flex-shrink-0 text-center">
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  {earning.date}
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  ${earning.amount.toFixed(0)}
                </p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Total and CTA */}
      <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Available Balance
            </p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
          <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <AiOutlineDollarCircle className="h-4 w-4" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>
    </div>
  );
};
