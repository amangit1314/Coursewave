import React from "react";
import { TargetIcon } from "lucide-react";
import { dmSans } from "@/lib/config/fonts";
import { LearningGoal } from "@/types/learning-goal";
import { useLearningGoalsStore } from "@/zustand/learningGoalsStore";

import LearningGoalCard from "./LearningGoalCard";
import LearningGoalsSkeleton from "./LearningGoalsSkeleton";
import AddLearningGoalButton from "./AddLearningGoal";

const LearningGoals = () => {
  const learningGoals = useLearningGoalsStore((s) => s.learningGoals);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <TargetIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3
              className={`${dmSans.className} text-lg font-semibold text-gray-900 dark:text-white`}
            >
              Learning Goals
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set and track your learning objectives
            </p>
          </div>
        </div>

        <AddLearningGoalButton />
      </div>

      <div className="space-y-3">
        <div className="space-y-3">
            {learningGoals?.length > 0 ? (
              <>
                {learningGoals.map((goal: LearningGoal) => (
                  <div key={goal.id}>
                    <LearningGoalCard learningGoal={goal} />
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-8 px-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600">
                <div className="bg-white dark:bg-gray-600 p-3 rounded-full mb-3">
                  <TargetIcon className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                </div>
                <h4
                  className={`${dmSans.className} text-sm font-medium text-gray-900 dark:text-white mb-1`}
                >
                  No Learning Goals
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                  Set your first learning goal to get started
                </p>
                <AddLearningGoalButton />
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default LearningGoals;
