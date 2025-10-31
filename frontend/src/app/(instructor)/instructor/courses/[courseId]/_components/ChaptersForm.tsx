"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { Input } from "@/components/ui/input";

import { ChaptersList } from "./ChaptersList";
import { Course } from "@/types/course";
import { Chapter } from "@/types/course-details-api-response";
// import { CourseSection } from "@/types/courses.service.types";
import { CourseSection } from "@/types/course-details-api-response";
import { dmSans } from "@/lib/config/fonts";

interface ChaptersFormProps {
  course: Course;
  section: CourseSection;
  chapters: Chapter[];
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const ChaptersForm = ({
  course,
  section,
  chapters,
}: ChaptersFormProps) => {
  const courseId = course.id;
  const instructorId = course.instructorId;

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = (sectionId: string) => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `api/instructor/${instructorId}/dashboard/courses/${courseId}/sections/${section.id}/chapters`,
        { chapterTitle: values.title }
      );
      toast.success("Chapter created");
      toggleCreating(section.id);
      router.refresh();
    } catch (err: any) {
      console.log("Error in creating chapter: ", err.message);
      toast.error(`Something went wrong, ${err.message}`);
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(
        `api/instructor/${instructorId}/dashboard/courses/${courseId}/sections/${section.id}/chapters/reorder`,
        {
          list: updateData,
        }
      );
      toast.success("Chapters reordered");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative mt-2 rounded-2xl border border-none bg-slate-100 p-4 dark:bg-zinc-900">
      {isUpdating && (
        <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center rounded-xl bg-slate-500/20">
          <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
        </div>
      )}

      <div className="flex items-center justify-between font-medium not-italic">
        <p
          className={`${dmSans.className} text-lg font-medium dark:text-white`}
        >
          {" "}
          Section chapters
        </p>
        <Button
          onClick={() => toggleCreating(section.id)}
          variant="outline"
          className={`${dmSans.className} rounded-full`}
        >
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              <p className="text-sm dark:text-white">Add a chapter</p>
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="dark:bg-zinc-950"
              disabled={!isValid || isSubmitting}
              type="submit"
            >
              Create
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div
          className={cn(
            "mt-4 text-sm",
            !chapters?.length && "italic text-gray-500 dark:text-gray-400"
          )}
        >
          {!chapters?.length && "No chapters"}
          <ChaptersList
            instructorId={course.instructorId!}
            onReorder={onReorder}
            items={chapters ?? []}
          />
        </div>
      )}

      {!isCreating && (
        <p className="mt-4 text-xs not-italic text-muted-foreground">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};