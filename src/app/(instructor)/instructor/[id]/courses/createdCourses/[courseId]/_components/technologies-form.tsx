"use client";

import React from "react";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "./category-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const technologies = [
  "Who wants to learn.",
  "Want to understand concepts of this topic.",
  "If you are a enthusiast of subject.",
];

const formSchema = z.object({
  technologies: z.string().array(),
});

export const TechnologiesForm = ({ course }: { course: Course }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [points, setPoints] = useState(course?.technologiesYouAreGoingToLearn || technologies);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      technologies: points,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/instructor/${course?.instructorID}/dashboard/courses/${course?.courseId}/attachments`,
        { newTechnologies: values.technologies }
      );
      toast.success("Course technologies updated ...");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = (index: any) => {
    const updatedPoints = [...points]; // Create a copy of the array
    updatedPoints.splice(index, 1); // Remove the point at the specified index
    setPoints(updatedPoints);
  };
2
  return (
    <div className="mt-6 border bg-slate-100 dark:bg-zinc-700 rounded-2xl p-4">
      <div className="font-medium flex items-center justify-between mb-2">
        Technologies you will learn
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a point
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {technologies!.length === 0 && (
            <p className="text-sm mt-2 text-gray-500 dark:text-gray-400 italic">
              No points yet
            </p>
          )}

          {points.length > 0 && (
            <div className="space-y-2">
              {/* initialData?.attachments  */}
              {points.map((point: string, index: any) => (
                <div
                  key={index}
                  className="flex items-center p-3 w-full bg-sky-100 dark:bg-zinc-800 border-sky-200 dark:border-none border text-sky-700 dark:text-gray-100 rounded-xl"
                >
                  <Pencil className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-[12px] line-clamp-1">{point}</p>
                  {deletingId === index && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== index && (
                    <button
                      onClick={() => onDelete(index)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={() => form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="technologies"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      className="dark:bg-zinc-800"

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
