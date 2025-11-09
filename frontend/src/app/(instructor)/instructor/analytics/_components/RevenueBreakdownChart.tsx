"use client";

import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DonutChart, BarChart, AreaChart } from "@tremor/react";
import { BsCircleFill } from "react-icons/bs";

export interface RevenueByPaymentMethod {
  method: string;
  amount: number;
  count: number;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
  transactions: number;
}

export interface RevenueByCourse {
  courseId: string;
  courseName: string;
  revenue: number;
  enrollments: number;
  price: number;
}

export interface RevenueBreakdownProps {
  totalRevenue: number;
  revenueTrend: number;
  revenueByPaymentMethod: RevenueByPaymentMethod[];
  revenueByMonth: RevenueByMonth[];
  revenueByCourse: RevenueByCourse[];
  averageTransactionValue: number;
  totalTransactions: number;
}

export const RevenueBreakdownChart: React.FC<RevenueBreakdownProps> = ({
  totalRevenue,
  revenueTrend,
  revenueByPaymentMethod,
  revenueByMonth,
  revenueByCourse,
  averageTransactionValue,
  totalTransactions,
}) => {
  const [viewMode, setViewMode] = useState<"course" | "month" | "payment">(
    "month"
  );

  // Top earning courses
  const topCourses = [...revenueByCourse]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="w-full max-w-6xl space-y-6  mt-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            {revenueTrend !== 0 && (
              <Badge
                className={
                  revenueTrend > 0
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                {revenueTrend > 0 ? "+" : ""}
                {revenueTrend}%
              </Badge>
            )}
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Total revenue
          </p>
        </div>

        {/* Average Transaction */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            ${averageTransactionValue.toFixed(2)}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Avg transaction
          </p>
        </div>

        {/* Total Transactions */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {totalTransactions}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Total transactions
          </p>
        </div>

        {/* Top Course Revenue */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            ${topCourses[0]?.revenue.toLocaleString() || 0}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 truncate">
            {topCourses[0]?.courseName || "N/A"}
          </p>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-fit">
        <button
          onClick={() => setViewMode("month")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === "month"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          By Month
        </button>
        <button
          onClick={() => setViewMode("course")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === "course"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          By Course
        </button>
        <button
          onClick={() => setViewMode("payment")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === "payment"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          <CreditCard className="w-4 h-4 inline mr-2" />
          By Payment
        </button>
      </div>

      {/* Revenue Charts Based on View Mode */}
      {viewMode === "month" && (
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Monthly Revenue Trends
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Revenue and transaction volume over time
            </p>
          </div>
          <AreaChart
            className="h-80"
            data={revenueByMonth}
            index="month"
            categories={["revenue"]}
            colors={["green"]}
            valueFormatter={(value) => `${value.toLocaleString()}`}
            showAnimation={true}
            showLegend={false}
            showGridLines={true}
            yAxisWidth={80}
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
      )}

      {viewMode === "course" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
                Top Earning Courses
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Revenue by course
              </p>
            </div>
            <BarChart
              className="h-80"
              data={topCourses.map((c) => ({
                course:
                  c.courseName.length > 20
                    ? c.courseName.substring(0, 20) + "..."
                    : c.courseName,
                revenue: c.revenue,
              }))}
              index="course"
              categories={["revenue"]}
              colors={["blue"]}
              valueFormatter={(value) => `${value.toLocaleString()}`}
              showAnimation={true}
              showLegend={false}
              layout="vertical"
              yAxisWidth={120}
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

          {/* Detailed Course Table */}
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
                Course Revenue Details
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Detailed breakdown
              </p>
            </div>
            <div className="space-y-3 max-h-[320px] overflow-y-auto">
              {topCourses.map((course, index) => (
                <div
                  key={course.courseId}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-zinc-900 dark:text-white line-clamp-2">
                          {course.courseName}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ml-2">
                      ${course.revenue.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span>{course.enrollments} enrollments</span>
                    <span>${course.price.toFixed(2)} each</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === "payment" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Donut Chart */}
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
                Revenue by Payment Method
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Distribution across payment methods
              </p>
            </div>
            <div className="flex items-center justify-center">
              <DonutChart
                className="h-72"
                data={revenueByPaymentMethod.map((p) => ({
                  name: p.method,
                  value: p.amount,
                }))}
                category="value"
                index="name"
                colors={["blue", "purple", "green", "orange"]}
                valueFormatter={(value) => `${value.toLocaleString()}`}
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
          </div>

          {/* Payment Method Details */}
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
                Payment Method Breakdown
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Detailed statistics
              </p>
            </div>
            <div className="space-y-4">
              {revenueByPaymentMethod.map((payment) => (
                <div
                  key={payment.method}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">
                          {payment.method}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {payment.count} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">
                        ${payment.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {((payment.amount / totalRevenue) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                      <span>Avg per transaction</span>
                      <span className="font-semibold">
                        ${(payment.amount / payment.count).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Revenue Insights */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4">
          Revenue Insights
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Best Performing Month
            </p>
            <p className="text-xl font-bold text-zinc-900 dark:text-white">
              {
                revenueByMonth.reduce(
                  (max, month) => (month.revenue > max.revenue ? month : max),
                  revenueByMonth[0]
                ).month
              }
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              $
              {revenueByMonth
                .reduce(
                  (max, month) => (month.revenue > max.revenue ? month : max),
                  revenueByMonth[0]
                )
                .revenue.toLocaleString()}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Most Popular Course
            </p>
            <p className="text-xl font-bold text-zinc-900 dark:text-white line-clamp-1">
              {topCourses[0]?.courseName}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              {topCourses[0]?.enrollments} students
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Growth Rate
            </p>
            <p className="text-xl font-bold text-zinc-900 dark:text-white">
              {revenueTrend > 0 ? "+" : ""}
              {revenueTrend}%
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
              vs last period
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
