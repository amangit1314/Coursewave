"use client";

import React from "react";
import ShowChapters from "./ShowChapters";
import CourseContentInstructorCard from "@/app/(public)/courses/[id]/courseContent/_components/CourseContentInstructorCard";
import CourseSectionsAndChapters from "./CourseSectionsAndChapters";
import CourseAttachments from "./CourseAttachments";
import { Callout } from "@tremor/react";
import { VideoPlayer } from "@/components/common/VideoPlayer";
import { FileText, HelpCircle, Video } from "lucide-react";
import LearningHeader from "./LearningHeader";
import AISummary from "./AiSummary";
import { Chapter, Instructor } from "@/types/course-details-api-response";
import CourseNotes from "./CourseNotes";
import { useCourse } from "@/hooks/useCourses";
import toast from "react-hot-toast";
import CourseContentScreenSkeleton from "@/app/(public)/courses/[id]/courseContent/_components/skeletons/CourseContentScreenSkeleton";
import { Section } from "@/types/course-details-api-response";

type CourseDetailsProps = {
  courseId: string;
};

const CourseDetails: React.FC<CourseDetailsProps> = ({ courseId }) => {
  const {
    data: courseData,
    isLoading: isCourseLoading,
    error: courseError,
  } = useCourse(courseId);

  // const course = courseData?.data;
  const course = courseData;

  const [activeChapterIndex, setActiveChapterIndex] = React.useState(0);
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  // Extract chapters from all sections
  const chapters = React.useMemo(() => {
    if (!course?.sections) return [];
    return course.sections.flatMap((section: Section) => section.Chapter || []);
  }, [course?.sections]);

  const activeChapter = chapters[activeChapterIndex];
  const aboutChapter =
    activeChapter?.description ||
    "Chapter details coming soon - we're working on it!";

  // Loading state
  const isLoading = isCourseLoading;

  if (isLoading) {
    return <CourseContentScreenSkeleton />;
  }

  if (courseError) {
    const errorMessage =
      courseError instanceof Error ? courseError.message : "Unknown error";

    if (
      errorMessage.includes("UNAUTHORIZED_ACCESS") ||
      errorMessage.includes("not enrolled")
    ) {
      toast.error("You're not enrolled in this course");
      // router.back();
      return null;
    }

    return (
      <div className="flex h-screen items-center justify-center">
        <Callout
          title="Failed to Fetch Course Info"
          className="rounded-md text-red-800 bg-red-100"
        >
          Error: {errorMessage}
        </Callout>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Callout
          title="Course Not Found"
          className="rounded-md text-yellow-800 bg-yellow-100"
        >
          The requested course could not be loaded.
        </Callout>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <LearningHeader title={course?.title || "Course"} />
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-start gap-8 px-4 md:flex-row md:px-6 lg:px-12">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Video + Actions */}
          <div className="space-y-4">
            {/* Mobile chapters button */}
            <div className="md:hidden">
              <ShowChapters
                chapters={chapters}
                activeChapterIndex={activeChapterIndex}
                setActiveChapterIndex={setActiveChapterIndex}
              />
            </div>

            {/* Video Player */}
            <section className="w-full rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md dark:bg-zinc-900/80 dark:border-zinc-700/50 dark:hover:border-zinc-600/50">
              {/* Header with Enhanced Styling */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-zinc-700/50">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-lg shadow-blue-500/25 dark:shadow-blue-900/30">
                  <Video size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                    Chapter Video
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                    {activeChapter
                      ? `Now playing: ${activeChapter.title}`
                      : "Select a chapter to start learning"}
                  </p>
                </div>
              </div>

              {/* Video Container with Enhanced Styling */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-50 via-transparent to-indigo-50 rounded-3xl opacity-60 blur-sm dark:from-blue-950/30 dark:to-indigo-950/30 -z-10" />

                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg dark:from-zinc-800 dark:to-zinc-900 border border-gray-200/50 dark:border-zinc-600/30">
                  {activeChapter ? (
                    <VideoPlayer
                      videoUrl={activeChapter.content?.videoUrl ?? ""}
                      chapterId={activeChapter.id}
                    />
                  ) : (
                    /* Enhanced Empty State */
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <div className="rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 p-4 mb-4 shadow-inner dark:from-zinc-700 dark:to-zinc-800">
                        <Video
                          size={32}
                          className="text-gray-400 dark:text-zinc-500"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-600 dark:text-zinc-300 mb-2">
                        No Video Available
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-md">
                        Select a chapter from the course content to start
                        watching the video lesson.
                      </p>
                    </div>
                  )}
                </div>

                {/* Subtle Progress Indicator */}
                {activeChapter && (
                  <div className="flex items-center justify-between mt-4 px-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                      Current Chapter
                    </span>
                    <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                      {activeChapter.position !== undefined
                        ? `Chapter ${activeChapter.position + 1}`
                        : "Current"}
                    </span>
                  </div>
                )}
              </div>

              {/* Footer with Additional Info */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-zinc-700/50">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span>Ready to play</span>
                </div>
                {activeChapter && (
                  <div className="text-xs font-medium text-gray-600 dark:text-zinc-300">
                    HD • Auto-play
                  </div>
                )}
              </div>
            </section>

            {/* <DynamicContentSection activeChapter={activeChapter} /> */}

            {/* todo: Progress Button */}
            {/* {activeChapter && (
              <Button
                color="green"
                onClick={() => console.log("Mark progress")}
                className="w-full md:w-auto rounded-lg"
                disabled={activeChapter.isCompleted}
              >
                {activeChapter.isCompleted ? "Completed" : "Mark as Completed"}
              </Button>
            )} */}
          </div>

          {/* About Section */}
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">About This Class</h2>
              <p
                className={`text-zinc-700 dark:text-zinc-300 ${
                  showFullDescription ? "" : "line-clamp-4"
                }`}
              >
                {aboutChapter}
              </p>
              {aboutChapter.length > 250 && (
                <button
                  className="mt-2 text-sm font-medium text-blue-500 hover:underline"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "Show Less" : "Show More"}
                </button>
              )}
            </section>

            {/* AI Summary */}
            {activeChapter?.content?.videoUrl && (
              <AISummary videoUrl={activeChapter.content.videoUrl} />
            )}

            {/* Instructor */}
            <section>
              <h3 className="text-xl font-semibold mb-3">About Instructor</h3>
              <CourseContentInstructorCard
                courseId={courseId}
                instructor={{
                  ...(course.instructor as unknown as Instructor),
                  id: (course.instructor as any).userId,
                  websiteUrl:
                    (course.instructor as any).socialLinks?.website || "",
                }}
              />
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full md:max-w-sm lg:max-w-md space-y-8">
          {/* Chapters */}
          <div className="hidden md:block">
            <CourseSectionsAndChapters
              chapters={chapters}
              activeChapterIndex={activeChapterIndex}
              setActiveChapterIndex={setActiveChapterIndex}
              chaptersError={""}
            />
          </div>

          {/* Attachments */}
          <CourseAttachments courseId={courseId} />

          {/* Notes */}
          <CourseNotes />
        </aside>
      </div>
    </div>
  );
};

export default CourseDetails;

const TextContent = ({ content }: any) => (
  <div className="prose dark:prose-invert max-w-none p-6">
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </div>
);

const QuizContent = ({ quizData }: any) => (
  <div className="p-6 space-y-4">
    <h3 className="text-lg font-semibold mb-4">Quiz</h3>
    {quizData?.questions?.map((question: any, idx: number) => (
      <div key={idx} className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
        <p className="font-medium mb-2">{question.text}</p>
        <div className="space-y-2">
          {question.options?.map((option: any, optIdx: number) => (
            <label
              key={optIdx}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input type="radio" name={`question-${idx}`} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const DynamicContentSection = ({
  activeChapter,
}: {
  activeChapter: Chapter;
}) => {
  // Determine content type
  const contentType =
    activeChapter?.contentType || "video";

  // Get appropriate icon and title
  const getContentInfo = () => {
    switch (contentType.toLowerCase()) {
      case "text":
        return {
          icon: FileText,
          title: "Chapter Content",
          gradient: "from-emerald-500 to-teal-600",
          description: "Reading material",
        };
      case "quiz":
        return {
          icon: HelpCircle,
          title: "Chapter Quiz",
          gradient: "from-purple-500 to-pink-600",
          description: "Test your knowledge",
        };
      case "video":
      default:
        return {
          icon: Video,
          title: "Chapter Video",
          gradient: "from-blue-500 to-indigo-600",
          description: "Video lesson",
        };
    }
  };

  const contentInfo = getContentInfo();
  const IconComponent = contentInfo.icon;

  // Render content based on type
  const renderContent = () => {
    if (!activeChapter) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 p-4 mb-4 shadow-inner dark:from-zinc-700 dark:to-zinc-800">
            <IconComponent
              size={32}
              className="text-gray-400 dark:text-zinc-500"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-zinc-300 mb-2">
            No Content Available
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-md">
            Select a chapter from the course content to start learning.
          </p>
        </div>
      );
    }

    switch (contentType.toLowerCase()) {
      case "text":
        return (
          <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden border border-gray-200/50 dark:border-zinc-600/30">
            <TextContent
              content={
                activeChapter.content?.text ||
                activeChapter.content ||
                "No text content available."
              }
            />
          </div>
        );

      case "quiz":
        return (
          <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden border border-gray-200/50 dark:border-zinc-600/30">
            <QuizContent
              quizData={activeChapter.content?.quiz || activeChapter.content}
            />
          </div>
        );

      case "video":
      default:
        return (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg dark:from-zinc-800 dark:to-zinc-900 border border-gray-200/50 dark:border-zinc-600/30">
            <VideoPlayer
              videoUrl={
                activeChapter.content?.videoUrl || activeChapter.content || ""
              }
              chapterId={activeChapter.id}
            />
          </div>
        );
    }
  };

  return (
    <section className="w-full rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md dark:bg-zinc-900/80 dark:border-zinc-700/50 dark:hover:border-zinc-600/50">
      {/* Header with Enhanced Styling */}
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-zinc-700/50">
        <div
          className={`rounded-xl bg-gradient-to-br ${contentInfo.gradient} p-2 shadow-lg shadow-${contentInfo.gradient.split("-")[1]}-500/25`}
        >
          <IconComponent size={20} className="text-white" />
        </div>
        <div>
          <h2
            className={`text-xl font-bold bg-gradient-to-r ${contentInfo.gradient} bg-clip-text text-transparent dark:from-${contentInfo.gradient.split("-")[1]}-400 dark:to-${contentInfo.gradient.split("-")[3]}-400`}
          >
            {contentInfo.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            {activeChapter
              ? `${activeChapter.title} • ${contentInfo.description}`
              : "Select a chapter to start learning"}
          </p>
        </div>
      </div>

      {/* Content Container with Enhanced Styling */}
      <div className="relative">
        <div
          className={`absolute -inset-4 bg-gradient-to-br ${contentInfo.gradient.replace("from-", "from-").replace("to-", "to-").replace(/\d+/g, "50")} rounded-3xl opacity-60 blur-sm dark:opacity-30 -z-10`}
        />

        {renderContent()}

        {/* Progress Indicator */}
        {activeChapter && (
          <div className="flex items-center justify-between mt-4 px-2">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">
              Current Chapter
            </span>
            <span
              className={`text-xs font-semibold bg-gradient-to-r ${contentInfo.gradient} bg-clip-text text-transparent`}
            >
              {activeChapter.position !== undefined
                ? `Chapter ${activeChapter.position + 1}`
                : "Current"}
            </span>
          </div>
        )}
      </div>

      {/* Footer with Additional Info */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-zinc-700/50">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>
            Ready to{" "}
            {contentType === "video"
              ? "play"
              : contentType === "quiz"
                ? "start"
                : "read"}
          </span>
        </div>
        {activeChapter && (
          <div className="text-xs font-medium text-gray-600 dark:text-zinc-300 capitalize">
            {contentType} Content
          </div>
        )}
      </div>
    </section>
  );
};
