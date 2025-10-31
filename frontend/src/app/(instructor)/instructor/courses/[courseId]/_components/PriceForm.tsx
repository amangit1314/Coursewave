"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
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
import { formatPrice } from "@/lib/utils/format";
import { Course } from "@/types/course";
import { dmSans } from "@/lib/config/fonts";
import { useUpdateCourse } from "@/hooks/useCourses";

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();
  const { mutate: updateCourse } = useUpdateCourse();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: Number(initialData?.price) || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      updateCourse(
        {
          courseId: courseId,
          updates: values,
        },
        {
          onSuccess: (updatedCourse) => {
            toast.success("Course price updated successfully ✔️");
            toggleEdit();
            router.refresh();
          },
          onError: (error) => {
            toast.error(error.message || "Something went wrong ❌");
          },
        }
      );
    } catch {
      toast.error("Something went wrong ❌");
    }
  };

  return (
    // border
    <div className="mt-6 rounded-2xl  bg-slate-100 p-4 dark:bg-zinc-900">
      <Toaster />
      <div
        className={`${dmSans.className} flex items-center justify-between font-medium`}
      >
        Course price
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
            "mt-2 text-sm",
            !Number(initialData?.price) &&
              "italic text-gray-500 dark:text-gray-400"
          )}
        >
          {Number(initialData?.price)
            ? formatPrice(Number(initialData?.price!), "USD")
            : "No price"}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="dark:bg-transparent"
                      type="number"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="Set a price for your course"
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
