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
import { cn } from "@/lib/utils/utils";
import { Course } from "@/types/course";

interface InstructorNameFormProps {
  course: Course;
}

const formSchema = z.object({
  instructorName: z.string().min(1, {
    message: "Instructor Name is required ...",
  }),
});

export const InstructorNameForm = ({ course }: InstructorNameFormProps) => {
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
        `api/instructor/${course.instructorId}/dashboard/courses/${course.id}`,
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
    <div className="mt-6 rounded-2xl border bg-slate-100 p-4 dark:bg-zinc-700">
      <div className="flex items-center justify-between font-medium">
        Instructor Name
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit instructor name
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            "mt-2 text-sm",
            !course?.instructor?.user?.name &&
              "italic text-gray-500 dark:text-gray-400"
          )}
        >
          {course?.instructor?.user?.name || "No istructor name"}
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
