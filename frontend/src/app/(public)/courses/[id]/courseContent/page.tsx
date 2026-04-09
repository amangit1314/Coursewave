"use client";

import React from "react";

import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CourseProgress } from "@/components/CourseProgress";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import { useUserStore } from "@/zustand/userStore";
import { useCourse } from "@/hooks/useCourses";
import { Course } from "@/types/course";
import { Callout } from "@tremor/react";

import UserAvatar from "@/components/common/UserAvatar";
import VideoSummary from "./_components/VideoSummary";
import CourseAttachments from "./_components/CourseAttachments";
import CourseNotes from "./_components/CourseNotes";
import CourseContentInstructorCard from "./_components/CourseContentInstructorCard";
import CourseSectionsAndChapters from "./_components/CourseSectionsAndChapters";
import { useCoursesStore } from "@/zustand/coursesStore";

// import CourseVideo from "./_components/CourseVideoNew";

const CourseContentPage = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const { user } = useUserStore();
  const userId = user?.id;

  const {
    data: courseData,
    isLoading: isCourseLoading,
    error: courseError,
  } = useCourse(courseId);
  // const course = courseData?.data ?? ({} as Course);
  const course = courseData;

  // Ensure sections is always an array
  const sections = Array.isArray((course as any)?.sections)
    ? (course as any).sections
    : [];

  // // Track active section and chapter
  // const [activeSectionIndex, setActiveSectionIndex] = React.useState(0);
  // const [activeChapterIndex, setActiveChapterIndex] = React.useState(0);

  // // Get the active chapter based on section/chapter index
  // const activeSection = sections[activeSectionIndex];
  // const activeChapter = activeSection?.chapters?.[activeChapterIndex];
  // const aboutChapter =
  //   activeChapter?.description || "No chapter description available.";

  const activeSection = useCoursesStore((state) => state.getActiveSection());
  const activeChapter = useCoursesStore((state) => state.getActiveChapter());
  const aboutChapter = useCoursesStore((state) => state.getAboutChapter());

  // todo: implement all loadings
  if (isCourseLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // todo: implement all error
  if (courseError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Callout title="Error loading course" color="red">
          {courseError.message}
        </Callout>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Callout title="Authentication Required" color="red">
          Please sign in to access this course content.
        </Callout>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Callout title="Course Not Found" color="yellow">
          The requested course could not be loaded.
        </Callout>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-80 flex-col overflow-y-auto border-r bg-white px-4 py-6 dark:bg-zinc-900 md:flex">
        <Tabs defaultValue="chapters" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger
              value="chapters"
              className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:rounded-md"
            >
              Chapters
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:rounded-md"
            >
              Notes
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:rounded-md"
            >
              Resources
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chapters">
            <CourseSectionsAndChapters
              sections={sections}
            // activeSectionIndex={activeSectionIndex}
            // setActiveSectionIndex={setActiveSectionIndex}
            // activeChapterIndex={activeChapterIndex}
            // setActiveChapterIndex={setActiveChapterIndex}
            // chaptersError={loadingState.error}
            />
          </TabsContent>
          <TabsContent value="notes">
            <CourseNotes />
          </TabsContent>
          <TabsContent value="resources">
            <CourseAttachments />
          </TabsContent>
        </Tabs>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
        {/* Header */}
        <div className="sticky top-0 z-10 flex w-full items-center justify-between bg-white py-2 dark:bg-zinc-900">
          <div className="text-xl font-bold text-blue-500 truncate max-w-[60%]">
            {course.title}
          </div>
          <div className="flex items-center space-x-3">
            <CourseProgress value={79} />
            <ThemeModeToggle />
            <UserAvatar />
          </div>
        </div>

        <div className="mx-auto mt-4 w-full max-w-4xl space-y-6">
          {/* <CourseVideo chapter={sections?.[0]?.chapters?.[0] ?? null} /> */}
          <VideoSummary
            chapterId={sections?.[0]?.chapters?.[0]?.id || ""}
            chapterTitle={sections?.[0]?.chapters?.[0]?.title || ""}
          />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              About this Class
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {aboutChapter || "No description provided."}
            </p>
          </div>
          <div>
            {/* <CourseContentInstructorCard instructor={course.instructor} /> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseContentPage;
