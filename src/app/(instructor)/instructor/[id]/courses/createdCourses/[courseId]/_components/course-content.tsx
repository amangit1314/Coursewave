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
import { IconBadge } from "./icon-badge";
import PublishCourseForm from "./course-publish-form";
// import PublisCourseForm from "./_components/course-publish-form";

type CourseContentProps = {
  course: Course;
  courseAttachments: CourseAttachment[];
  sections: CourseSection[];
  chapters: Chapter[];
};

export default function CourseContent({
  course,
  sections,
  chapters,
  courseAttachments,
}: CourseContentProps) {
  // console.log("Course sections in couse content: ", sections);
  // console.log("Course sections in couse content: ", chapters);

  return (
    <div className="space-y-8 px-8 py-20 dark:bg-zinc-900">
      <div className="flex cursor-pointer items-center justify-start space-x-2 text-sm hover:underline">
        <IoMdArrowRoundBack className="text-black dark:text-white" size={16} />
        <p>Back to created courses</p>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className=" ">
          <p className="text-md text-base font-semibold text-zinc-900 dark:text-white">
            Edit Course
          </p>
          <p className="text-sm">
            Edit course details or add a new course section & chapter
          </p>
        </div>
        <PublishCourseForm course={course} />
      </div>

      {/* forms grid */}
      <div className="grid grid-cols-1 gap-6 overflow-hidden rounded-3xl p-6 dark:bg-zinc-800 md:grid-cols-2">
        {/* first col for forms */}
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-md font-medium text-zinc-800 dark:text-white">
              Customize your course
            </h2>
          </div>

          {/* title form, DONE ✔️ */}
          <TitleForm course={course} />

          {/* description form, DONE ✔️ */}
          <DescriptionForm course={course} />

          {/* image form, DONE ✔️ */}
          <ImageForm course={course} />

          {/* instructor name form, DONE ✔️ */}
          <InstructorNameForm course={course} />

          {/*TODO:  category form */}
          <div>
            <div className="mt-6 flex items-center gap-x-2">
              <IconBadge icon={Shapes} />
              <h2 className="text-md font-medium text-zinc-800 dark:text-white">
                Course Categories
              </h2>
            </div>
            <CategoryForm course={course} />
          </div>

          {/* price form, DONE ✔️ */}
          <div className="mt-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-md font-medium text-zinc-800 dark:text-white">
                Sell your course
              </h2>
            </div>

            {/* price form */}
            <PriceForm initialData={course} courseId={course.courseId} />
          </div>

          {/* Attachments form */}
          <div className="mt-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-md font-medium text-zinc-800 dark:text-white">
                Resources & Attachments
              </h2>
            </div>

            {/* attachments form */}
            <AttachmentForm
              course={course}
              courseAttachmentsPoints={courseAttachments}
            />
          </div>
        </div>

        {/* second col for forms */}
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Highlighter} />
            <h2 className="text-md font-medium text-zinc-800 dark:text-white">
              Course Requirements & Perks
            </h2>
          </div>

          {/* prerequisits form, DONE ✔️ */}
          <PrerequisitsForm course={course} />

          {/* this course is for form, DONE ✔️*/}
          <ThisCourseIsForForm course={course} />

          {/* technologies form, DONE ✔️ */}
          <TechnologiesForm course={course} />

          {/* what you will learn form, DONE ✔️ */}
          <WhatYouWillLearnForm course={course} />
        </div>
      </div>

      {/* sections ans chapters, DONE ✔️ */}
      <div className="grid grid-cols-1 gap-6 overflow-hidden rounded-3xl p-6 dark:bg-zinc-800">
        {/*  chapters form */}
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={ListChecks} />
            <h2 className="text-md font-medium text-zinc-800 dark:text-white">
              Course Sections & Chapters
            </h2>
          </div>

          <SectionsForm
            initialData={
              course as Course & { sections: CourseSection[] } & {
                chapters: Chapter[];
              }
            }
            course={course}
            chapters={chapters}
            sections={sections}
          />
        </div>
      </div>
    </div>
  );
}
