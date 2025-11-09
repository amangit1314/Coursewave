"use client";

import React from "react";
import { BarChart, DonutChart } from "@tremor/react";
import { useTheme } from "next-themes";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";
import { BsCircleFill } from "react-icons/bs";

interface StudentEngagementProps {
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  droppedStudents: number;
}

export const StudentEngagementDashboard: React.FC<StudentEngagementProps> = ({
  totalStudents,
  activeStudents,
  completedStudents,
  droppedStudents,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Mock data for chapter completion
  const chapterCompletionData = [
    { chapter: "Ch 1", completion: 95 },
    { chapter: "Ch 2", completion: 87 },
    { chapter: "Ch 3", completion: 78 },
    { chapter: "Ch 4", completion: 65 },
    { chapter: "Ch 5", completion: 52 },
    { chapter: "Ch 6", completion: 41 },
    { chapter: "Ch 7", completion: 35 },
    { chapter: "Ch 8", completion: 28 },
  ];

  // Student status distribution
  const statusData = [
    { status: "Active", count: activeStudents, color: "blue" },
    { status: "Completed", count: completedStudents, color: "green" },
    { status: "Dropped", count: droppedStudents, color: "red" },
  ];

  const activeRate = ((activeStudents / totalStudents) * 100).toFixed(1);
  const completionRate = ((completedStudents / totalStudents) * 100).toFixed(1);

  return (
    <div className="w-full max-w-6xl space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Total
            </span>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {totalStudents}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            All students
          </p>
        </div>

        {/* Active Students */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              {activeRate}%
            </span>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {activeStudents}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Currently learning
          </p>
        </div>

        {/* Completed Students */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
              {completionRate}%
            </span>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {completedStudents}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Completed courses
          </p>
        </div>

        {/* Dropped Students */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <UserX className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-600 dark:text-red-400">
              {((droppedStudents / totalStudents) * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {droppedStudents}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Inactive students
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chapter Completion Funnel */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Chapter Completion Funnel
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Drop-off rate by chapter
            </p>
          </div>
          <BarChart
            className="h-64"
            data={chapterCompletionData}
            index="chapter"
            categories={["completion"]}
            colors={["blue"]}
            valueFormatter={(value) => `${value}%`}
            showAnimation={true}
            showLegend={false}
            showGridLines={true}
            yAxisWidth={40}
            customTooltip={({ payload, label }) =>
              payload && payload.length > 0 ? (
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg p-4 text-zinc-900 dark:text-white min-w-[200px]">
                  <div className="font-semibold mb-1">{label}</div>
                  <div className="space-y-1">
                    {payload.map((item) => (
                      <div
                        key={item.dataKey}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <BsCircleFill
                            className="w-3 h-3"
                            style={{ color: item.color }}
                          />
                          {item.name}
                        </span>
                        <span>
                          {item.value?.toLocaleString?.() ?? item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            }
          />
        </div>

        {/* Student Status Distribution */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Student Status Distribution
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Current enrollment status
            </p>
          </div>
          <div className="flex items-center justify-center">
            <DonutChart
              className="h-64"
              data={statusData}
              category="count"
              index="status"
              colors={["blue", "green", "red"]}
              valueFormatter={(value) => value.toString()}
              showAnimation={true}
              customTooltip={({ payload, label }) =>
                payload && payload.length > 0 ? (
                  <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg p-4 text-zinc-900 dark:text-white min-w-[200px]">
                    <div className="font-semibold mb-1">{label}</div>
                    <div className="space-y-1">
                      {payload.map((item: { dataKey: React.Key | null | undefined; color: any; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; value: { toLocaleString: () => any; }; }) => (
                        <div
                          key={item.dataKey}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <BsCircleFill
                              className="w-3 h-3"
                              style={{ color: item.color }}
                            />
                            {item.name}
                          </span>
                          <span>
                            {item.value?.toLocaleString?.() ?? item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              }
            />
          </div>
          <div className="mt-6 space-y-2">
            {statusData.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full bg-${item.color}-500`}
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.status}
                  </span>
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {item.count} (
                  {((item.count / totalStudents) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Average Time Insights */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 dark:bg-zinc-900">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2">
              Student Engagement Insights
            </h3>
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Average Time to Complete
                  </p>
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">
                    42 days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Average Watch Time per Student
                  </p>
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">
                    8.5 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Retention Rate
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {(
                ((activeStudents + completedStudents) / totalStudents) *
                100
              ).toFixed(0)}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
