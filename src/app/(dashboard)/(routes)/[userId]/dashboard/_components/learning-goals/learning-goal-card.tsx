import { Checkbox } from "@/components/ui/checkbox";
import { useZustandStore } from "@/zustand/store";
import { EllipsisVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

// const LearningGoalCardDropdownMenu = ({
//   learningGoal,
// }: {
//   learningGoal: LearningGoal;
// }) => {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <EllipsisVertical size={16} />
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="">
//         <EditLearningGoal learningGoal={learningGoal} />
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

const formSchema = z.object({
  title: z.string().optional(),
  tag: z.string().optional(),
  time: z.string().optional(),
  isDone: z.boolean().optional(),
});

const EditLearningGoal = ({ learningGoal }: { learningGoal: LearningGoal }) => {
  const { editLearningGoal } = useZustandStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: learningGoal.title,
      tag: learningGoal.tag,
      time:
        learningGoal.time instanceof Date
          ? learningGoal.time.toISOString()
          : learningGoal.time,
      isDone: learningGoal.isDone,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    editLearningGoal(
      learningGoal.id,
      values.title ?? learningGoal.title,
      values.tag ?? learningGoal.tag,
      values.time ?? learningGoal.time.toString()
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Pencil className="mr-2 h-4 w-4 cursor-pointer transition-all duration-100 hover:text-blue-500" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
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
                        placeholder={learningGoal.title}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="">
                      What goal you will set?
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
                        placeholder={learningGoal.tag}
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
                        placeholder={learningGoal.time.toString()}
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
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

type LearningGoal = {
  id: string;
  title: string;
  tag: string;
  time: Date | string;
  isDone: boolean;
};

const LearningGoalCard = ({ learningGoal }: { learningGoal: LearningGoal }) => {
  const { markLearningGoalAsDone } = useZustandStore();
  const [isDone, setIsDone] = useState<boolean>(false);

  const markGoalAsCompleted = () => {
    setIsDone(!isDone);
    markLearningGoalAsDone(learningGoal.id, isDone);
  };

  return (
    <div className="flex justify-between items-center ">
      <div className="flex justify-start items-start space-x-2 ">
        <Checkbox
          className="mt-1"
          checked={learningGoal.isDone}
          onCheckedChange={markGoalAsCompleted}
        />
        <div className="">
          {learningGoal.isDone ? (
            <p className="text-sm transition-all line-through font-medium text-zinc-800 dark:text-gray-50 tracking-tight line-clamp-1">
              {learningGoal.title ?? "Task need to done"}
            </p>
          ) : (
            <p className="text-sm transition-all font-medium text-zinc-800 dark:text-gray-50 tracking-tight line-clamp-1">
              {learningGoal.title ?? "Task need to done"}
            </p>
          )}
          <div className="flex justify-start items-center space-x-2 line-clamp-1">
            <p className="text-xs font-thin text-gray-400 dark:text-gray-300 line-clamp-1">
              {learningGoal.tag ?? "Tag"}
            </p>

            <p className="text-xs border-l border-stroke font-medium pl-2 text-blue-500">
              {learningGoal.time.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* dropdown */}
      <EditLearningGoal learningGoal={learningGoal} />
    </div>
  );
};

export default LearningGoalCard;
