"use client";

import React from "react";
import { AreaChart, Title } from "@tremor/react";
import { LineChart } from "@tremor/react";
import { useTheme } from "next-themes";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { RiRadioButtonLine } from "react-icons/ri";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { IoMdTrendingUp } from "react-icons/io";

// Types
export interface EarningChartData {
  date: string;
  Courses: number;
}

interface Course {
  id: string;
  title: string;
  price: number;
  createdAt: string;
  isPublished: boolean;
  totalStudents?: number;
}

// Enhanced Earning Report Area Chart
interface EarningReportAreaChartProps {
  data: EarningChartData[];
}

export const EarningReportAreaChart: React.FC<EarningReportAreaChartProps> = ({
  data,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white shadow-sm transition-all hover:shadow-md  dark:bg-zinc-900">
      <div className="border-b px-6 py-4 border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <Title
              className={`text-lg font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
            >
              Course Revenue Over Time
            </Title>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Monthly revenue from course sales
            </p>
          </div>
          {/* <div className="flex items-center space-x-2">
            <IoMdTrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              +12.5%
            </span>
          </div> */}
        </div>
      </div>

      <div className="py-6 px-6">
        {/* <AreaChart
          className={`h-80 ${
            isDark
              ? `  dark:border-zinc-700
        [&_.recharts-cartesian-axis-tick-value]:!fill-zinc-400 
        [&_.recharts-cartesian-axis-tick-value]:!text-xs
        [&_.recharts-cartesian-axis-tick-value]:!font-semibold
        [&_.recharts-cartesian-grid-horizontal]:!stroke-zinc-700
        [&_.recharts-cartesian-grid-horizontal]:!stroke-opacity-30
        [&_.recharts-cartesian-grid-vertical]:!stroke-zinc-700
        [&_.recharts-cartesian-grid-vertical]:!stroke-opacity-30
        [&_.recharts-cartesian-grid-horizontal]:!stroke-dasharray-3,3
        [&_.recharts-cartesian-grid-vertical]:!stroke-dasharray-3,3
        [&_.recharts-cartesian-axis-line]:!stroke-zinc-600
        [&_.recharts-cartesian-axis-tick-line]:!stroke-zinc-600
        [&_.recharts-area]:!fill-gradient-to-t
        [&_.recharts-area]:!from-blue-500/30
        [&_.recharts-area]:!to-blue-400/10
        [&_.recharts-area]:!stroke-blue-400
        [&_.recharts-area]:!stroke-width-3
        [&_.recharts-tooltip-content]:!bg-zinc-900/95
        [&_.recharts-tooltip-content]:!border-zinc-700
        [&_.recharts-tooltip-content]:!rounded-xl
        [&_.recharts-tooltip-content]:!shadow-2xl
        [&_.recharts-tooltip-content]:!backdrop-blur-sm
        [&_.recharts-active-dot]:!fill-blue-400
        [&_.recharts-active-dot]:!stroke-white
        [&_.recharts-active-dot]:!stroke-width-3
        [&_.recharts-active-dot]:!r-5
        [&_.recharts-active-dot]:!drop-shadow-lg
      `.replace(/\s+/g, " ")
              : `
        [&_.recharts-cartesian-axis-tick-value]:!fill-zinc-600
        [&_.recharts-cartesian-axis-tick-value]:!text-xs
        [&_.recharts-cartesian-axis-tick-value]:!font-semibold
        [&_.recharts-cartesian-grid-horizontal]:!stroke-zinc-200
        [&_.recharts-cartesian-grid-horizontal]:!stroke-opacity-50
        [&_.recharts-cartesian-grid-vertical]:!stroke-zinc-200
        [&_.recharts-cartesian-grid-vertical]:!stroke-opacity-50
        [&_.recharts-cartesian-grid-horizontal]:!stroke-dasharray-3,3
        [&_.recharts-cartesian-grid-vertical]:!stroke-dasharray-3,3
        [&_.recharts-cartesian-axis-line]:!stroke-zinc-300
        [&_.recharts-cartesian-axis-tick-line]:!stroke-zinc-300
        [&_.recharts-area]:!fill-gradient-to-t
        [&_.recharts-area]:!from-blue-500/20
        [&_.recharts-area]:!to-blue-400/5
        [&_.recharts-area]:!stroke-blue-500
        [&_.recharts-area]:!stroke-width-3
        [&_.recharts-tooltip-content]:!bg-white/95
        [&_.recharts-tooltip-content]:!border-zinc-200
        [&_.recharts-tooltip-content]:!rounded-xl
        [&_.recharts-tooltip-content]:!shadow-2xl
        [&_.recharts-tooltip-content]:!backdrop-blur-sm
        [&_.recharts-active-dot]:!fill-blue-500
        [&_.recharts-active-dot]:!stroke-white
        [&_.recharts-active-dot]:!stroke-width-3
        [&_.recharts-active-dot]:!r-5
        [&_.recharts-active-dot]:!drop-shadow-lg
      `.replace(/\s+/g, " ")
          }`}
          data={data}
          index="date"
          categories={["Courses"]}
          colors={["blue"]}
          allowDecimals={false}
          yAxisWidth={60}
          noDataText="No revenue data available"
          showAnimation={true}
          curveType="monotone"
          showTooltip={true}
          showLegend={false}
          showGridLines={true}
          showXAxis={true}
          showYAxis={true}
          animationDuration={1500}
          connectNulls={true}
        /> */}

        <AreaChart
          className="
    h-80
    border
    border-zinc-200
    rounded-xl
    shadow
    bg-white
    dark:bg-zinc-900
    dark:border-zinc-700
    transition-colors

    [&_.recharts-cartesian-axis-tick-value]:fill-zinc-600
    [&_.recharts-cartesian-axis-tick-value]:text-xs
    [&_.recharts-cartesian-axis-tick-value]:font-semibold
    [&_.recharts-cartesian-grid-horizontal]:stroke-zinc-200
    [&_.recharts-cartesian-grid-horizontal]:stroke-opacity-50
    [&_.recharts-cartesian-grid-horizontal]:stroke-dasharray-[3,3]
    [&_.recharts-cartesian-grid-vertical]:stroke-zinc-200
    [&_.recharts-cartesian-grid-vertical]:stroke-opacity-50
    [&_.recharts-cartesian-grid-vertical]:stroke-dasharray-[3,3]
    [&_.recharts-cartesian-axis-line]:stroke-zinc-300
    [&_.recharts-cartesian-axis-tick-line]:stroke-zinc-300
    [&_.recharts-area]:fill-gradient-to-t
    [&_.recharts-area]:from-blue-500/20
    [&_.recharts-area]:to-blue-400/5
    [&_.recharts-area]:stroke-blue-500
    [&_.recharts-area]:stroke-width-3
    [&_.recharts-tooltip-content]:bg-white/95
    [&_.recharts-tooltip-content]:border-zinc-200
    [&_.recharts-tooltip-content]:rounded-xl
    [&_.recharts-tooltip-content]:shadow-2xl
    [&_.recharts-tooltip-content]:backdrop-blur-sm
    [&_.recharts-active-dot]:fill-blue-500
    [&_.recharts-active-dot]:stroke-white
    [&_.recharts-active-dot]:stroke-width-3
    [&_.recharts-active-dot]:r-5
    [&_.recharts-active-dot]:drop-shadow-lg

    dark:[&_.recharts-cartesian-axis-tick-value]:fill-zinc-400
    dark:[&_.recharts-cartesian-grid-horizontal]:stroke-zinc-700
    dark:[&_.recharts-cartesian-grid-horizontal]:stroke-opacity-30
    dark:[&_.recharts-cartesian-grid-vertical]:stroke-zinc-700
    dark:[&_.recharts-cartesian-grid-vertical]:stroke-opacity-30
    dark:[&_.recharts-cartesian-axis-line]:stroke-zinc-600
    dark:[&_.recharts-cartesian-axis-tick-line]:stroke-zinc-600
    dark:[&_.recharts-area]:from-blue-500/30
    dark:[&_.recharts-area]:to-blue-400/10
    dark:[&_.recharts-area]:stroke-blue-400
    dark:[&_.recharts-tooltip-content]:bg-zinc-900/95
    dark:[&_.recharts-tooltip-content]:border-zinc-700
    dark:[&_.recharts-active-dot]:fill-blue-400
  "
          data={data}
          index="date"
          categories={["Courses"]}
          colors={["blue"]}
          allowDecimals={false}
          yAxisWidth={60}
          noDataText="No revenue data available"
          showAnimation={true}
          curveType="monotone"
          showTooltip={true}
          showLegend={false}
          showGridLines={true}
          showXAxis={true}
          showYAxis={true}
          animationDuration={1500}
          connectNulls={true}
        />
      </div>
    </div>
  );
};
