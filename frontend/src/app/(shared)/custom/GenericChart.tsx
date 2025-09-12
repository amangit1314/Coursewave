"use client";

import React from "react";

export interface GenericChartProps<T extends { x: number | string; y: number }> {
  data: T[];
  type?: "line" | "bar" | "area" | "dot";
  width?: number;
  height?: number;
  color?: string;
}

const GenericChart = <T extends { x: number | string; y: number }>({
  data,
  type = "line",
  width = 600,
  height = 300,
  color = "#2563EB", // Tailwind blue-600
}: GenericChartProps<T>) => {
  if (!data || data.length === 0) return null;

  // Get domains
  const xValues = data.map((d) => d.x);
  const yValues = data.map((d) => d.y);

  const xScale = (value: number, index: number) => {
    if (typeof value === "number") {
      const min = Math.min(...(xValues as number[]));
      const max = Math.max(...(xValues as number[]));
      return ((value - min) / (max - min)) * (width - 50) + 40;
    }
    // Categorical
    return (index / (xValues.length - 1)) * (width - 50) + 40;
  };

  const yScale = (value: number) => {
    const min = Math.min(...yValues, 0);
    const max = Math.max(...yValues);
    return height - ((value - min) / (max - min)) * (height - 40) - 20;
  };

  const points = data.map((d, i) => [xScale(d.x as number, i), yScale(d.y)]);

  const pathData = points
    .map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`))
    .join(" ");

  const areaPath =
    pathData +
    ` L${points[points.length - 1][0]},${height - 20} L${points[0][0]},${
      height - 20
    } Z`;

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-white p-6 shadow dark:bg-gray-800">
      <svg width={width} height={height}>
        {/* Axes */}
        <line x1={40} y1={height - 20} x2={width - 10} y2={height - 20} stroke="#9CA3AF" />
        <line x1={40} y1={10} x2={40} y2={height - 20} stroke="#9CA3AF" />

        {/* Data */}
        {type === "line" && <path d={pathData} fill="none" stroke={color} strokeWidth={2} />}
        {type === "area" && <path d={areaPath} fill={color + "33"} stroke={color} strokeWidth={2} />}
        {type === "bar" &&
          points.map(([x, y], i) => (
            <rect
              key={i}
              x={x - 10}
              y={y}
              width={20}
              height={height - 20 - y}
              fill={color}
              rx={3}
            />
          ))}
        {type === "dot" &&
          points.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={5} fill={color} />
          ))}
      </svg>
    </div>
  );
};

export default GenericChart;
