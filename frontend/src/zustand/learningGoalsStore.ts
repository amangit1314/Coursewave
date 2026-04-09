"use client";


import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeLocalStorage } from "./safe-storage";
import { LearningGoal } from "@/types/learning-goal";

type LearningGoalsState = {
  learningGoals: LearningGoal[];
};

type LearningGoalsActions = {
  addLearningGoal: (learningGoal: LearningGoal) => void;
  markLearningGoalAsDone: (id: string, isDone: boolean) => void;
  editLearningGoal: (
    id: string,
    title: string,
    tag: string,
    date: Date | string,
    time: string
  ) => void;
  removeLearningGoal: (id: string) => void;
};

export const useLearningGoalsStore = create<
  LearningGoalsState & LearningGoalsActions
>()(
  persist(
    (set, get) => ({
      learningGoals: [],

      addLearningGoal: (learningGoal: LearningGoal) => {
        set((state) => ({
          learningGoals: [...state.learningGoals, learningGoal],
        }));
      },
      markLearningGoalAsDone: (id: string, isDone: boolean) => {
        set((state) => ({
          learningGoals: state.learningGoals.map((goal) =>
            goal.id === id ? { ...goal, isDone } : goal
          ),
        }));
      },
      editLearningGoal: (
        id: string,
        title?: string,
        tag?: string,
        date?: Date | string,
        time?: string
      ) => {
        set((state) => ({
          learningGoals: state.learningGoals.map((goal: LearningGoal) =>
            goal.id === id
              ? {
                  ...goal,
                  title: title ?? goal.title,
                  tag: tag ?? goal.tag,
                  date: date ?? goal.date,
                  time: time ?? goal.time,
                }
              : goal
          ),
        }));
      },
      removeLearningGoal: (id: string) => {
        set((state) => ({
          learningGoals: state.learningGoals.filter(
            (goal: LearningGoal) => goal.id !== id
          ),
        }));
      },
    }),

    {
      name: "Coursewave-Learning-Goals-Store",
      storage: safeLocalStorage,
    }
  )
);
