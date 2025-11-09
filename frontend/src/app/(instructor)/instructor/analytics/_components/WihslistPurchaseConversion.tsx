"use client";

import React from "react";
import {
  Heart,
  ShoppingBag,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, AreaChart } from "@tremor/react";
import { BsCircleFill } from "react-icons/bs";

interface WishlistCourse {
  courseId: string;
  courseName: string;
  wishlistAdds: number;
  purchases: number;
  conversionRate: number;
  averageDaysToConvert: number;
  price: number;
}

interface WishlistTrend {
  month: string;
  additions: number;
  conversions: number;
  conversionRate: number;
}

interface WishlistPurchaseConversionProps {
  totalWishlistAdds: number;
  totalConversions: number;
  overallConversionRate: number;
  averageTimeToConvert: number;
  potentialRevenue: number;
  wishlistCourses: WishlistCourse[];
  wishlistTrends: WishlistTrend[];
  activeWishlists: number;
  conversionTrend: number;
}

export const WishlistPurchaseConversion: React.FC<
  WishlistPurchaseConversionProps
> = ({
  totalWishlistAdds,
  totalConversions,
  overallConversionRate,
  averageTimeToConvert,
  potentialRevenue,
  wishlistCourses,
  wishlistTrends,
  activeWishlists,
  conversionTrend,
}) => {
  // Sort courses by conversion rate
  const topConvertingCourses = [...wishlistCourses]
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, 5);

  // Sort courses by wishlist adds
  const mostWishlisted = [...wishlistCourses]
    .sort((a, b) => b.wishlistAdds - a.wishlistAdds)
    .slice(0, 5);

  return (
    <div className="w-full max-w-6xl space-y-6  mt-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Wishlist Adds */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400 fill-pink-600 dark:fill-pink-400" />
            <Badge className="text-xs bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400">
              Total
            </Badge>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {totalWishlistAdds.toLocaleString()}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Wishlist additions
          </p>
        </div>

        {/* Conversion Rate */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />
            {conversionTrend !== 0 && (
              <Badge
                className={
                  conversionTrend > 0
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }
              >
                {conversionTrend > 0 ? "+" : ""}
                {conversionTrend}%
              </Badge>
            )}
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {overallConversionRate.toFixed(1)}%
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Conversion rate
          </p>
        </div>

        {/* Avg Time to Convert */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {averageTimeToConvert}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Days to convert
          </p>
        </div>

        {/* Potential Revenue */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            ${potentialRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Potential revenue
          </p>
        </div>
      </div>

      {/* Conversion Trends Over Time */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
            Wishlist Conversion Trends
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Additions vs conversions over time
          </p>
        </div>
        <AreaChart
          className="h-80"
          data={wishlistTrends}
          index="month"
          categories={["additions", "conversions"]}
          colors={["pink", "green"]}
          valueFormatter={(value) => value.toLocaleString()}
          showAnimation={true}
          showLegend={true}
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

      {/* Top Converting & Most Wishlisted Courses */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Converting Courses */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Top Converting Courses
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Highest wishlist → purchase conversion
            </p>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {topConvertingCourses.map((course, index) => (
              <div
                key={course.courseId}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-green-300 dark:hover:border-green-600 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-zinc-900 dark:text-white line-clamp-2 mb-1">
                        {course.courseName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {course.wishlistAdds}
                        </span>
                        <span>→</span>
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" />
                          {course.purchases}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ml-2">
                    {course.conversionRate.toFixed(1)}%
                  </Badge>
                </div>
                <div className="mt-2">
                  <Progress value={course.conversionRate} className="h-2" />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Avg: {course.averageDaysToConvert} days</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    ${course.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Wishlisted Courses */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Most Wishlisted Courses
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Courses with highest demand
            </p>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {mostWishlisted.map((course, index) => (
              <div
                key={course.courseId}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-pink-300 dark:hover:border-pink-600 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-zinc-900 dark:text-white line-clamp-2 mb-1">
                        {course.courseName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {course.purchases} purchased
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400">
                      {course.wishlistAdds} ♥
                    </Badge>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {course.conversionRate.toFixed(0)}% conv
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span>
                    Potential: $
                    {(course.wishlistAdds * course.price).toLocaleString()}
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    ${course.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Rate by Time to Purchase */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
            Conversion Rate by Time to Purchase
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            When users convert after wishlisting
          </p>
        </div>
        <BarChart
          className="h-64"
          data={[
            {
              range: "Same Day",
              conversions: Math.floor(totalConversions * 0.15),
            },
            {
              range: "1-3 Days",
              conversions: Math.floor(totalConversions * 0.25),
            },
            {
              range: "4-7 Days",
              conversions: Math.floor(totalConversions * 0.3),
            },
            {
              range: "8-14 Days",
              conversions: Math.floor(totalConversions * 0.18),
            },
            {
              range: "15-30 Days",
              conversions: Math.floor(totalConversions * 0.08),
            },
            {
              range: "30+ Days",
              conversions: Math.floor(totalConversions * 0.04),
            },
          ]}
          index="range"
          categories={["conversions"]}
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

      {/* Optimization Insights */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5" />
          Wishlist Optimization Insights
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Active Wishlists
            </p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
              {activeWishlists.toLocaleString()}
            </p>
            <p className="text-xs text-pink-600 dark:text-pink-400">
              Potential customers to target
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Best Conversion Window
            </p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
              4-7 Days
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              Peak conversion period
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Untapped Revenue
            </p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
              $
              {(
                potentialRevenue -
                totalConversions * (potentialRevenue / totalWishlistAdds)
              ).toLocaleString()}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              From unconverted wishlists
            </p>
          </div>
        </div>

        {/* Action Items */}
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
          <p className="font-semibold text-zinc-900 dark:text-white mb-3">
            Recommended Actions:
          </p>
          <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-pink-600 dark:text-pink-400 mt-0.5">•</span>
              <span>
                Send automated emails to users 3-5 days after wishlisting with
                special offers
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-600 dark:text-pink-400 mt-0.5">•</span>
              <span>
                Create urgency with limited-time discounts for wishlisted
                courses
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-600 dark:text-pink-400 mt-0.5">•</span>
              <span>
                Highlight courses with high wishlist counts as "Popular" to
                drive conversions
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
