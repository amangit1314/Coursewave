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
import { cn } from "@/utils/utils";
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
        }
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

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
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
      `/api/instructor/${course.instructorID}/dashboard/courses/${courseId}/chapters/${id}`
    );
  };

  // console.log("Course in sections form: ", course);
  // console.log("sections in sections form: ", sections);
  // console.log("chapters in sections form: ", chapters);

  return (
    <div className="relative mt-6 border bg-slate-100 dark:bg-zinc-700 rounded-2xl p-4 w-full">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-xl flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}

      <div className="font-medium flex items-center justify-between">
        Course sections
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a section
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
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
            "text-sm mt-2",
            !initialData?.sections?.length &&
              "text-gray-500 dark:text-gray-400 italic"
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
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the sections
        </p>
      )}
    </div>
  );
};
