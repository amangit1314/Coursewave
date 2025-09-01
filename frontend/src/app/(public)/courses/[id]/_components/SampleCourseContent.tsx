"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUserStore } from "@/zustand/userStore";
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
import React from "react";

// Sample Course Content Component
export const SampleCourseContent = () => {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(["section-1"])
  );
  const { user } = useUserStore();

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

  const sampleSections = [
    {
      id: "section-1",
      title: "Introduction to Web Development",
      lessons: [
        {
          id: "1",
          title: "Welcome to the Course",
          duration: 300,
          contentType: "VIDEO",
          isFree: true,
        },
        {
          id: "2",
          title: "Setting Up Your Development Environment",
          duration: 600,
          contentType: "VIDEO",
          isFree: true,
        },
        {
          id: "3",
          title: "Understanding HTML Basics",
          duration: 900,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "4",
          title: "HTML Structure and Elements",
          duration: 750,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "5",
          title: "HTML Quiz",
          duration: 300,
          contentType: "QUIZ",
          isFree: false,
        },
      ],
    },
    {
      id: "section-2",
      title: "CSS Fundamentals",
      lessons: [
        {
          id: "6",
          title: "Introduction to CSS",
          duration: 600,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "7",
          title: "CSS Selectors and Properties",
          duration: 900,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "8",
          title: "Box Model and Layout",
          duration: 750,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "9",
          title: "CSS Flexbox",
          duration: 900,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "10",
          title: "CSS Grid Layout",
          duration: 900,
          contentType: "VIDEO",
          isFree: false,
        },
      ],
    },
    {
      id: "section-3",
      title: "JavaScript Essentials",
      lessons: [
        {
          id: "11",
          title: "JavaScript Basics",
          duration: 900,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "12",
          title: "Variables and Data Types",
          duration: 600,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "13",
          title: "Functions and Scope",
          duration: 900,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "14",
          title: "DOM Manipulation",
          duration: 900,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "15",
          title: "JavaScript Quiz",
          duration: 300,
          contentType: "QUIZ",
          isFree: false,
        },
      ],
    },
  ];

  const totalLessons = sampleSections.reduce(
    (total, section) => total + section.lessons.length,
    0
  );
  const freeLessons = sampleSections.reduce(
    (total, section) =>
      total + section.lessons.filter((lesson) => lesson.isFree).length,
    0
  );

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
              8h 30m
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sampleSections.map((section, sectionIndex) => (
            <div
              key={section.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-left">
                      Section {sectionIndex + 1}: {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {section.lessons.length} lessons
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {Math.floor(
                    section.lessons.reduce(
                      (total, lesson) => total + lesson.duration,
                      0
                    ) / 60
                  )}
                  m
                </div>
              </button>

              {expandedSections.has(section.id) && (
                <div className="px-4 space-y-2">
                  {section.lessons.map((lesson, lessonIndex) => {
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
                            <div className="text-xs text-gray-500">
                              {Math.floor(lesson.duration / 60)}:
                              {String(lesson.duration % 60).padStart(2, "0")}
                            </div>
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
          ))}
        </div>

        {/* Sample Content Notice */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                Sample Course Content
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                This is a preview of the course structure. The actual content
                will be available once the instructor adds sections and lessons
                to this course.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
