"use client";

import React, { useEffect, useState } from "react";
import { AiOutlineSolution } from "react-icons/ai";
import { GrInProgress } from "react-icons/gr";
import { TiTick } from "react-icons/ti";
import { CgTimelapse } from "react-icons/cg";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

type AnalyticsStats = {
  totalEnrolledCourses: number;
  totalCompletedCourses: number;
  totalOngoingCourses: number;
};

const statsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  }),
};

export default function UserDashboardStats({
  totalEnrolledCourses,
  totalCompletedCourses,
  totalOngoingCourses,
}: AnalyticsStats) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a default theme during SSR to prevent hydration mismatch
  const isDark = mounted ? theme === "dark" : false;

  const stats = [
    {
      title: "Total Time Spent",
      total: `${totalEnrolledCourses ? totalEnrolledCourses : 0} h`,
      icon: CgTimelapse,
      bgColor: isDark ? "bg-orange-900/30" : "bg-orange-100",
      iconColor: isDark ? "text-orange-400" : "text-orange-600",
      borderColor: isDark ? "border-orange-800/50" : "border-orange-200",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Enrolled Courses",
      total: `${totalEnrolledCourses ? totalEnrolledCourses : 0}`,
      icon: AiOutlineSolution,
      bgColor: isDark ? "bg-blue-900/30" : "bg-blue-100",
      iconColor: isDark ? "text-blue-400" : "text-blue-600",
      borderColor: isDark ? "border-blue-800/50" : "border-blue-200",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Ongoing Courses",
      total: totalOngoingCourses ? totalOngoingCourses.toString() : "0",
      icon: GrInProgress,
      bgColor: isDark ? "bg-yellow-900/30" : "bg-yellow-100",
      iconColor: isDark ? "text-yellow-400" : "text-yellow-600",
      borderColor: isDark ? "border-yellow-800/50" : "border-yellow-200",
      gradient: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Completed Courses",
      total: totalCompletedCourses ? totalCompletedCourses.toString() : "0",
      icon: TiTick,
      bgColor: isDark ? "bg-green-900/30" : "bg-green-100",
      iconColor: isDark ? "text-green-400" : "text-green-600",
      borderColor: isDark ? "border-green-800/50" : "border-green-200",
      gradient: "from-green-500 to-green-600",
    },
  ];

  return (
    <ScrollArea className="w-full">
      <div className="mx-auto grid w-full max-w-7xl gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={statsVariants}
            className="group"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 transition-all duration-300 hover:shadow-md">
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor} ${stat.iconColor} border ${stat.borderColor} transition-all duration-300 group-hover:scale-110`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="text-right sr-only">
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                      {stat.title}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white">
                    {stat.total}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {stat.title}
                  </div>
                </div>

                {/* Progress indicator for ongoing courses */}
                {stat.title === "Ongoing Courses" && totalOngoingCourses > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((totalOngoingCourses / totalEnrolledCourses) * 100)}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5">
                      <motion.div
                        className={`bg-gradient-to-r ${stat.gradient} h-1.5 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round((totalOngoingCourses / totalEnrolledCourses) * 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </div>
                )}

                {/* Completion indicator for completed courses */}
                {stat.title === "Completed Courses" && totalCompletedCourses > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                      <span>Success Rate</span>
                      <span>{Math.round((totalCompletedCourses / totalEnrolledCourses) * 100)}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5">
                      <motion.div
                        className={`bg-gradient-to-r ${stat.gradient} h-1.5 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round((totalCompletedCourses / totalEnrolledCourses) * 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
