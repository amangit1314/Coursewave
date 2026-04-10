"use client";

import React from "react";
import { AiOutlineSolution } from "react-icons/ai";
import { GrInProgress } from "react-icons/gr";
import { TiTick } from "react-icons/ti";
import { CgTimelapse } from "react-icons/cg";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { staggerItem, hoverLift } from "@/lib/config/motion";
import { ProgressBar } from "@/components/shared";

type AnalyticsStats = {
  totalEnrolledCourses: number;
  totalCompletedCourses: number;
  totalOngoingCourses: number;
};

const stats = [
  {
    key: "time",
    title: "Total Time Spent",
    icon: CgTimelapse,
    iconBg: "bg-orange-100 dark:bg-orange-900/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    key: "enrolled",
    title: "Enrolled Courses",
    icon: AiOutlineSolution,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    key: "ongoing",
    title: "Ongoing Courses",
    icon: GrInProgress,
    iconBg: "bg-amber-100 dark:bg-amber-900/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    key: "completed",
    title: "Completed Courses",
    icon: TiTick,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
] as const;

export default function UserDashboardStats({
  totalEnrolledCourses,
  totalCompletedCourses,
  totalOngoingCourses,
}: AnalyticsStats) {
  const values: Record<string, string> = {
    time: `${totalEnrolledCourses || 0} h`,
    enrolled: `${totalEnrolledCourses || 0}`,
    ongoing: `${totalOngoingCourses || 0}`,
    completed: `${totalCompletedCourses || 0}`,
  };

  const successRate =
    totalEnrolledCourses > 0
      ? Math.round((totalCompletedCourses / totalEnrolledCourses) * 100)
      : 0;

  return (
    <ScrollArea className="w-full">
      <div className="mx-auto grid w-full max-w-7xl gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.key}
            variants={staggerItem}
            {...hoverLift}
            className="group"
          >
            <div className="relative overflow-hidden rounded-xl bg-card border border-border p-6 transition-shadow duration-200 hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.iconBg} ${stat.iconColor} transition-transform duration-200 group-hover:scale-110`}
                >
                  <stat.icon size={24} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                  {values[stat.key]}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.title}
                </div>
              </div>

              {stat.key === "completed" && totalCompletedCourses > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Success Rate</span>
                    <span className="tabular-nums">{successRate}%</span>
                  </div>
                  <ProgressBar value={successRate} showLabel={false} />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
