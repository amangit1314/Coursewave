"use client";

import React from "react";
import { Globe, MapPin, Users, TrendingUp, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DonutChart, BarChart } from "@tremor/react";
import { BsCircleFill } from "react-icons/bs";

interface GeographicData {
  country: string;
  countryCode: string;
  students: number;
  revenue: number;
  growth: number;
}

interface StudentSegment {
  segment: string;
  count: number;
  percentage: number;
}

interface EnrollmentTiming {
  timeRange: string;
  enrollments: number;
}

interface StudentDemographicsProps {
  totalStudents: number;
  geographicData: GeographicData[];
  studentSegments: StudentSegment[];
  enrollmentTiming: EnrollmentTiming[];
  topCountries: GeographicData[];
  newStudentsThisMonth: number;
  returningStudents: number;
}

export const StudentDemographicsChart: React.FC<StudentDemographicsProps> = ({
  totalStudents,
  geographicData,
  studentSegments,
  enrollmentTiming,
  topCountries,
  newStudentsThisMonth,
  returningStudents,
}) => {
  const returningRate = ((returningStudents / totalStudents) * 100).toFixed(1);

  return (
    <div className="w-full max-w-6xl space-y-6  mt-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <Badge className="text-xs">Global</Badge>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {totalStudents.toLocaleString()}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Total students
          </p>
        </div>

        {/* Countries Reached */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {geographicData.length}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Countries
          </p>
        </div>

        {/* New Students */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              This Month
            </Badge>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {newStudentsThisMonth}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            New students
          </p>
        </div>

        {/* Returning Rate */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {returningRate}%
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Returning rate
          </p>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Countries Map/Chart */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Top Countries
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Students by geographic location
            </p>
          </div>
          <BarChart
            className="h-80"
            data={topCountries.map((c) => ({
              country: c.country,
              students: c.students,
            }))}
            index="country"
            categories={["students"]}
            colors={["blue"]}
            valueFormatter={(value) => value.toLocaleString()}
            showAnimation={true}
            showLegend={false}
            layout="horizontal"
            yAxisWidth={100}
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

        {/* Country Details List */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Geographic Details
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Detailed breakdown by country
            </p>
          </div>
          <div className="space-y-3 max-h-[320px] overflow-y-auto">
            {topCountries.map((country, index) => (
              <div
                key={country.countryCode}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{country.countryCode}</span>
                      <div>
                        <p className="font-semibold text-sm text-zinc-900 dark:text-white">
                          {country.country}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {((country.students / totalStudents) * 100).toFixed(
                            1
                          )}
                          % of total
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-zinc-900 dark:text-white">
                      {country.students}
                    </p>
                    {country.growth > 0 && (
                      <Badge className="text-xs mt-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        +{country.growth}%
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span>Revenue</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    ${country.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Segments & Enrollment Timing */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Student Segments */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Student Segments
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Audience breakdown
            </p>
          </div>
          <div className="flex items-center justify-center mb-6">
            <DonutChart
              className="h-64"
              data={studentSegments.map((s) => ({
                segment: s.segment,
                value: s.count,
              }))}
              category="value"
              index="segment"
              colors={["blue", "purple", "green", "orange", "pink"]}
              valueFormatter={(value) => value.toLocaleString()}
              showAnimation={true}
              customTooltip={({ payload, label }) =>
                payload && payload.length > 0 ? (
                  <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg p-4 text-zinc-900 dark:text-white min-w-[200px]">
                    <div className="font-semibold mb-1">{label}</div>
                    <div className="space-y-1">
                      {payload.map(
                        (item: {
                          dataKey: React.Key | null | undefined;
                          color: any;
                          name:
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | Promise<
                                | string
                                | number
                                | bigint
                                | boolean
                                | React.ReactPortal
                                | React.ReactElement<
                                    unknown,
                                    string | React.JSXElementConstructor<any>
                                  >
                                | Iterable<React.ReactNode>
                                | null
                                | undefined
                              >
                            | null
                            | undefined;
                          value: { toLocaleString: () => any };
                        }) => (
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
                        )
                      )}
                    </div>
                  </div>
                ) : null
              }
            />
          </div>
          <div className="space-y-2">
            {studentSegments.map((segment) => (
              <div
                key={segment.segment}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800"
              >
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {segment.segment}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {segment.count}
                  </span>
                  <Badge className="text-xs">
                    {segment.percentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enrollment Timing */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Enrollment Timing
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              When students enroll most
            </p>
          </div>
          <BarChart
            className="h-80"
            data={enrollmentTiming}
            index="timeRange"
            categories={["enrollments"]}
            colors={["purple"]}
            valueFormatter={(value) => value.toLocaleString()}
            showAnimation={true}
            showLegend={false}
            showGridLines={true}
            yAxisWidth={60}
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
      </div>

      {/* Global Reach Insights */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 dark:bg-zinc-900">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Global Reach Insights
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  Primary Market
                </p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">
                  {topCountries[0]?.country}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  {topCountries[0]?.students} students
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  Fastest Growing
                </p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">
                  {
                    [...topCountries].sort((a, b) => b.growth - a.growth)[0]
                      ?.country
                  }
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +
                  {
                    [...topCountries].sort((a, b) => b.growth - a.growth)[0]
                      ?.growth
                  }
                  % growth
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  Highest Revenue Market
                </p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">
                  {
                    [...topCountries].sort((a, b) => b.revenue - a.revenue)[0]
                      ?.country
                  }
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                  $
                  {[...topCountries]
                    .sort((a, b) => b.revenue - a.revenue)[0]
                    ?.revenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
