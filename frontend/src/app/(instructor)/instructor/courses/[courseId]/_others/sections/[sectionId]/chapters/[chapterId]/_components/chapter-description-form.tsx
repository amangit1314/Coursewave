"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { Editor } from "@/components/react-quill-editor";
import { Preview } from "@/components/preview";

interface ChapterDescriptionFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
  instructorId: string;
}

const formSchema = z.object({
  description: z.string().min(1),
});

export const ChapterDescriptionForm = ({
  initialData,
  courseId,
  chapterId,
  instructorId,
}: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });
  const sectionId = initialData.courseSectionId;

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `api/instructor/${instructorId}/dashboard/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}`,
        values,
      );
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 rounded-xl border bg-slate-100 p-4 transition-all duration-300 dark:bg-zinc-800 md:mt-0">
      <div className="flex items-center justify-between font-medium">
      <h3 className="text-zinc-800 dark:text-white tracking-tight font-semibold"> Chapter description </h3>
    
        <Button onClick={toggleEdit} variant="ghost" className="hover:bg-white dark:hover:bg-black dark:hover:text-white transition-all duration-100 overflow-hidden">
          {isEditing ? (
              // <div className="text-red-600 bg-red-300 rounded-md px-4 py-2 hover:bg-red-600 hover:text-white border border-stroke border-red-600 hover:border-transparent">Cancel</div>
          <div className="text-red-600">Cancel</div>
          ) : (
            <div className="flex justify-end group-hover:justify-center items-center text-zinc-800 dark:text-gray-200">
              <Pencil className="mr-2 h-4 w-4" />
              Edit description
            </div>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            "mt-2 text-sm",
            !initialData.description &&
              "italic text-slate-500 dark:text-gray-400",
          )}
        >
          {!initialData.description && "No description"}
          {initialData.description && (
            <Preview value={initialData.description} />
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
