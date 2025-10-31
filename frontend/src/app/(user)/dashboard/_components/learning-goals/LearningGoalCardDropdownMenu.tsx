// import { useLearningGoalsStore } from "@/zustand/learningGoalsStore";

import { EllipsisVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { LearningGoal } from "./learning-goal";
import { useZustandStore } from "@/zustand/store";

const LearningGoalCardDropdownMenu = ({
  learningGoal,
}: {
  learningGoal: LearningGoal;
}) => {
  const { removeLearningGoal } = useZustandStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <EllipsisVertical className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg"
      >
        <DropdownMenuLabel className="text-zinc-900 dark:text-zinc-100 font-semibold">
          Goal Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />

        <DropdownMenuItem
          className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mx-1 transition-colors group"
          onClick={() => removeLearningGoal?.(learningGoal.id)}
        >
          <Trash2 className="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
          <span className="text-zinc-700 dark:text-zinc-300 group-hover:text-red-700 dark:group-hover:text-red-400">
            Delete Goal
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LearningGoalCardDropdownMenu;
