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
import { Label } from "@/components/ui/label";
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
  title: string;
  tag: string;
  time: Date | string;
  isDone: boolean;
};

const LearningGoals = () => {
  const learningGoals = useZustandStore((state) => state.learningGoals);
  const isLearningGoalsLoading = useZustandStore((state) => state.loading);
  const learningGoalsError = useZustandStore((state) => state.error);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong tracking-tight">
          Learning Goals
        </h3>

        {/* add goal button */}
        <AddLearningGoalButton />
      </div>

      <div className="flex flex-col space-y-1">
        {isLearningGoalsLoading ? (
          <LearningGoalsSkeleton />
        ) : learningGoalsError ? (
          <div className="text-red-400">Error fetching enrolled courses</div>
        ) : (
          <div>
            {learningGoals?.length > 0 ? (
              <div>
                {learningGoals.map((goal: LearningGoal, index: any) => (
                  <div key={index}>
                    <LearningGoalCard learningGoal={goal} />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                You doesn't saved any article, Browse and save one 😁 ...
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
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [time, setTime] = useState("10:00");

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = React.useState("");

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
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex justify-center items-center text-blue-500 cursor-pointer font-medium hover:text-blue-600 transition-all duration-300">
            <IoMdAddCircleOutline />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Goal</DialogTitle>
            <DialogDescription>
              Add a learning goal and click save when done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Field
                  name="title"
                  render={({ input }) => (
                    <input
                      {...input}
                      id="title"
                      placeholder="Enter your learning goal ..."
                      className="col-span-3"
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tag" className="text-right">
                  Tag
                </Label>
                <Field
                  name="tag"
                  render={({ input }) => (
                    <input
                      {...input}
                      id="tag"
                      placeholder="Give a tag ..."
                      className="col-span-3"
                    />
                  )}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <TimePicker
                  id="time"
                  onChange={setTime}
                  value={time}
                  className="col-span-3"
                />
              </div> */}

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <div>
                    <FormItem className="mt-8">
                      <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100">
                        Course Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          className="bg-transparent border-gray-700 dark:border-gray-400 "
                          placeholder="i.e. 'Full Stack Bootcamp', etc..."
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
                          placeholder="i.e. 'Full Stack Bootcamp', etc..."
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
                          placeholder="i.e. 'Full Stack Bootcamp', etc..."
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
                <Button type="submit">Save changes</Button>
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
