"use client";

import {
  CircleDollarSign,
  Eye,
  File,
  LayoutDashboard,
  ListChecks,
  Highlighter,
  Shapes,
  Video,
} from "lucide-react";
import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  Chapter,
  Course,
  Category,
  CourseAttachment,
  CourseSection,
} from "@prisma/client";
import { TitleForm } from "./title-form";
import { DescriptionForm } from "./description-form";
import { ImageForm } from "./image-form";
import { CategoryForm } from "./category-form";
import { ChaptersForm } from "./chapters-form";
import { PriceForm } from "./price-form";
import { AttachmentForm } from "./attachment-form";
import { Icon } from "@tremor/react";
import { InstructorNameForm } from "./instructor-name-form";
import { ThisCourseIsForForm } from "./this-course-is-for-form";
import { TechnologiesForm } from "./technologies-form";
import { WhatYouWillLearnForm } from "./what-you-will-learn-form";
import { PrerequisitsForm } from "./prerequisits-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SectionsForm } from "./sections-form";
import { CourseChaptersSkeleton } from "@/app/(course)/courses/[id]/courseContent/skeletons";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PublisCourseForm from "./_components/course-publish-form";

type PublishCourseFormProps = {
  course: Course;
};

const formSchema = z.object({
  isPublished: z.boolean().optional().default(true),
});

const PublishCourseForm = ({
  course,
}: PublishCourseFormProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { isPublished: course.isPublished },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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