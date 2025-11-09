"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  Bookmark,
  Share2,
  Clock,
  Square,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChart, BarChart } from "@tremor/react";
import { BsCircleFill, BsSquareFill } from "react-icons/bs";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  views: number;
  likes: number;
  comments: number;
  saved: number;
  shares: number;
  readTime: number;
  publishedAt: string;
  isPublished: boolean;
}

interface BlogAnalyticsProps {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalSaved: number;
  blogs: BlogPost[];
  viewsTrend: number;
}

export const BlogAnalyticsComponent: React.FC<BlogAnalyticsProps> = ({
  totalBlogs,
  publishedBlogs,
  draftBlogs,
  totalViews,
  totalLikes,
  totalComments,
  totalSaved,
  blogs,
  viewsTrend,
}) => {
  const [selectedBlog, setSelectedBlog] = useState<string | null>(
    blogs[0]?.id || null
  );

  const selectedBlogData = blogs.find((b) => b.id === selectedBlog);

  // Mock engagement trend data
  const engagementTrendData = [
    { month: "Jan", views: 1200, likes: 85, comments: 32 },
    { month: "Feb", views: 1800, likes: 120, comments: 45 },
    { month: "Mar", views: 2200, likes: 165, comments: 58 },
    { month: "Apr", views: 2800, likes: 210, comments: 72 },
    { month: "May", views: 3400, likes: 280, comments: 95 },
    {
      month: "Jun",
      views: totalViews,
      likes: totalLikes,
      comments: totalComments,
    },
  ];

  // Top performing blogs
  const topBlogs = [...blogs].sort((a, b) => b.views - a.views).slice(0, 5);

  const avgEngagementRate = (
    ((totalLikes + totalComments + totalSaved) / totalViews) *
    100
  ).toFixed(1);

  return (
    <div className="w-full max-w-6xl space-y-6 mt-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Blogs */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <Badge className="text-xs">{publishedBlogs} Published</Badge>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {totalBlogs}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Total blog posts
          </p>
        </div>

        {/* Total Views */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            {viewsTrend !== 0 && (
              <Badge
                className={
                  viewsTrend > 0
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }
              >
                {viewsTrend > 0 ? "+" : ""}
                {viewsTrend}%
              </Badge>
            )}
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {totalViews.toLocaleString()}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Total views
          </p>
        </div>

        {/* Total Engagement */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <Badge className="text-xs bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400">
              {avgEngagementRate}%
            </Badge>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {totalLikes}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Total likes
          </p>
        </div>

        {/* Total Comments */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {totalComments}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Total comments
          </p>
        </div>
      </div>

      {/* Engagement Trend Chart */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
            Blog Engagement Trends
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Views, likes, and comments over the last 6 months
          </p>
        </div>
        <AreaChart
          className="h-72"
          data={engagementTrendData}
          index="month"
          categories={["views", "likes", "comments"]}
          colors={["blue", "pink", "green"]}
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
                      <span>{item.value?.toLocaleString?.() ?? item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          }
        />
      </div>

      {/* Top Performing Blogs & Individual Blog Details */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Performing Blogs */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Top Performing
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Most viewed blog posts
            </p>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {topBlogs.map((blog, index) => (
              <button
                key={blog.id}
                onClick={() => setSelectedBlog(blog.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedBlog === blog.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-zinc-900 dark:text-white line-clamp-2 mb-2">
                      {blog.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {blog.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {blog.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Blog Details */}
        {selectedBlogData && (
          <div className="lg:col-span-2 space-y-6">
            {/* Blog Header */}
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 dark:bg-zinc-900">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                    {selectedBlogData.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <Clock className="w-4 h-4" />
                    <span>{selectedBlogData.readTime} min read</span>
                    <span>•</span>
                    <span>
                      {new Date(
                        selectedBlogData.publishedAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Badge
                  className={
                    selectedBlogData.isPublished
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }
                >
                  {selectedBlogData.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>

              {/* Engagement Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <Eye className="w-5 h-5 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">
                    {selectedBlogData.views.toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Views
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <Heart className="w-5 h-5 mx-auto mb-1 text-pink-600 dark:text-pink-400" />
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">
                    {selectedBlogData.likes}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Likes
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <MessageSquare className="w-5 h-5 mx-auto mb-1 text-green-600 dark:text-green-400" />
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">
                    {selectedBlogData.comments}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Comments
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <Bookmark className="w-5 h-5 mx-auto mb-1 text-purple-600 dark:text-purple-400" />
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">
                    {selectedBlogData.saved}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Saved
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
              <h4 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4">
                Performance Metrics
              </h4>

              <div className="space-y-4">
                {/* Engagement Rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Engagement Rate
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {(
                        ((selectedBlogData.likes +
                          selectedBlogData.comments +
                          selectedBlogData.saved) /
                          selectedBlogData.views) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      ((selectedBlogData.likes +
                        selectedBlogData.comments +
                        selectedBlogData.saved) /
                        selectedBlogData.views) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                {/* Like Rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Like Rate
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {(
                        (selectedBlogData.likes / selectedBlogData.views) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (selectedBlogData.likes / selectedBlogData.views) * 100
                    }
                    className="h-2"
                  />
                </div>

                {/* Comment Rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Comment Rate
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {(
                        (selectedBlogData.comments / selectedBlogData.views) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (selectedBlogData.comments / selectedBlogData.views) * 100
                    }
                    className="h-2"
                  />
                </div>

                {/* Save Rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Save Rate
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {(
                        (selectedBlogData.saved / selectedBlogData.views) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (selectedBlogData.saved / selectedBlogData.views) * 100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                <Share2 className="w-5 h-5 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Share Blog
                </p>
              </button>
              <button className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                <TrendingUp className="w-5 h-5 mx-auto mb-2 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Boost Post
                </p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
