"use client";

import React from "react";
import { Course } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type PublishCourseFormProps = {
  course: Course;
};

const formSchema = z.object({
  isPublished: z.boolean(),
});

const PublishCourseForm = ({ course }: PublishCourseFormProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPublished: course?.isPublished ?? true,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values) return;

    try {
      const updatedCourse = { ...course, isPublished: values.isPublished };
      // await updateCourse(updatedCourse);
      form.reset();
    } catch (error) {
      console.error("Error publishing course:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-2  md:space-y-0 md:flex-row justify-start md:justify-end items-start md:items-center space-x-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <div className="">
                <FormItem className="flex flex-col-reverse md:flex-row-reverse items-start md:items-center justify-start rounded-lg">
                  <FormControl>
                    <Switch
                      checked={field.value ?? true}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormLabel htmlFor="course-published">
                    Publish Course
                  </FormLabel>
                </FormItem>
              </div>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default PublishCourseForm;
