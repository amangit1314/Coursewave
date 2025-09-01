"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Chapter, Course, CourseSection } from "@prisma/client";

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
import { SectionsList } from "./sections-list";

interface SectionsFormProps {
  initialData: Course & { sections: CourseSection[] } & { chapters: Chapter[] };
  course: Course;
  sections: CourseSection[];
  chapters: Chapter[];
}

const formSchema = z.object({
  sectionNumber: z.string(),
  title: z.string(),
  sectionDescription: z.string(),
});

export const SectionsForm = ({
  initialData,
  course,
  sections,
  chapters,
}: SectionsFormProps) => {
  const params = useParams();
  const courseId = course.courseId;

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      sectionNumber: "",
      sectionDescription: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const sectionNumber = Number(values.sectionNumber);
      await axios.post(
        `/api/instructor/${course.instructorID}/dashboard/courses/${courseId}/sections`,
        {
          courseSectionTitle: values.title,
          courseSectionNumber: sectionNumber,
          courseSectionDescription: values.sectionDescription,
        },
      );
      toast.success("Section created successfully ...");
      toggleCreating();
      router.refresh();
    } catch (err: any) {
      console.log("Error: ", err.message);
      toast.error("Something went wrong");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      });
      toast.success("Chapters reordered");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(
      `api/instructor/${course.instructorID}/dashboard/courses/${courseId}/chapters/${id}`,
    );
  };

  // console.log("Course in sections form: ", course);
  // console.log("sections in sections form: ", sections);
  // console.log("chapters in sections form: ", chapters);

  return (
    <div className="relative mt-6 w-full rounded-2xl border bg-slate-100 p-4 dark:bg-zinc-700">
      {isUpdating && (
        <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center rounded-xl bg-slate-500/20">
          <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
        </div>
      )}

      <div className="flex items-center justify-between font-medium">
        Course sections
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a section
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
              name="sectionNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="sectionDescription"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'This is an introduction section where we will introduce the course & the instructor ...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="dark:bg-zinc-800" type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div
          className={cn(
            "mt-2 text-sm",
            !initialData?.sections?.length &&
              "italic text-gray-500 dark:text-gray-400",
          )}
        >
          {!sections && "No sections"}

          {/* sections */}
          <SectionsList
            course={course}
            chapters={chapters || []}
            onEdit={onEdit}
            onReorder={onReorder}
            items={sections || []}
          />
        </div>
      )}

      {!isCreating && (
        <p className="mt-4 text-xs text-muted-foreground">
          Drag and drop to reorder the sections
        </p>
      )}
    </div>
  );
};
