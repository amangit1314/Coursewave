"use client";

import React, { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

//* icons
import {
  Loader,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  Play,
  Award,
  Shield,
  Zap,
  Lock,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  HelpCircle,
  Info,
  ClipboardList,
  ListChecks,
} from "lucide-react";

//* custom hooks
import { useCoursesStore } from "@/zustand/coursesStore";

//* types
import { CourseSection } from "@/types/course-details-api-response";

// * Custom Components

import { useUserStore } from "@/zustand/userStore";

import { ErrorMessage } from "./ErrorMessage";

import { SampleCourseContent } from "./SampleCourseContent";

export const CourseSectionsAndChapters = ({
  courseId,
  sections,
}: {
  courseId: string;
  sections: CourseSection[] | null;
}) => {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set()
  );
  const { user } = useUserStore();
  const { loadingState } = useCoursesStore();

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
  if (loadingState.loading) {
    return (
      <Card className="border-0 shadow-lg dark:bg-zinc-900/90">
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Course Content
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-32" />
                <div className="mt-3 space-y-2">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-1">
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
  if (loadingState.error) {
    return (
      <Card className="border-0 shadow-lg dark:bg-zinc-900/90">
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Course Content
          </h2>
        </CardHeader>
        <CardContent>
          <ErrorMessage
            title="Failed to load course content"
            message={loadingState.error}
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
    <Card className="border-0 shadow-lg dark:bg-zinc-900/90">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Course Content
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {totalLessons} lessons • {freeLessons} free previews
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Course Duration
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {hours}h {minutes}m
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sections
            .filter((section) => section.courseId === courseId)
            .map((section, sectionIndex) => {
              const lessons = Array.isArray(section.Chapter)
                ? section.Chapter
                : [];
              // Use previous section's duration for display
              const prevDuration = prevSectionDurations[sectionIndex] || 0;
              const prevHours = Math.floor(prevDuration / 60);
              const prevMinutes = prevDuration % 60;

              return (
                <div
                  key={section.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-gray-800 transition-colors rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {expandedSections.has(section.id) ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}

                      {/* Section title */}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-left">
                          Section {sectionIndex + 1}: {section.title}
                        </h3>

                        <p className="text-left text-sm text-gray-600 dark:text-gray-400">
                          {lessons.length} lessons
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {prevHours > 0 ? `${prevHours}h ` : ""}
                      {prevMinutes}m
                    </div>
                  </button>

                  {expandedSections.has(section.id) && (
                    <div className="space-y-2">
                      {lessons.map((lesson, lessonIndex) => {
                        const isFree = lesson.isFree;
                        const isFirstTwoLessons =
                          sectionIndex === 0 && lessonIndex < 2;
                        const canPlay =
                          isFree || isFirstTwoLessons || isUserAuthenticated;

                        return (
                          <div
                            key={lesson.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                              canPlay
                                ? "hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                                : "bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {canPlay ? (
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                  <Play className="h-4 w-4 text-blue-600 dark:text-blue-400 ml-0.5" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                  <Lock className="h-4 w-4 text-gray-500" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4
                                  className={`font-medium text-sm ${
                                    canPlay
                                      ? "text-gray-900 dark:text-white"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                >
                                  {lesson.title}
                                </h4>
                                {isFree && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  >
                                    Free
                                  </Badge>
                                )}
                                {!canPlay && (
                                  <Badge variant="outline" className="text-xs">
                                    Premium
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  {lesson.contentType === "VIDEO" && (
                                    <Video className="h-3 w-3" />
                                  )}
                                  {lesson.contentType === "TEXT" && (
                                    <FileText className="h-3 w-3" />
                                  )}
                                  {lesson.contentType === "QUIZ" && (
                                    <HelpCircle className="h-3 w-3" />
                                  )}
                                  <span className="capitalize">
                                    {lesson.contentType.toLowerCase()}
                                  </span>
                                </div>
                                {lesson.duration && (
                                  <div className="text-xs text-gray-500">
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
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                Course Access
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                The first 2 lessons are available for free preview. Enroll in
                the course to access all content, including{" "}
                {totalLessons - freeLessons} premium lessons.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
