import { useZustandStore } from "@/zustand/store";
import { Tag as TagIcon, Calendar, CheckCircle2, Circle } from "lucide-react";
import React, { useState } from "react";
import { LearningGoal } from "./learning-goal";
import EditLearningGoal from "./EditLearningGoal";
import LearningGoalCardDropdownMenu from "./LearningGoalCardDropdownMenu";

const LearningGoalCard = ({ learningGoal }: { learningGoal: LearningGoal }) => {
  const { markLearningGoalAsDone } = useZustandStore();
  const [isDone, setIsDone] = useState<boolean>(learningGoal.isDone);

  const markGoalAsCompleted = () => {
    setIsDone(!isDone);
    markLearningGoalAsDone(learningGoal.id, !isDone);
  };

  // const formatDate = (date: Date | string) => {
  //   try {
  //     const dateObj = typeof date === "string" ? new Date(date) : date;
  //     return dateObj.toLocaleDateString("en-US", {
  //       month: "short",
  //       day: "numeric",
  //       year: "numeric",

  //     });
  //   } catch {
  //     return "No date";
  //   }
  // };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "No date";
    }
  };

  return (
    <div className="group relative overflow-hidden bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
      {/* Completion Status Indicator */}
      <div
        className={`absolute top-0 left-0 w-1 h-full rounded-l-xl transition-all ${
          learningGoal.isDone ? "bg-green-500" : "bg-blue-500"
        }`}
      />

      <div className="flex items-start justify-between gap-3 ml-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Custom Checkbox */}
          <button
            onClick={markGoalAsCompleted}
            className="flex-shrink-0 mt-0.5"
          >
            {learningGoal.isDone ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 transition-all" />
            ) : (
              <Circle className="w-5 h-5 text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3
              className={`text-sm font-medium tracking-tight transition-all ${
                learningGoal.isDone
                  ? "text-zinc-500 dark:text-zinc-400 line-through"
                  : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {learningGoal.title || "Untitled Goal"}
            </h3>

            {/* Meta Information */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {/* Tag */}
              {learningGoal.tag && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <TagIcon className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                    {learningGoal.tag}
                  </span>
                </div>
              )}

              {/* Date */}
              <div className="inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(learningGoal.time)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <EditLearningGoal learningGoal={learningGoal} />
          <LearningGoalCardDropdownMenu learningGoal={learningGoal} />
        </div>
      </div>
    </div>
  );
};

export default LearningGoalCard;
