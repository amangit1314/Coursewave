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
          <EarningReportAreaChart />
        </div>

        <div className="space-y-3">
          <div className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-white">
            Students
          </div>
          <LineChartForStudents />
        </div>
      </div>

      {/* second column */}
      <div className="mr-[2rem] mt-[3rem] w-[22rem] pt-[50px]">
        <TotalRevenueCard />
        <BestSellingCourses courses={createdCourses} />
        <VisitorsAnalyticsChart />
      </div>
    </div>
  );
};

export default Analytics;
