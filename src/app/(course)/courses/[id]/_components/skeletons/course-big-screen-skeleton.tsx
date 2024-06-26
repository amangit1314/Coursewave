"use clinet";

import { Skeleton } from "@/components/ui/skeleton";
import { FaAngleRight, FaStar } from "react-icons/fa6";

export const CourseBigScreenSkeleton = () => {
  return (
    <div className=" min-h-screen min-w-screen flex justify-center items-center py-8">
      <div className="grid grid-cols-3 justify-between space-x-8 items-start min-h-screen h-full border border-stroke rounded-3xl p-4">
        {/* left */}
        <div className="h-full col-span-2 w-full space-y-8">
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-[100px] rounded-full" />
            <FaAngleRight />
            <Skeleton className="h-4 w-[100px] rounded-full" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-[300px] rounded-md" />
            </div>

            <div className="flex space-x-2 justify-start items-center">
              <FaStar className="text-yellow-500" />
              <Skeleton className="h-4 w-[100px] rounded-full" />
              <Skeleton className="h-4 w-[230px] rounded-full" />
              <Skeleton className="h-4 w-[150px] rounded-md" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-[260px] rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 mt-2 w-full rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-[320px] rounded-full" />
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div>
              <Skeleton className="h-6 w-40  rounded-md" />
            </div>

            <div className="space-y-2">
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-[260px] rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 mt-2 w-full rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-[320px] rounded-full" />
            </div>
          </div>
        </div>

        {/* right */}
        <div className="h-full col-span-1 space-y-2 max-w-[22rem] w-full rounded-3xl border border-stroke p-4 ">
          <Skeleton className="h-[220px] w-full rounded-2xl" />
          <div className="flex justify-start items-center space-x-2">
            <span className="text-blue-500 font-bold">$</span>
            <Skeleton className="h-4 w-12 rounded-md" />{" "}
            <Skeleton className="h-4 w-40 rounded-full" />
          </div>

          <Skeleton className="h-10 w-full rounded-md" />

          <div className="space-y-8">
            <div className="flex justify-center items-center mx-auto">
              <Skeleton className="h-4 w-40 rounded-full" />
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <Skeleton className="h-6 w-40 rounded-md" />
              </div>

              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-4 mx-auto">
              <Skeleton className="h-4 w-40 rounded-full" />
              <Skeleton className="h-4 w-40 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
