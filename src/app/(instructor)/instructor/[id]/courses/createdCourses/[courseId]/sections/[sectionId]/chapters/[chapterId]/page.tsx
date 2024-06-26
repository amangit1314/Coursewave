import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { ChapterActions } from "./_components/chapter-actions";
import { ArrowLeft } from "lucide-react";
import { Callout } from "@tremor/react";

const ChapterEditPage = async ({
  params,
}: {
  params: {
    id: string;
    courseId: string;
    sectionId: string;
    chapterId: string;
  };
}) => {
  const instructorId = params?.id;
  const courseId = params?.courseId;
  const sectionId = params?.sectionId;
  const chapterId = params?.chapterId;

  const instructor = await db.instructor.findUnique({
    where: {
      instructorID: instructorId,
    },
  });

  if (!instructor) {
    return redirect("/browseCourses");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId,
      courseSectionId: sectionId,
    },
    include: {
      CloudinaryData: true,
    },
  });

  if (!chapter) {
    toast.error("No chapter found with this id ...");
    <Toaster />;
    return redirect(
      `/instructor/${instructorId}/courses/createdCourses/${courseId}`
    );
  }

  const chapterWithCloudinaryData = {
    ...chapter,
    id: chapter?.CloudinaryData?.id!,
    cloudName: chapter?.CloudinaryData?.cloudName!,
    publicId: chapter?.CloudinaryData?.publicId!,
    courseId: chapter?.CloudinaryData?.courseId!,
    chapterId: chapter?.CloudinaryData?.chapterId!,
    createdAt: chapter?.CloudinaryData?.createdAt!,
    updatedAt: chapter?.CloudinaryData?.updatedAt!,
  };

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="pt-[80px] px-8">
      <div>
        {!chapter.isPublished && (
          <Callout
            color="yellow"
            title="⚠️ This chapter is unpublished. It will not be visible in the course ..."
          />
        )}

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <Link
                href={``}
                className="flex items-center text-sm hover:opacity-75 transition mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to course setup
              </Link>
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-y-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-zinc-800 dark:text-white">
                    Chapter Creation
                  </h1>
                  <span className="text-sm text-slate-700 dark:text-gray-300">
                    Complete all fields {completionText}
                  </span>
                </div>
                <ChapterActions
                  disabled={!isComplete}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                  isPublished={chapter.isPublished}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-x-2">
                  <h2 className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-white">
                    Customize your chapter
                  </h2>
                </div>

                <ChapterTitleForm
                  initialData={chapter}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                />

                <ChapterDescriptionForm
                  initialData={chapter}
                  instructorId={instructorId}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-x-2">
                  <h2 className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-white">
                    Access Settings
                  </h2>
                </div>
                <ChapterAccessForm
                  initialData={chapter}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-x-2">
                <h2 className="text-xl font-semibold tracking-tight  text-zinc-800 dark:text-white">
                  Add a video
                </h2>
              </div>

              <ChapterVideoForm
                chapterWithCloudinaryData={chapterWithCloudinaryData}
                instructorId={instructorId}
                // sectionId={sectionId}
                // chapterId={chapterId}
                // courseId={courseId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterEditPage;
