"use client";

import React from "react";
import {
  LineChart,
  Title,
} from "@tremor/react";
import { useTheme } from "next-themes";
import { Course } from "@/types/course";

interface StudentsLineChartProps {
  courses: Course[];
}

const valueFormatter = (number: number) =>
  `${new Intl.NumberFormat("us").format(number).toString()}`;

export default function LineChartForStudents({ courses }: StudentsLineChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartdata = courses.map(course => ({
    title: course.title,
    "Students": course.totalStudents,
  }));

  return (
    <div className="border-stroke mt-2 overflow-hidden rounded-lg border dark:bg-zinc-900">
      <div className="px-4 pt-4">
        <Title className={isDark ? "text-zinc-200" : "text-zinc-800"}>
          Students enrolled per course
        </Title>
      </div>
      <LineChart
        className={`mt-6 ${
          isDark 
            ? '[&_.recharts-cartesian-axis-tick-value]:!fill-zinc-300 [&_.recharts-cartesian-axis-tick-value]:!text-zinc-300 [&_.recharts-legend-item-text]:!fill-zinc-300 [&_.recharts-legend-item-text]:!text-zinc-300 [&_.recharts-legend-item]:!gap-1 [&_.recharts-legend-item]:!items-center [&_.recharts-cartesian-grid-horizontal]:!stroke-zinc-600 [&_.recharts-cartesian-grid-vertical]:!stroke-zinc-600 [&_.recharts-cartesian-axis-line]:!stroke-zinc-600 [&_.recharts-cartesian-axis-tick-line]:!stroke-zinc-600' 
            : '[&_.recharts-cartesian-axis-tick-value]:!fill-zinc-700 [&_.recharts-cartesian-axis-tick-value]:!text-zinc-700 [&_.recharts-legend-item-text]:!fill-zinc-700 [&_.recharts-legend-item-text]:!text-zinc-700 [&_.recharts-legend-item]:!gap-1 [&_.recharts-legend-item]:!items-center [&_.recharts-cartesian-grid-horizontal]:!stroke-zinc-300 [&_.recharts-cartesian-grid-vertical]:!stroke-zinc-300 [&_.recharts-cartesian-axis-line]:!stroke-zinc-300 [&_.recharts-cartesian-axis-tick-line]:!stroke-zinc-300'
        }`}
        data={chartdata}
        index="title"
        categories={["Students"]}
        colors={["orange"]}
        valueFormatter={valueFormatter}
        yAxisWidth={40}
        showLegend={false}
      />
    </div>
  );
}
