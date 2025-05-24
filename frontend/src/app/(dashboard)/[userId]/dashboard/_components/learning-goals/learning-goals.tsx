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
import { Callout } from "@tremor/react";

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
    <div className="w-full space-y-4">
      <div className="flex w-full items-center justify-center">
        <h3 className="text-lg font-medium tracking-tight text-tremor-content-strong dark:text-gray-100">
          Learning Goals
        </h3>

        <div className="ml-auto">
          <AddLearningGoalButton />
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        {isLearningGoalsLoading ? (
          <LearningGoalsSkeleton />
        ) : learningGoalsError ? (
          <Callout
            className="bg-red-100 rounded-lg"
            title="Error Fetching learning goals 🚨❌"
            color="red"
          >
            {learningGoalsError} 🚨❌ ...
          </Callout>
        ) : (
          <div className="space-y-2">
            {learningGoals?.length > 0 ? (
              <>
                {learningGoals.map((goal: LearningGoal) => (
                  <div key={goal.id}>
                    <LearningGoalCard learningGoal={goal} />
                  </div>
                ))}
              </>
            ) : (
              <Callout className="bg-yellow-100 rounded-lg" title="No Learning Goals" color="yellow">
                You don't have any goals, set some 🧐 ...
              </Callout>
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
      {/* dialog trigger */}
      <DialogTrigger asChild>
        <div className="flex cursor-pointer items-center justify-center font-medium text-blue-500 transition-all duration-300 hover:text-blue-600">
          <IoMdAddCircleOutline className="h-[24px] w-[24px]" />
        </div>
      </DialogTrigger>

      {/* dialog content */}
      <DialogContent className="h-full max-h-[70vh] w-full max-w-[425px] overflow-hidden rounded-full md:max-w-screen-md">
        {/* dialog header */}
        <DialogHeader className="px-4 pt-4">
          <DialogTitle className="text-zinc-900 dark:text-white">
            Add Goal
          </DialogTitle>
          <DialogDescription className="text-zinc-700 dark:text-gray-300">
            Add a learning goal and click save when done.
          </DialogDescription>
        </DialogHeader>

        {/* learning goal form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 overflow-y-scroll px-4 pb-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <div>
                  <FormItem className="">
                    <FormLabel className="text-base tracking-tight text-gray-800 dark:text-gray-100">
                      Learning Goal
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        className="border-gray-700 bg-transparent dark:border-gray-400"
                        placeholder="i.e. 'Write an article', etc..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="">
                      What will you name your goal?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <div>
                  <FormItem className="">
                    <FormLabel className="text-base tracking-tight text-gray-800 dark:text-gray-100">
                      Tag
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        className="border-gray-700 bg-transparent dark:border-gray-400"
                        placeholder="i.e. 'task', etc..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="">
                      Give your goal a tag
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <div>
                  <FormItem className="">
                    <FormLabel className="text-base tracking-tight text-gray-800 dark:text-gray-100">
                      Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        className="border-gray-700 bg-transparent dark:border-gray-400"
                        placeholder="i.e. '9:00 AM', etc..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="">
                      Select your deadline time for that goal
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting || !isValid}>
                Save changes
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
    <div className="space-y-2">
      <Skeleton className="h-16 w-full rounded-md" />
      <Skeleton className="h-16 w-full rounded-md" />
      <Skeleton className="h-16 w-full rounded-md" />
      <Skeleton className="h-16 w-full rounded-md" />
    </div>
  );
};
