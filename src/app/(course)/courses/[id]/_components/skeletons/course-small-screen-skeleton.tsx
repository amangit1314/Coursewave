"use client";

import React, { useEffect } from "react";
import { FaAngleRight, FaCircleCheck, FaStar } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";

export const CourseSmallScreenSkeleton = () => {
  return (
    <div className="space-y-4 min-h-screen min-w-screen py-8">
      <Skeleton className="h-[220px] w-full rounded-2xl" />
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
    </div>
  );
};
