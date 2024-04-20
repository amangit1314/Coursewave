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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useUserInfo from "@/hooks/use-user-info";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";

interface InstructorNameFormProps {
  course: Course;
}

const formSchema = z.object({
  instructorName: z.string().min(1, {
    message: "Instructor Name is required ...",
  }),
});

export const InstructorNameForm = ({
  course,
}: InstructorNameFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  // const user = useUserInfo();
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/instructor/${course.instructorID}/dashboard/courses/${course.courseId}`,
        { newInstructorName: values.instructorName }
      );
      toast.success("Course instructor name updated ...");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 dark:bg-zinc-700 rounded-2xl p-4">
      <div className="font-medium flex items-center justify-between">
        Instructor Name
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit instructor name
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !course?.courseCreator &&
            "text-gray-500 dark:text-gray-400 italic"
          )}
        >
          {course?.courseCreator || "No istructor name"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="instructorName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      className="dark:bg-zinc-800"
                      placeholder="e.g. 'Advanced web development'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                className="dark:bg-zinc-800 dark:text-white"
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
