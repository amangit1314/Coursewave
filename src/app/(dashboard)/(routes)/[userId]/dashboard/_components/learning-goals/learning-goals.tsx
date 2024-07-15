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
import { generateUid } from "@/helpers/id_helper";

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
    <div className="space-y-4 w-full">
      <div className="flex justify-center items-center w-full">
        <h3 className="text-lg font-medium text-tremor-content-strong dark:text-gray-100 tracking-tight">
          Learning Goals
        </h3>

        {/* add goal button */}
       <div className="ml-auto">
       <AddLearningGoalButton />
       </div>
      </div>

      <div className="flex flex-col space-y-1">
        {isLearningGoalsLoading ? (
          <LearningGoalsSkeleton />
        ) : learningGoalsError ? (
          <div className="text-red-400 text-base">Error fetching enrolled courses</div>
        ) : (
          <div>
            {learningGoals?.length > 0 ? (
              <div className="space-y-2">
                {learningGoals.map((goal: LearningGoal) => (
                  <div key={goal.id}>
                    <LearningGoalCard learningGoal={goal} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-yellow-400">
                You don't have any goals, set some 🧐 ...
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
    inputRef.current?.focus(); // Focus the input element when the component mounts
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
    <div className="">
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex justify-center items-center text-blue-500 cursor-pointer font-medium hover:text-blue-600 transition-all duration-300">
            <IoMdAddCircleOutline className="h-[24px] w-[24px]" />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[70vh] h-full md:max-w-[70vw] w-full rounded-3xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>Add Goal</DialogTitle>
            <DialogDescription>
              Add a learning goal and click save when done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4 overflow-y-scroll"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <div>
                    <FormItem className="mt-8">
                      <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100">
                        Learning Goal
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          className="bg-transparent border-gray-700 dark:border-gray-400 "
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
                    <FormItem className="mt-8">
                      <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100">
                        Tag
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          className="bg-transparent border-gray-700 dark:border-gray-400 "
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
                    <FormItem className="mt-8">
                      <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100">
                        Time
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          className="bg-transparent border-gray-700 dark:border-gray-400 "
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
                <Button type="submit" disabled={isSubmitting || !isValid}>Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
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
