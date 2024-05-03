"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import AnalyticsStatsSelect from "./analytics-stats-select";
import AnalyticsStats from "./analytics-stats";
import BestSellingCourses from "./best-selling-courses-table";
import EarningReportAreaChart from "./earning-report-chart";
import LineChartForStudents from "./students-line-chart";
import TotalRevenueCard from "./total-revenue-card";
import VisitorsAnalyticsChart from "./visitors-analytics-chart";
import { Course } from "@prisma/client";

type AnalyticsStats = {
  totalEarning: string;
  totalStudents: number;
  totalCourses: number;
  createdCourses: Course[];
};

const Analytics = ({
  totalEarning,
  totalStudents,
  totalCourses,
  createdCourses,
}: AnalyticsStats) => {
  return (
    <div className="dark:bg-zinc-900 h-auto flex justify-center pb-12">
      {/* first column */}
      <div className="space-y-8 px-[2rem] pt-[90px]">
        <div className="space-y-3">
          <div className="flex justify-start md:flex-row md:justify-between items-center">
            <div className="font-semibold text-xl tracking-tight text-zinc-800 dark:text-white">
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
          <div className="font-semibold text-xl text-zinc-800 dark:text-white tracking-tight ">
            Earning Report
          </div>
          <EarningReportAreaChart />
        </div>

        <div className="space-y-3">
          <div className="font-semibold text-xl text-zinc-800 dark:text-white tracking-tight">
            Students
          </div>
          <LineChartForStudents />
        </div>
      </div>

      {/* second column */}
      <div className="w-[22rem] mt-[3rem] pt-[50px] mr-[2rem]">
        <TotalRevenueCard />
        <BestSellingCourses courses={createdCourses} />
        <VisitorsAnalyticsChart />
      </div>
    </div>
  );
};

export default Analytics;
