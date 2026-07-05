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
import { LearningGoal } from "@/types/learning-goal";
import { useLearningGoalsStore } from "@/zustand/learningGoalsStore";

const LearningGoalCardDropdownMenu = ({
  learningGoal,
}: {
  learningGoal: LearningGoal;
}) => {
  const { removeLearningGoal } = useLearningGoalsStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-card border border-border rounded-xl shadow-lg"
      >
        <DropdownMenuLabel className="text-foreground font-semibold">
          Goal Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mx-1 transition-colors group"
          onClick={() => removeLearningGoal?.(learningGoal.id)}
        >
          <Trash2 className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
          <span className="text-muted-foreground group-hover:text-red-700 dark:group-hover:text-red-400">
            Delete Goal
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LearningGoalCardDropdownMenu;
