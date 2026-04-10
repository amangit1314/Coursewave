import { dmSans } from "@/lib/config/fonts";
import { motion } from "framer-motion";
import { TrendingUpIcon } from "lucide-react";
import React from "react";

type Props = {
  completionRate: number;
  totalEnrolledCourses: number;
  totalOngoingCourses: number;
  totalCompletedCourses: number;
};

const LearningProgress = (props: Props) => {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        {/* heading */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <TrendingUpIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className={`${dmSans.className} text-xl font-semibold text-zinc-900 dark:text-white`}>
              Learning Progress
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Your course completion overview
            </p>
          </div>
        </div>

        {/* completion rate */}
        <div className="text-right">
          <div className={`${dmSans.className} text-2xl font-bold text-zinc-900 dark:text-white`}>
            {props.completionRate}%
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Completion Rate
          </div>
        </div>
      </div>

      {/* progress bar of completion rate */}
      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-3">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${props.completionRate}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        {/* Enrolled courses */}
        <div>
          <div className="text-lg font-semibold text-zinc-900 dark:text-white">
            {props.totalEnrolledCourses}
          </div>
          <div className={`${dmSans.className} text-sm text-zinc-600 dark:text-zinc-400`}>
            Enrolled
          </div>
        </div>

        {/* In Progress */}
        <div>
          <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
            {props.totalOngoingCourses}
          </div>
          <div className={`${dmSans.className} text-sm text-zinc-600 dark:text-zinc-400`}>
            In Progress
          </div>
        </div>

        {/* Total completed courses */}
        <div>
          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
            {props.totalCompletedCourses}
          </div>
          <div className={`${dmSans.className} text-sm text-zinc-600 dark:text-zinc-400`}>
            Completed
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningProgress;
