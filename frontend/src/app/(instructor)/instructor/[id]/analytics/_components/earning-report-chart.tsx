"use client";

import { FC } from "react";
import { AreaChart, Title } from "@tremor/react";
import { useTheme } from "next-themes";

export interface EarningChartData {
  date: string;
  Courses: number;
}

interface EarningReportAreaChartProps {
  data: EarningChartData[];
}

const EarningReportAreaChart: FC<EarningReportAreaChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="border-stroke mt-2 overflow-hidden rounded-lg border dark:bg-zinc-900">
      <div className="px-4 pt-4">
        <Title className={isDark ? "text-zinc-200" : "text-zinc-800"}>
          Course revenue over time (USD)
        </Title>
      </div>
      <AreaChart
        className={`mt-4 h-80 ${
          isDark
            ? '[&_.recharts-cartesian-axis-tick-value]:!fill-zinc-300 [&_.recharts-cartesian-axis-tick-value]:!text-zinc-300 [&_.recharts-legend-item-text]:!fill-zinc-300 [&_.recharts-legend-item-text]:!text-zinc-300 [&_.recharts-legend-item]:!gap-1 [&_.recharts-legend-item]:!items-center [&_.recharts-cartesian-grid-horizontal]:!stroke-zinc-600 [&_.recharts-cartesian-grid-vertical]:!stroke-zinc-600 [&_.recharts-cartesian-axis-line]:!stroke-zinc-600 [&_.recharts-cartesian-axis-tick-line]:!stroke-zinc-600'
            : '[&_.recharts-cartesian-axis-tick-value]:!fill-zinc-700 [&_.recharts-cartesian-axis-tick-value]:!text-zinc-700 [&_.recharts-legend-item-text]:!fill-zinc-700 [&_.recharts-legend-item-text]:!text-zinc-700 [&_.recharts-legend-item]:!gap-1 [&_.recharts-legend-item]:!items-center [&_.recharts-cartesian-grid-horizontal]:!stroke-zinc-300 [&_.recharts-cartesian-grid-vertical]:!stroke-zinc-300 [&_.recharts-cartesian-axis-line]:!stroke-zinc-300 [&_.recharts-cartesian-axis-tick-line]:!stroke-zinc-300'
        }`}
        data={data}
        index="date"
        defaultValue={0}
        categories={["Courses"]}
        colors={["indigo"]}
        allowDecimals={false}
        yAxisWidth={60}
        noDataText="There is no data, yet"
      />
    </div>
  );
};

export default EarningReportAreaChart;
