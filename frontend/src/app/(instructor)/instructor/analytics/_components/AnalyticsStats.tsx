import React from "react";
import { BsPersonVideo2 } from "react-icons/bs";
import { TbMoneybag } from "react-icons/tb";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CardDataStats from "@/components/CardDataStats";
import {
  Users,
  GraduationCap,
  Star,
  FileText,
  TrendingUp,
  CheckCircle,
  BookOpen,
  MessageSquare,
} from "lucide-react";

type AnalyticsStatsProps = {
  totalEarning: string;
  totalStudents: number;
  totalCourses: number;
  totalEnrollments?: number;
  averageRating?: number;
  totalReviews?: number;
  completionRate?: number;
  totalProjects?: number;
  pendingSubmissions?: number;
  totalBlogs?: number;
  blogViews?: number;
  activeStudents?: number;
  earningsTrend?: number;
  studentsTrend?: number;
  coursesTrend?: number;
};

export default function AnalyticsStats({
  totalEarning,
  totalStudents,
  totalCourses,
  totalEnrollments,
  averageRating,
  totalReviews,
  completionRate,
  totalProjects,
  pendingSubmissions,
  totalBlogs,
  blogViews,
  activeStudents,
  earningsTrend,
  studentsTrend,
  coursesTrend,
}: AnalyticsStatsProps) {
  return (
    <ScrollArea className="w-full max-w-7xl overflow-hidden rounded-lg">
      <div className="flex space-x-4">
        <div className="w-[240px]">
          <CardDataStats
            title="Total Earnings"
            total={`$ ${totalEarning ? totalEarning : 0}`}
            rate={earningsTrend ? `${earningsTrend}%` : undefined}
            levelUp={earningsTrend ? earningsTrend > 0 : undefined}
          >
            <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 p-1.5">
              <TbMoneybag size={22} className="text-green-600 dark:text-green-400" />
            </div>
          </CardDataStats>
        </div>

        <div className="w-[240px]">
          <CardDataStats
            title="Total Courses"
            total={totalCourses ? totalCourses.toString() : "0"}
            rate={coursesTrend ? `${coursesTrend}%` : undefined}
            levelUp={coursesTrend ? coursesTrend > 0 : undefined}
          >
            <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 p-1.5">
              <BsPersonVideo2 size={22} className="text-blue-600 dark:text-blue-400" />
            </div>
          </CardDataStats>
        </div>

        <div className="w-[240px]">
          <CardDataStats
            title="Total Students"
            total={totalStudents ? totalStudents.toString() : "0"}
            rate={studentsTrend ? `${studentsTrend}%` : undefined}
            levelUp={studentsTrend ? studentsTrend > 0 : undefined}
          >
            <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 p-1.5">
              <Users size={22} className="text-purple-600 dark:text-purple-400" />
            </div>
          </CardDataStats>
        </div>

        {totalEnrollments !== undefined && (
          <div className="w-[240px]">
            <CardDataStats title="Total Enrollments" total={totalEnrollments.toString()}>
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 p-1.5">
                <GraduationCap size={22} className="text-orange-600 dark:text-orange-400" />
              </div>
            </CardDataStats>
          </div>
        )}

        {averageRating !== undefined && (
          <div className="w-[240px]">
            <CardDataStats title="Average Rating" total={averageRating.toFixed(1)}>
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-1.5">
                <Star size={22} className="text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardDataStats>
          </div>
        )}

        {totalReviews !== undefined && (
          <div className="w-[240px]">
            <CardDataStats title="Total Reviews" total={totalReviews.toString()}>
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30 p-1.5">
                <MessageSquare size={22} className="text-pink-600 dark:text-pink-400" />
              </div>
            </CardDataStats>
          </div>
        )}

        {completionRate !== undefined && (
          <div className="w-[240px]">
            <CardDataStats title="Completion Rate" total={`${completionRate.toFixed(0)}%`}>
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30 p-1.5">
                <CheckCircle size={22} className="text-teal-600 dark:text-teal-400" />
              </div>
            </CardDataStats>
          </div>
        )}

        {activeStudents !== undefined && (
          <div className="w-[240px]">
            <CardDataStats title="Active Students" total={activeStudents.toString()}>
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-1.5">
                <TrendingUp size={22} className="text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardDataStats>
          </div>
        )}

        {totalProjects !== undefined && (
          <div className="w-[240px]">
            <CardDataStats title="Total Projects" total={totalProjects.toString()}>
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/30 p-1.5">
                <FileText size={22} className="text-cyan-600 dark:text-cyan-400" />
              </div>
            </CardDataStats>
          </div>
        )}

        {pendingSubmissions !== undefined && (
          <div className="w-[240px]">
            <CardDataStats title="Pending Reviews" total={pendingSubmissions.toString()}>
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 p-1.5">
                <FileText size={22} className="text-red-600 dark:text-red-400" />
              </div>
            </CardDataStats>
          </div>
        )}

        {totalBlogs !== undefined && (
          <div className="w-[240px]">
            <CardDataStats title="Total Blogs" total={totalBlogs.toString()}>
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 p-1.5">
                <BookOpen size={22} className="text-violet-600 dark:text-violet-400" />
              </div>
            </CardDataStats>
          </div>
        )}

        {blogViews !== undefined && (
          <div className="w-[240px]">
            <CardDataStats title="Blog Views" total={blogViews.toLocaleString()}>
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-1.5">
                <TrendingUp size={22} className="text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardDataStats>
          </div>
        )}
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
