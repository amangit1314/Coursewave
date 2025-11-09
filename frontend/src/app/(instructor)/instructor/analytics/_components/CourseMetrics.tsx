"use client";

import React, { useState } from "react";
import { Course } from "@/types/course";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Star,
  CheckCircle,
  Eye,
  ShoppingCart,
  Heart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CoursePerformanceDetailsProps {
  courses: Course[];
}

interface CourseMetrics {
  id: string;
  title: string;
  enrollments: number;
  revenue: number;
  completionRate: number;
  averageRating: number;
  totalViews: number;
  cartAdds: number;
  wishlistAdds: number;
  activeStudents: number;
}

export const CoursePerformanceDetails: React.FC<CoursePerformanceDetailsProps> = ({
  courses,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(
    courses[0]?.id || null
  );

  // Mock metrics - in real app, fetch from API
  const coursesMetrics: CourseMetrics[] = courses.map((course) => ({
    id: course.id,
    title: course.title,
    enrollments: Math.floor(Math.random() * 500) + 50,
    revenue: parseFloat(course.price.toString()) * (Math.floor(Math.random() * 100) + 20),
    completionRate: Math.floor(Math.random() * 40) + 40,
    averageRating: (Math.random() * 2 + 3).toFixed(1) as any,
    totalViews: Math.floor(Math.random() * 2000) + 200,
    cartAdds: Math.floor(Math.random() * 150) + 30,
    wishlistAdds: Math.floor(Math.random() * 200) + 50,
    activeStudents: Math.floor(Math.random() * 300) + 30,
  }));

  const selectedMetrics = coursesMetrics.find((c) => c.id === selectedCourse);

  return (
    <div className="w-full max-w-6xl overflow-hidden my-6 rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
          Course Performance Details
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Detailed metrics for each course
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 p-6">
        {/* Course Selector */}
        <div className="lg:col-span-1 space-y-2 max-h-[500px] overflow-y-auto pr-2">
          <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            Select Course
          </h4>
          {coursesMetrics.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedCourse === course.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-500"
                  : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
              }`}
            >
              <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
                {course.title}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="text-xs">
                  {course.enrollments} students
                </Badge>
                <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  ${course.revenue.toFixed(0)}
                </Badge>
              </div>
            </button>
          ))}
        </div>

        {/* Metrics Display */}
        {selectedMetrics && (
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Enrollments */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-zinc-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Enrollments
                  </span>
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {selectedMetrics.enrollments}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {selectedMetrics.activeStudents} active
                </p>
              </div>

              {/* Revenue */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-zinc-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Revenue
                  </span>
                  <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  ${selectedMetrics.revenue.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Lifetime earnings
                </p>
              </div>

              {/* Completion Rate */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-zinc-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Completion Rate
                  </span>
                  <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {selectedMetrics.completionRate}%
                </p>
                <Progress 
                  value={selectedMetrics.completionRate} 
                  className="mt-2 h-2"
                />
              </div>

              {/* Average Rating */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950/20 dark:to-zinc-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Average Rating
                  </span>
                  <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {selectedMetrics.averageRating} / 5.0
                </p>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(Number(selectedMetrics.averageRating))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-zinc-300 dark:text-zinc-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
              <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
                Engagement Metrics
              </h4>
              <div className="space-y-3">
                {/* Total Views */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Total Views
                    </span>
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {selectedMetrics.totalViews.toLocaleString()}
                  </span>
                </div>

                {/* Cart Additions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Cart Additions
                    </span>
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {selectedMetrics.cartAdds}
                  </span>
                </div>

                {/* Wishlist Additions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Wishlist Additions
                    </span>
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {selectedMetrics.wishlistAdds}
                  </span>
                </div>

                {/* Conversion Rate */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Conversion Rate
                    </span>
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {((selectedMetrics.enrollments / selectedMetrics.totalViews) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};