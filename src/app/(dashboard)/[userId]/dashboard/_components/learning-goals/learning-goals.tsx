import { IoMdAddCircleOutline } from "react-icons/io";
import LearningGoalCard from "./learning-goal-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useZustandStore } from "@/zustand/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { generateUid } from "@/helpers/id-helper";
import { TargetIcon, PlusIcon } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required",
  }),
  tag: z.string(),
  time: z.string(),
  isDone: z.boolean(),
});

type LearningGoal = {
  id: string;
  title: string;
  tag: string;
  time: Date | string;
  isDone: boolean;
};

const LearningGoals = () => {
  const learningGoals = useZustandStore((state: any) => state.learningGoals);
  const isLearningGoalsLoading = useZustandStore((state: any) => state.loading);
  const learningGoalsError = useZustandStore((state: any) => state.error);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <TargetIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
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
        {isLearningGoalsLoading ? (
          <LearningGoalsSkeleton />
        ) : learningGoalsError ? (
          <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <TargetIcon className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Error Loading Goals
                </h3>
                <div className="mt-1 text-sm text-red-700 dark:text-red-400">
                  <p>{learningGoalsError}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
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
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  No Learning Goals
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                  Set your first learning goal to get started
                </p>
                <AddLearningGoalButton />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningGoals;

const AddLearningGoalButton = () => {
  const { addLearningGoal } = useZustandStore();
  const [time, setTime] = useState("10:00");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      tag: "",
      time: "",
      isDone: false,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const goalId = generateUid();
    const learningGoal = {
      id: goalId,
      title: values.title,
      tag: values.tag,
      time: values.time,
      isDone: values.isDone,
    };
    addLearningGoal(learningGoal);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-colors">
          <PlusIcon className="h-5 w-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="h-full max-h-[70vh] w-full max-w-[425px] overflow-hidden rounded-2xl md:max-w-screen-md">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle className="text-gray-900 dark:text-white">
            Add Learning Goal
          </DialogTitle>
          <DialogDescription className="text-gray-700 dark:text-gray-300">
            Set a new learning objective to track your progress.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 overflow-y-scroll px-4 pb-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">
                    Goal Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
                      placeholder="e.g., Complete React Course"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-600 dark:text-gray-400">
                    What do you want to achieve?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">
                    Category
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
                      placeholder="e.g., Programming, Design, Business"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-600 dark:text-gray-400">
                    What category does this goal belong to?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">
                    Target Time
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="time"
                      className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-600 dark:text-gray-400">
                    When do you want to complete this goal?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                {isSubmitting ? "Adding..." : "Add Goal"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const LearningGoalsSkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};
