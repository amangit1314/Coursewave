"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@/types/course";
import { dmSans } from "@/lib/config/fonts";
import { useUpdateCourse } from "@/hooks/useCourses";

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

export const DescriptionForm = ({ course }: { course: Course }) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();
  const { mutate: updateCourse } = useUpdateCourse();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: course?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    try {
      updateCourse(
        { courseId: course.id, updates: values },
        {
          onSuccess: () => {
            toast.success("course description updated successfully ...");
            toggleEdit();
            router.refresh();
          },
          onError: (error) => {
            toast.error(error.message || "Something went wrong ...");
          },
        }
      );
    } catch {
      toast.error("Something went wrong ...");
    }
  };

  return (
    // border
    <div className="mt-6 rounded-2xl  bg-slate-100 p-4 dark:bg-zinc-900">
      <div
        className={`${dmSans.className} flex items-center justify-between font-medium`}
      >
        Course description
        <Button onClick={toggleEdit} variant="outline" className="rounded-full">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "mt-2 line-clamp-6 text-sm",
            !course.description && "italic text-gray-500 dark:text-gray-400"
            //  : "text-md text-base font-semibold"
          )}
        >
          {course?.description || "No description"}
        </p>
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
                    <Textarea
                      className="dark:bg-zinc-900 p-4"
                      disabled={isSubmitting}
                      placeholder="e.g. 'This course is about...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                className="dark:bg-zinc-950 dark:text-white"
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
