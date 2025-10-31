"use client";

import React from "react";
import { LineChart, Title } from "@tremor/react";
import { useTheme } from "next-themes";
import { Course } from "@/types/course";
import { valueFormatter } from "@/lib/utils/utils";
import { Badge } from "@/components/ui/badge";

interface StudentsLineChartProps {
  courses: Course[];
}

export const LineChartForStudents: React.FC<StudentsLineChartProps> = ({
  courses,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartdata = courses.map((course) => ({
    title:
      course.title.length > 20
        ? course.title.substring(0, 20) + "..."
        : course.title,
    // Students: course.totalStudents || Math.floor(Math.random() * 100) + 10, // Fallback for demo
  }));

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <Title
              className={`text-lg font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
            >
              Student Enrollment by Course
            </Title>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Total students enrolled per course
            </p>
          </div>
          <Badge color="orange" className="cursor-pointer">
            Active Courses
          </Badge>
        </div>
      </div>

      <div className="pr-4 py-4">
        <LineChart
          className={`h-80 ${
            isDark
              ? `
        [&_.recharts-cartesian-axis-tick-value]:!fill-zinc-400 
        [&_.recharts-cartesian-axis-tick-value]:!text-zinc-400
        [&_.recharts-cartesian-axis-tick-value]:!text-xs
        [&_.recharts-cartesian-axis-tick-value]:!font-medium
        [&_.recharts-legend-item-text]:!fill-zinc-300 
        [&_.recharts-legend-item-text]:!text-zinc-300
        [&_.recharts-legend-item-text]:!text-sm
        [&_.recharts-legend-item-text]:!font-medium
        [&_.recharts-legend-item]:!gap-2 
        [&_.recharts-legend-item]:!items-center
        [&_.recharts-cartesian-grid-horizontal]:!stroke-zinc-700
        [&_.recharts-cartesian-grid-horizontal]:!stroke-opacity-40
        [&_.recharts-cartesian-grid-vertical]:!stroke-zinc-700
        [&_.recharts-cartesian-grid-vertical]:!stroke-opacity-40
        [&_.recharts-cartesian-axis-line]:!stroke-zinc-600
        [&_.recharts-cartesian-axis-tick-line]:!stroke-zinc-600
        [&_.recharts-line]:!stroke-orange-400
        [&_.recharts-line]:!stroke-width-3
        [&_.recharts-line]:!drop-shadow-sm
        [&_.recharts-tooltip-wrapper]:!outline-none
        [&_.recharts-tooltip-content]:!bg-zinc-800/95
        [&_.recharts-tooltip-content]:!border-zinc-700
        [&_.recharts-tooltip-content]:!rounded-lg
        [&_.recharts-tooltip-content]:!shadow-lg
        [&_.recharts-tooltip-content]:!backdrop-blur-sm
        [&_.recharts-tooltip-label]:!text-zinc-200
        [&_.recharts-tooltip-label]:!font-medium
        [&_.recharts-active-dot]:!fill-orange-400
        [&_.recharts-active-dot]:!stroke-white
        [&_.recharts-active-dot]:!stroke-width-2
        [&_.recharts-active-dot]:!r-5
        [&_.recharts-active-dot]:!drop-shadow-lg
        [&_.recharts-dot]:!fill-orange-400
        [&_.recharts-dot]:!stroke-orange-500
        [&_.recharts-dot]:!stroke-width-2
        [&_.recharts-dot]:!r-3
      `.replace(/\s+/g, " ")
              : `
        [&_.recharts-cartesian-axis-tick-value]:!fill-zinc-600
        [&_.recharts-cartesian-axis-tick-value]:!text-zinc-600
        [&_.recharts-cartesian-axis-tick-value]:!text-xs
        [&_.recharts-cartesian-axis-tick-value]:!font-medium
        [&_.recharts-legend-item-text]:!fill-zinc-700
        [&_.recharts-legend-item-text]:!text-zinc-700
        [&_.recharts-legend-item-text]:!text-sm
        [&_.recharts-legend-item-text]:!font-medium
        [&_.recharts-legend-item]:!gap-2
        [&_.recharts-legend-item]:!items-center
        [&_.recharts-cartesian-grid-horizontal]:!stroke-zinc-200
        [&_.recharts-cartesian-grid-horizontal]:!stroke-opacity-60
        [&_.recharts-cartesian-grid-vertical]:!stroke-zinc-200
        [&_.recharts-cartesian-grid-vertical]:!stroke-opacity-60
        [&_.recharts-cartesian-axis-line]:!stroke-zinc-300
        [&_.recharts-cartesian-axis-tick-line]:!stroke-zinc-300
        [&_.recharts-line]:!stroke-orange-500
        [&_.recharts-line]:!stroke-width-3
        [&_.recharts-line]:!drop-shadow-sm
        [&_.recharts-tooltip-wrapper]:!outline-none
        [&_.recharts-tooltip-content]:!bg-white/95
        [&_.recharts-tooltip-content]:!border-zinc-200
        [&_.recharts-tooltip-content]:!rounded-lg
        [&_.recharts-tooltip-content]:!shadow-lg
        [&_.recharts-tooltip-content]:!backdrop-blur-sm
        [&_.recharts-tooltip-label]:!text-zinc-800
        [&_.recharts-tooltip-label]:!font-medium
        [&_.recharts-active-dot]:!fill-orange-500
        [&_.recharts-active-dot]:!stroke-white
        [&_.recharts-active-dot]:!stroke-width-2
        [&_.recharts-active-dot]:!r-5
        [&_.recharts-active-dot]:!drop-shadow-lg
        [&_.recharts-dot]:!fill-orange-500
        [&_.recharts-dot]:!stroke-orange-600
        [&_.recharts-dot]:!stroke-width-2
        [&_.recharts-dot]:!r-3
      `.replace(/\s+/g, " ")
          }`}
          data={chartdata}
          index="title"
          categories={["Students"]}
          colors={["orange"]}
          yAxisWidth={50}
          showLegend={false}
          showAnimation={true}
          connectNulls={false}
          curveType="monotone"
          showTooltip={true}
          animationDuration={1200}
        />
      </div>
    </div>
  );
};
