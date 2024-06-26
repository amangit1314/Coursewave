import React from "react";
import CardDataStats from "@/components/CardDataStats";
import { AiOutlineSolution } from "react-icons/ai";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GrInProgress } from "react-icons/gr";
import { TiTick } from "react-icons/ti";
import { CgTimelapse } from "react-icons/cg";

type AnalyticsStats = {
  totalEnrolledCourses: number;
  totalCompletedCourses: number;
  totalOngoingCourses: number;
};

export default function UserDashboardStats({
  totalEnrolledCourses,
  totalCompletedCourses,
  totalOngoingCourses,
}: AnalyticsStats) {
  return (
    <ScrollArea className="w-full rounded-lg overflow-hidden">
      <div className="grid grid-cols-4 gap-4">
        <div className="w-full">
          <CardDataStats
            title="Total Time Spent"
            total={`${totalEnrolledCourses ? totalEnrolledCourses : 0} h`}
            // rate="4.35%"
            // levelUp
          >
            {/* dark:bg-blue-500 dark:text-blue-200 */}
            <div className="p-1.5 h-[2.5rem] w-[2.5rem] flex justify-center items-center rounded-full bg-orange-200 text-orange-500  bg-opacity-30">
              <CgTimelapse size={22} />
            </div>
          </CardDataStats>
        </div>

        <div className="w-full">
          <CardDataStats
            title="Enrolled Courses"
            total={`${totalEnrolledCourses ? totalEnrolledCourses : 0}`}
            // rate="4.35%"
            // levelUp
          >
            {/* dark:bg-blue-500 dark:text-blue-200 */}
            <div className="p-1.5 h-[2.5rem] w-[2.5rem] flex justify-center items-center rounded-full bg-blue-200 text-blue-500  bg-opacity-30">
              <AiOutlineSolution size={22} />
            </div>
          </CardDataStats>
        </div>

        <div className="w-full">
          <CardDataStats
            title="Ongoing Courses"
            total={totalOngoingCourses ? totalOngoingCourses.toString() : "0"}
            // rate="2.59%"
            // levelUp
          >
            {/* dark:bg-yellow-500 dark:text-yellow-200 */}
            <div className="p-1.5 h-[2.5rem] w-[2.5rem] flex justify-center items-center rounded-full bg-yellow-200 text-yellow-500  bg-opacity-30">
              {/* <BsPersonVideo2 /> */}
              <GrInProgress />
            </div>
          </CardDataStats>
        </div>

        <div className="w-full">
          <CardDataStats
            title="Completed Courses"
            total={
              totalCompletedCourses ? totalCompletedCourses.toString() : "0"
            }
            // rate="0.95%"
            // levelDown
          >
            {/* dark:bg-green-500 dark:text-green-200 */}
            <div className="p-1.5 h-[2.5rem] w-[2.5rem] flex justify-center items-center rounded-full bg-green-200 text-green-500  bg-opacity-30  ">
              <TiTick size={22} />
            </div>
          </CardDataStats>
        </div>
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
