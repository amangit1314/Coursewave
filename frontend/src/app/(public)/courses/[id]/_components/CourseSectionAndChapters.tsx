"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Play,
  Lock,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  HelpCircle,
  Info,
  Clock,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { CourseSection } from "@/types/course-details-api-response";
import { useUserStore } from "@/zustand/userStore";
import { ErrorMessage } from "./ErrorMessage";
import { SampleCourseContent } from "./SampleCourseContent";
import { useCourse } from "@/hooks/useCourses";
import { cn } from "@/lib/utils/utils";
import { dmSans } from "@/lib/config/fonts";

export const CourseSectionsAndChapters = ({
  courseId,
  sections,
}: {
  courseId: string;
  sections?: CourseSection[];
}) => {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set()
  );
  const { user } = useUserStore();
  const { isLoading, error } = useCourse(courseId);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const isUserAuthenticated =
    user && user.id && user.id !== "null" && user.id !== "undefined";

  // Handle loading state
  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl dark:bg-zinc-900/90 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900 border-b border-gray-200 dark:border-zinc-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Course Content
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-32 mb-4" />
                <div className="space-y-3">
                  {[...Array(2)].map((_, j) => (
                    <div
                      key={`skeleton-${i}-${j}`}
                      className="flex items-center space-x-3"
                    >
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card className="border-0 shadow-xl dark:bg-zinc-900/90 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900 border-b border-gray-200 dark:border-zinc-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Course Content
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <ErrorMessage
            title="Failed to load course content"
            message={error.message}
          />
        </CardContent>
      </Card>
    );
  }

  // Handle empty or null sections - show sample content
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return <SampleCourseContent />;
  }

  // Calculate totals safely
  const totalLessons = sections.reduce((total, section) => {
    const lessonCount = Array.isArray(section.Chapter)
      ? section.Chapter.length
      : 0;
    return total + lessonCount;
  }, 0);

  const freeLessons = sections.reduce((total, section) => {
    const lessons: any[] = Array.isArray((section as any).Chapter)
      ? (section as any).Chapter
      : [];
    const freeCount = lessons.filter((lesson: any) => lesson.isFree).length;
    return total + freeCount;
  }, 0);

  const totalDuration = sections.reduce((total, section) => {
    const lessons = Array.isArray(section.Chapter) ? section.Chapter : [];
    const sectionDuration = lessons.reduce((lessonTotal, lesson) => {
      return lessonTotal + (lesson.duration || 0);
    }, 0);
    return total + sectionDuration;
  }, 0);

  const hours = Math.floor(totalDuration / 60);
  const minutes = Math.floor(totalDuration % 60);

  // Precompute each section's duration for display
  const sectionDurations: number[] = sections.map((section) => {
    const lessons = Array.isArray(section.Chapter) ? section.Chapter : [];
    return lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
  });

  // Precompute previous section durations for each section
  const prevSectionDurations: number[] = [];
  let runningTotal = 0;

  for (let i = 0; i < sectionDurations.length; i++) {
    prevSectionDurations.push(runningTotal);
    runningTotal += sectionDurations[i];
  }

  return (
    <Card className="border-0 shadow-xl dark:bg-zinc-900/90 rounded-2xl overflow-hidden">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900 border-b border-gray-200 dark:border-zinc-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`${dmSans.className} text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 `}>
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Course Content
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700">
                <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {totalLessons} lessons
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  {freeLessons} free
                </span>
              </div>
            </div>
          </div>


          <div className="text-right">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Total Duration
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-md">
              <Clock className="h-4 w-4" />
              <span className="text-lg font-bold">
                {hours}h {minutes}m
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-6">
        <div className="space-y-3">
          {sections
            .filter((section) => section.courseId === courseId)
            .map((section, sectionIndex) => {
              const lessons = Array.isArray(section.Chapter)
                ? section.Chapter
                : [];
              const prevDuration = prevSectionDurations[sectionIndex] || 0;
              const prevHours = Math.floor(prevDuration / 60);
              const prevMinutes = prevDuration % 60;

              return (
                <div
                  key={section.id}
                  className={cn(
                    "border rounded-xl overflow-hidden transition-all duration-200",
                    expandedSections.has(section.id)
                      ? "border-blue-300 dark:border-blue-700 shadow-lg"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={cn(
                          "p-2 rounded-lg transition-all duration-200",
                          expandedSections.has(section.id)
                            ? "bg-blue-100 dark:bg-blue-900/30 rotate-0"
                            : "bg-gray-200 dark:bg-zinc-700"
                        )}
                      >
                        {expandedSections.has(section.id) ? (
                          <ChevronDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        )}
                      </div>

                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded">
                            {sectionIndex + 1}
                          </span>
                          <h3 className={`${dmSans.className} font-bold text-gray-900 dark:text-white text-left`}>
                            {section.title}
                          </h3>
                        </div>

                        <div className="flex justify-start items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex justify-start items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" />
                            {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                          </span>
                          {(prevHours > 0 || prevMinutes > 0) && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {prevHours > 0 && `${prevHours}h `}
                              {prevMinutes}m
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {expandedSections.has(section.id) && (
                    <div className="bg-white dark:bg-zinc-900 p-4 space-y-2">
                      {lessons.map((lesson, lessonIndex) => {
                        const isFree = lesson.isFree;
                        const isFirstTwoLessons =
                          sectionIndex === 0 && lessonIndex < 2;
                        const canPlay =
                          isFree || isFirstTwoLessons || isUserAuthenticated;

                        return (
                          <div
                            key={lesson.id}
                            className={cn(
                              "flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 border",
                              canPlay
                                ? "hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                                : "bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed border-gray-200 dark:border-gray-700"
                            )}
                          >
                            <div className="flex-shrink-0">
                              {canPlay ? (
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                                  <Play className="h-4 w-4 text-white ml-0.5" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                  <Lock className="h-4 w-4 text-gray-500" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4
                                  className={cn(
                                    "font-semibold text-sm truncate",
                                    canPlay
                                      ? "text-gray-900 dark:text-white"
                                      : "text-gray-500 dark:text-gray-400"
                                  )}
                                >
                                  {lesson.title}
                                </h4>
                                {isFree && (
                                  <Badge className="text-xs bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 font-bold shadow-sm">
                                    Free
                                  </Badge>
                                )}
                                {!canPlay && (
                                  <Badge variant="outline" className="text-xs border font-semibold">
                                    Premium
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 mt-1.5">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-md">
                                  {lesson.contentType === "VIDEO" && (
                                    <Video className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                  )}
                                  {lesson.contentType === "TEXT" && (
                                    <FileText className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                  )}
                                  {lesson.contentType === "QUIZ" && (
                                    <HelpCircle className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                                  )}
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                                    {lesson.contentType.toLowerCase()}
                                  </span>
                                </div>
                                {lesson.duration && (
                                  <div className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                                    <Clock className="h-3 w-3" />
                                    {Math.floor(lesson.duration / 60)}:
                                    {String(lesson.duration % 60).padStart(
                                      2,
                                      "0"
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {!canPlay && (
                              <div className="flex-shrink-0">
                                <Lock className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Course Access Notice */}
        <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <Info className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className={`${dmSans.className} font-bold text-blue-900 dark:text-blue-100 mb-1`}>
                Course Access Information
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                The first 2 lessons are available for free preview. Enroll in
                the course to unlock all {totalLessons} lessons, including{" "}
                <span className="font-semibold">{totalLessons - freeLessons} premium lessons</span> with lifetime access.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};