"use client";

import { IconBadge } from "@/components/icon-badge";
import {
  CircleDollarSign,
  Eye,
  LayoutDashboard,
  ListChecks,
  Video,
} from "lucide-react";
import React, { useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Chapter, Course, Category, CourseAttachment } from "@prisma/client";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { ChaptersForm } from "./_components/chapters-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";

const CourseIdPage = ({ params }: { params: { courseId: string } }) => {
  const [loading, setLoading] = React.useState(false);
  const [chapters, setChapters] = React.useState<Chapter[]>([]);
  const [course, setCourse] = React.useState<Course>();
  const [error, setError] = React.useState<string | null>();

  useEffect(() => {
    const courseId = params.courseId;

    const fetchChapters = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses/${courseId}/chapters`);

        if (!res.ok) {
          setError("Failed to fetch course chapters ...");
        }

        const data = await res.json();
        setChapters(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses/${courseId}`);

        if (!res.ok) {
          setError("Failed to fetch course details ...");
        }

        const data = await res.json();
        setCourse(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [params.courseId]);

  return (
    <div className="py-20 px-8">
      <div className="flex cursor-pointer hover:underline justify-start items-center text-xs space-x-2">
        <IoMdArrowRoundBack className="text-black dark:text-white" size={16} />
        <p>Back to created courses</p>
      </div>

      <div className="py-5">
        <p className="text-gray-900 text-md font-semibold">Edit Course</p>

        <p className="text-xs">
          Edit course details or add a new course section & chapter
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-md font-medium">Customize your course</h2>
          </div>
          <TitleForm
            initialData={{ title: course?.courseTitle! }}
            courseId={params.courseId}
          />
          <DescriptionForm initialData={course!} courseId={params.courseId} />
          <ImageForm initialData={course!} courseId={params.courseId} />
          <CategoryForm
            initialData={course!}
            courseId={params.courseId}
            options={
              course?.courseCategories?.map((category: string) => ({
                label: category,
                value: category,
              })) || []
            }
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-md font-medium">Course chapters</h2>
            </div>
            <ChaptersForm
              initialData={course as Course & { chapters: Chapter[] }}
              courseId={params.courseId}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-md font-medium">Sell your course</h2>
            </div>
            <PriceForm initialData={course!} courseId={params.courseId} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              {/* <IconBadge icon={File} /> */}
              <h2 className="text-md font-medium">Resources & Attachments</h2>
            </div>
            <AttachmentForm
              initialData={
                course as Course & { attachments: CourseAttachment[] }
              }
              courseId={params.courseId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
