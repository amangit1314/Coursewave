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
import { TitleForm } from "./TitleForm";
import { DescriptionForm } from "./DescriptionForm";
import { ImageForm } from "./ImageForm";
import { CategoryForm } from "./CategoryForm";
import { ChaptersForm } from "./ChaptersForm";
import { PriceForm } from "./PriceForm";
import { AttachmentForm } from "./AttachmentForm";
import { InstructorNameForm } from "./InstructorNameForm";
import { ThisCourseIsForForm } from "./ThisCourseIsForForm";
import { TechnologiesForm } from "./TechnologiesForm";
import { WhatYouWillLearnForm } from "./WhatYouWillLearnForm";
import PrerequisitsForm from "./PrerequisitsForm";
import { SectionsForm } from "./SectionsForm";
import { IconBadge } from "./IconBadge";
import PublishCourseForm from "./PublishCourseForm";
import { Course } from "@/types/course";
import { Chapter } from "@/types/user-enrollments-api-response";
import { CourseSection } from "@/types/course-details-api-response";
import { dmSans } from "@/lib/config/fonts";

type CourseContentProps = {
  course: Course;
  // sections: CourseSection[];
  // chapters: Chapter[];
};

export default function CourseContent({
  course,
  // sections,
  // chapters,
}: CourseContentProps) {
  // console.log("Course sections in couse content: ", sections);
  // console.log("Course sections in couse content: ", chapters);

  return (
    <div className="space-y-8 px-8 py-8 dark:bg-zinc-900">
      <div
        className={`${dmSans.className} flex cursor-pointer items-center justify-start space-x-2 text-sm hover:underline`}
      >
        <IoMdArrowRoundBack className="text-black dark:text-white" size={16} />
        <p>Back to created courses</p>
      </div>

      <div className="flex items-center justify-between">
        <div className=" ">
          <p
            className={`${dmSans.className} text-lg font-semibold text-zinc-900 dark:text-white`}
          >
            Edit Course
          </p>
          <p className="text-sm">
            Edit course details or add a new course section & chapter
          </p>
        </div>
        <PublishCourseForm course={course} />
      </div>

      {/* forms grid */}
      <div className="grid grid-cols-1 gap-6 overflow-hidden rounded-3xl p-6 bg-gray-50 dark:bg-zinc-800 md:grid-cols-2">
        {/* first col for forms */}
        <div>
          <div className={`${dmSans.className} flex items-center gap-x-2`}>
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

          {/*category form */}
          <div>
            <div
              className={`${dmSans.className} mt-6 flex items-center gap-x-2`}
            >
              <IconBadge icon={Shapes} />
              <h2 className="text-md font-medium text-zinc-800 dark:text-white">
                Course Categories
              </h2>
            </div>
            <CategoryForm course={course} />
          </div>

          {/* price form, DONE ✔️ */}
          <div className="mt-6">
            <div className={`${dmSans.className} flex items-center gap-x-2`}>
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-md font-medium text-zinc-800 dark:text-white">
                Sell your course
              </h2>
            </div>

            {/* price form */}
            <PriceForm initialData={course} courseId={course.id} />
          </div>

          {/* Attachments form */}
          <div className="mt-6">
            <div className={`${dmSans.className} flex items-center gap-x-2`}>
              <IconBadge icon={File} />
              <h2 className="text-md font-medium text-zinc-800 dark:text-white">
                Resources & Attachments
              </h2>
            </div>

            {/* attachments form */}
            <AttachmentForm course={course} />
          </div>
        </div>

        {/* second col for forms */}
        <div className="space-y-6">
          <div className={`${dmSans.className} flex items-center gap-x-2`}>
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
      <div className="grid grid-cols-1 gap-6 overflow-hidden rounded-3xl p-6 bg-gray-50 dark:bg-zinc-800">
        {/*  chapters form */}
        <div>
          <div className={`${dmSans.className} flex items-center gap-x-2`}>
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
            // chapters={chapters}
            // sections={sections}
          />
        </div>
      </div>
    </div>
  );
}
