"use client";

import React from "react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, CheckCircle, ClipboardList, ListChecks } from "lucide-react";
import { FaStar } from "react-icons/fa6";
import { Course } from "@/types/course-details-api-response";
import { Review } from "@/types/review";

export const CourseDetailsLeftSection = ({
  course,
  reviews,
}: {
  course: Course;
  reviews: Review[];
}) => {
  // Safe defaults
  const learningOutcomes = course?.learningOutcomes ?? [
    "Master modern web development techniques",
    "Build real-world projects from scratch",
    "Learn industry best practices",
    "Get hands-on coding experience",
    "Understand advanced concepts",
    "Deploy applications to production",
  ];
  const prerequisites = course?.prerequisites ?? [];
  const reviewList = reviews ?? [];

  const avgRating =
    reviewList.length > 0
      ? reviewList.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) /
        reviewList.length
      : course?.averageRating || 0.0;

  const totalReviews = reviewList.length;

  console.log(
    "Course in state cards in left section: ",
    JSON.stringify(course)
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 shadow-2xl">
        <CardContent className="p-0">
          <div className="relative">
            {/* Mobile Course Image */}
            {/* <div className="relative h-64 w-full lg:hidden">
              <Image
                className="object-cover"
                src={
                  course?.imageUrl ??
                  "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210301154221/System-Design-Live-Course-By-GeeksforGeeks.png"
                }
                alt={course?.title || "Course"}
                fill
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div> */}

            <div className="p-6 lg:p-8">
              <div className="space-y-4">
                {/* <CourseBreadcrumb course={course!} /> */}
                <div className="space-y-2">
                  {/* Title */}
                  <h1 className="text-3xl font-bold tracking-tight text-white lg:text-4xl xl:text-5xl">
                    {course?.title}
                  </h1>

                  {/* Rating and Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-white">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" size={16} />
                        <span className="font-semibold">
                          {avgRating?.toFixed(1) ?? 0.0}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30"
                      >
                        {totalReviews} reviews
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Instructor Info */}
                {course?.instructor && (
                  <Card className="border-0 bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 shadow-lg">
                    <CardContent className="flex items-center gap-6 p-4 lg:p-6">
                      {/* 
                        UX Decision:
                        - Since you want to show more courses from the instructor and possibly more details,
                        - The best UX is to navigate to a dedicated instructor profile page (new screen/route).
                        - This allows for a richer experience and easier sharing/linking.
                        - You can use a route like `/instructors/[instructorId]`.
                        - If you want a quick preview, you could also add a dialog or sidebar later.
                        - For now, let's make the avatar and name clickable links.
                      */}
                      <a
                        href={`/instructor/${course.instructor.userId}`}
                        className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-white/20 shadow-lg block focus:outline-none focus:ring-2 focus:ring-blue-400"
                        title={`View ${course.instructor.user?.name}'s profile`}
                      >
                        <Image
                          src={
                            course.instructor.user?.profileImageUrl ??
                            "https://github.com/shadcn.png"
                          }
                          alt={course.instructor.user?.name || "Instructor"}
                          fill
                          className="object-cover"
                        />
                        <span className="sr-only">
                          View {course.instructor.user?.name}'s profile
                        </span>
                      </a>

                      {/* Instructor Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <a
                            href={`/instructor/${course.instructor.userId}`}
                            className="text-xl font-bold text-white hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
                            title={`View ${course.instructor.user?.name}'s profile`}
                          >
                            {course.instructor.user?.name}
                          </a>
                          <span className="ml-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white/80 shadow">
                            Course Instructor
                          </span>
                        </div>

                        {/* Instructor Bio */}
                        {course.instructor.user?.about && (
                          <p className="mt-2 text-sm text-white/90 line-clamp-3">
                            {course.instructor.user.about
                              ? course.instructor.user.about
                              : "No about available"}
                          </p>
                        )}

                        {/* Instructor Expertise */}
                        {course?.instructor?.expertise &&
                          course.instructor.expertise.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <h4 className="text-sm font-semibold text-white/80">
                                Expertise
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {course.instructor.expertise
                                  .slice(0, 4)
                                  .map((tech, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs font-medium rounded-full px-3 py-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-pink-900/40 border-0 shadow text-blue-800 dark:text-blue-200 flex items-center gap-1"
                                    >
                                      <span className="inline-block w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 mr-1" />
                                      {tech}
                                    </Badge>
                                  ))}
                                {course.instructor.expertise.length > 4 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-medium rounded-full px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-0 shadow text-gray-700 dark:text-gray-200 flex items-center gap-1"
                                  >
                                    +{course.instructor.expertise.length - 4}{" "}
                                    more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                {/* TODO: implement this student counts */}
                <p className="text-2xl font-bold text-white">
                  {/* {course?.totalStudents > 1000
                    ? `${(course.totalStudents / 1000).toFixed(1)}k`
                    : (course?.totalStudents ?? 0)} */}
                  0
                </p>

                <p className="text-sm text-white/90">Students enrolled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="border-0 bg-gradient-to-br from-cyan-500 to-red-600 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                <Folder className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
               
                  {course.sections.length}
                </p>
                <p className="text-sm text-white/90">Sections included</p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* TODO: implement this student counts */}
        {/* <Card className="border-0 bg-gradient-to-br from-indigo-500 to-cyan-600 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
               
                <p className="text-2xl font-bold text-white">
                  {course.sections.flatMap(section => section.Chapter || []).length}
                  
                </p>

                <p className="text-sm text-white/90">Chapters</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Course Description */}
      <Card className="border-0 shadow-lg dark:bg-zinc-900/90">
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            About This Course
          </h2>
        </CardHeader>
        <CardContent>
          <CourseDescription
            courseDescription={
              course?.description ??
              "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos odit nam quae repellat quis cumque reiciendis autem ab expedita Provident eos odit nam quae repellat"
            }
          />
        </CardContent>
      </Card>

      {/* What You'll Learn */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-zinc-900/95 dark:to-blue-950/20 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 dark:from-blue-500 dark:to-purple-400 blur-sm opacity-75"></div>
              <div className="relative rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-500 p-3 shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight">
                What You'll Learn
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Master these essential skills and concepts
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {(learningOutcomes.length > 0
              ? learningOutcomes
              : [
                  "Master modern web development techniques",
                  "Build real-world projects from scratch",
                  "Learn industry best practices",
                  "Get hands-on coding experience",
                  "Understand advanced concepts",
                  "Deploy applications to production",
                ]
            ).map((item, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 p-4 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 border border-blue-100/50 dark:border-blue-900/30 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-100/50 hover:via-purple-50/50 hover:to-blue-100/50 dark:hover:from-blue-900/30 dark:hover:via-purple-900/30 dark:hover:to-blue-900/30 hover:shadow-[0_0_0_1px] hover:shadow-blue-200 dark:hover:shadow-blue-800/50"
              >
                <div className="relative flex-shrink-0 mt-0.5">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 dark:from-blue-500 dark:to-purple-400 blur-sm opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-500 flex items-center justify-center shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                    <CheckCircle className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-800 dark:text-gray-200 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                    {item}
                  </p>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Optional: Progress indicator */}
          <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Learning outcomes</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
                <span>
                  {learningOutcomes.length > 0 ? learningOutcomes.length : 6}{" "}
                  skills to master
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Requirements */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-zinc-900/95 dark:to-purple-950/20 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 dark:from-blue-500 dark:to-purple-400 blur-sm opacity-75"></div>
              <div className="relative rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-500 p-3 shadow-lg">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight">
                Requirements
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Everything you need to get started
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(prerequisites.length > 0
              ? prerequisites
              : [
                  "Basic programming knowledge",
                  "A computer with internet connection",
                  "Willingness to learn and practice",
                  "No prior experience required",
                ]
            ).map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-white/70 dark:bg-white/5 p-4 border border-purple-100/50 dark:border-purple-900/30 hover:border-transparent hover:shadow-[0_0_0_1px] hover:shadow-purple-200 dark:hover:shadow-purple-800/50 transition-all duration-300"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-purple-50/0 to-blue-50/0 dark:from-blue-900/0 dark:via-purple-900/0 dark:to-blue-900/0 group-hover:from-blue-50/30 group-hover:via-purple-50/30 group-hover:to-blue-50/30 dark:group-hover:from-blue-900/20 dark:group-hover:via-purple-900/20 dark:group-hover:to-blue-900/20 transition-all duration-300"></div>

                <div className="relative flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-500 flex items-center justify-center shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                      <ListChecks className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                      {item}
                    </p>
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Optional: Summary footer */}
          <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 flex items-center justify-center shadow-sm">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Ready to start learning?
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    All requirements are beginner-friendly
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {prerequisites.length > 0 ? prerequisites.length : 4}{" "}
                  requirements
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Easy to meet
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CourseDescription = ({
  courseDescription,
}: {
  courseDescription: string;
}) => {
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  return (
    <div className="space-y-4">
      <div
        className={`prose prose-gray max-w-none dark:prose-invert ${
          showFullDescription ? "" : "line-clamp-4"
        }`}
      >
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {courseDescription}
        </p>
      </div>

      {courseDescription.length > 250 && (
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          {showFullDescription ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};
