"use client";

import React from "react";
import { Star, TrendingUp, MessageSquare, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart } from "@tremor/react";
import { BsCircleFill } from "react-icons/bs";

interface Review {
  id: string;
  studentName: string;
  courseName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsRatingsDashboardProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recentReviews: Review[];
  ratingTrend: number; // percentage change
}

export const ReviewsRatingsDashboard: React.FC<
  ReviewsRatingsDashboardProps
> = ({
  averageRating,
  totalReviews,
  ratingDistribution,
  recentReviews,
  ratingTrend,
}) => {
  // Calculate percentages for rating distribution
  const ratingPercentages = Object.entries(ratingDistribution)
    .map(([stars, count]) => ({
      stars: `${stars} Stars`,
      count: count as number,
      percentage: (((count as number) / totalReviews) * 100).toFixed(0),
    }))
    .reverse();

  // Mock data for rating trends over time
  const ratingTrendData = [
    { month: "Jan", rating: 4.1 },
    { month: "Feb", rating: 4.3 },
    { month: "Mar", rating: 4.2 },
    { month: "Apr", rating: 4.4 },
    { month: "May", rating: 4.5 },
    { month: "Jun", rating: averageRating },
  ];

  return (
    <div className="w-full max-w-6xl space-y-6 mt-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average Rating */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950/20 dark:to-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" />
            {ratingTrend !== 0 && (
              <Badge
                className={
                  ratingTrend > 0
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                {ratingTrend > 0 ? "+" : ""}
                {ratingTrend}%
              </Badge>
            )}
          </div>
          <p className="text-4xl font-bold text-zinc-900 dark:text-white mb-1">
            {averageRating.toFixed(1)}
          </p>
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : i < averageRating
                      ? "fill-yellow-400 text-yellow-400 opacity-50"
                      : "text-zinc-300 dark:text-zinc-600"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Overall rating
          </p>
        </div>

        {/* Total Reviews */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-4xl font-bold text-zinc-900 dark:text-white mb-1">
            {totalReviews}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Total reviews
          </p>
        </div>

        {/* Positive Reviews */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-4xl font-bold text-zinc-900 dark:text-white mb-1">
            {(
              ((ratingDistribution[5] + ratingDistribution[4]) / totalReviews) *
              100
            ).toFixed(0)}
            %
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Positive reviews (4-5★)
          </p>
        </div>
      </div>

      {/* Rating Distribution & Trend */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Rating Distribution
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Breakdown of all ratings received
            </p>
          </div>

          <div className="space-y-3">
            {ratingPercentages.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-16">
                  {item.stars}
                </span>
                <div className="flex-1">
                  <Progress value={Number(item.percentage)} className="h-3" />
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-white w-12 text-right">
                  {item.count}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 w-12 text-right">
                  ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Trend Over Time */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Rating Trend
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Average rating over the last 6 months
            </p>
          </div>
          <BarChart
            className="h-64"
            data={ratingTrendData}
            index="month"
            categories={["rating"]}
            colors={["yellow"]}
            valueFormatter={(value) => `${value.toFixed(1)} ★`}
            showAnimation={true}
            showLegend={false}
            showGridLines={true}
            yAxisWidth={40}
            maxValue={5}
            minValue={0}
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

      {/* Recent Reviews */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Recent Reviews
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Latest feedback from your students
            </p>
          </div>
          <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
            View All Reviews
          </button>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {recentReviews.map((review) => (
            <div
              key={review.id}
              className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">
                      {review.studentName}
                    </h4>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      •
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                    {review.courseName}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-zinc-300 dark:text-zinc-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Prompt */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-1">
              Encourage More Reviews
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Reviews help build trust and attract more students
            </p>
          </div>
          <button className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl">
            Send Review Request
          </button>
        </div>
      </div>
    </div>
  );
};
