"use client";

import React from "react";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@/types/course";

const whatYouWillLearn = [
  "Who wants to learn.",
  "Want to understand concepts of this topic.",
  "If you are a enthusiast of subject.",
];

const formSchema = z.object({
  whatYouWillLearn: z.string().array(),
});

export const WhatYouWillLearnForm = ({ course }: { course: Course }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [points, setPoints] = useState(
    course?.learningOutcomes || whatYouWillLearn,
  );

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whatYouWillLearn: points,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `api/instructor/${course?.instructorId}/dashboard/courses/${course?.id}/attachments`,
        { newWhatYouWillLearnPoints: values.whatYouWillLearn },
      );
      toast.success("Course whatYouWillLearn updated ...");
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

  return (
    <div className="mt-6 rounded-2xl border bg-slate-100 p-4 dark:bg-zinc-700">
      <div className="mb-2 flex items-center justify-between font-medium">
        What you will learn?
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a point
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {whatYouWillLearn!.length === 0 && (
            <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">
              No points yet
            </p>
          )}

          {points.length > 0 && (
            <div className="space-y-2">
              {/* initialData?.attachments  */}
              {points.map((point: string, index: any) => (
                <div
                  key={index}
                  className="flex w-full items-center rounded-xl border border-sky-200 bg-sky-100 p-3 text-sky-700 dark:border-none dark:bg-zinc-800 dark:text-gray-100"
                >
                  <Pencil className="mr-2 h-4 w-4 flex-shrink-0" />
                  <p className="line-clamp-1 text-[12px]">{point}</p>
                  {deletingId === index && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== index && (
                    <button
                      onClick={() => onDelete(index)}
                      className="ml-auto transition hover:opacity-75"
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
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="whatYouWillLearn"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="dark:bg-zinc-800">
                    {/* TODO: implement this like the course attachments */}
                    {/* <Combobox {...field} /> */}
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
