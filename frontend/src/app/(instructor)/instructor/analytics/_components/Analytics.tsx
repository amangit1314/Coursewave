"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import AnalyticsStatsSelect from "./AnalyticsStatsSelect";
import AnalyticsStats from "./AnalyticsStats";
import { BestSellingCourses } from "./BestSellingCourses";
import { EarningReportAreaChart, EarningChartData } from "./EarningReportChart";
import { LineChartForStudents } from "./LineChatForStudents";
import { TotalRevenueCard } from "./TotalRevenueCard";
import { Course } from "@/types/course";
import { useMemo } from "react";
import { sampleCourses } from "@/lib/mock/mockData";

type AnalyticsProps = {
  totalEarning: string;
  totalStudents: number;
  totalCourses: number;
  createdCourses?: Course[];
};

const Analytics = ({
  totalEarning,
  totalStudents,
  totalCourses,
  createdCourses,
}: AnalyticsProps) => {
  const earningChartData = useMemo((): EarningChartData[] => {
    if (!createdCourses) return [];

    const monthlyEarnings: { [key: string]: number } = {};

    createdCourses.forEach((course) => {
      const month = new Date(course.createdAt).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (!monthlyEarnings[month]) {
        monthlyEarnings[month] = 0;
      }
      monthlyEarnings[month] += parseFloat(course.price.toString()) || 0;
    });

    return Object.entries(monthlyEarnings)
      .map(([date, earnings]) => ({
        date,
        Courses: earnings,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [createdCourses]);

  return (
    <div className="flex h-auto justify-center pb-12 dark:bg-zinc-900">
      {/* first column */}
      <div className="space-y-8 px-[2rem] pt-[90px]">
        <div className="space-y-3">
          <div className="flex items-center justify-start md:flex-row md:justify-between">
            <div className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-white">
              Analytics Stats
            </div>

            <AnalyticsStatsSelect />
          </div>

          <ScrollArea className="">
            <AnalyticsStats
              totalEarning={totalEarning}
              totalStudents={totalStudents}
              totalCourses={totalCourses}
            />
          </ScrollArea>
        </div>

        <div className="space-y-3">
          <div className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-white">
            Earning Report
          </div>
          <EarningReportAreaChart data={earningChartData} />
        </div>

        <div className="space-y-3">
          <div className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-white">
            Students
          </div>
          <LineChartForStudents courses={createdCourses ?? []} />
        </div>
      </div>

      {/* second column */}
      <div className="mr-[2rem] mt-[3rem] w-[22rem] pt-[50px]">
        <TotalRevenueCard
          totalEarning={totalEarning}
          courses={createdCourses ?? []}
        />
        <div className="space-y-3 mt-8">
          {/* <div className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-white">
            Best Selling Courses
          </div> */}
          <BestSellingCourses courses={createdCourses ?? sampleCourses} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
