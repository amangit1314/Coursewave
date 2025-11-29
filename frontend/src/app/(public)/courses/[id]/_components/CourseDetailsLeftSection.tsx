"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  CheckCircle,
  ClipboardList,
  ListChecks,
  Award,
  TrendingUp,
} from "lucide-react";
import { FaStar } from "react-icons/fa6";
import { Course } from "@/types/course-details-api-response";
import { Review } from "@/types/review";
import { dmSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";
import { IMAGES } from "@/constants/images";

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
      ? reviewList.reduce(
        (sum, review) => sum + (Number(review.rating) || 0),
        0
      ) / reviewList.length
      : course?.averageRating || 0.0;

  const totalReviews = reviewList.length;

  console.log(
    "Course in state cards in left section: ",
    JSON.stringify(course)
  );

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero Section - Enhanced gradient with better contrast */}
      <Card className="overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-2xl shadow-blue-500/20">
        <CardContent className="p-0">
          <div className="relative">
            <div className="p-6 lg:p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  {/* Category Badge */}
                  {course?.Category && (
                    <div>
                      <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1 text-xs font-semibold">
                        {course.Category.name || "Course"}
                      </Badge>
                    </div>
                  )}

                  {/* Title with better spacing */}
                  <h1
                    className={`${dmSans.className} text-3xl font-extrabold tracking-tight text-white lg:text-4xl xl:text-5xl leading-tight`}
                  >
                    {course?.title}
                  </h1>

                  {/* Subtitle/Short description if available */}
                  {course?.description && (
                    <p className="text-base lg:text-lg text-blue-50/90 line-clamp-2 leading-relaxed">
                      {course.description.substring(0, 150)}
                      {course.description.length > 150 && "..."}
                    </p>
                  )}

                  {/* Rating and Stats with better layout */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full">
                      <div className="flex items-center gap-1.5">
                        <FaStar className="text-yellow-300" size={18} />
                        <span className="font-bold text-white text-lg">
                          {avgRating?.toFixed(1) ?? "0.0"}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-white/30" />
                      <span className="text-sm text-white/90 font-medium">
                        {totalReviews}{" "}
                        {totalReviews === 1 ? "review" : "reviews"}
                      </span>
                    </div>

                    <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30 backdrop-blur-sm px-4 py-2 text-sm font-semibold">
                      <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                      Popular Choice
                    </Badge>
                  </div>
                </div>

                {/* Instructor Info - Enhanced card */}
                {course?.instructor && (
                  <Card className="border-0 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl hover:bg-white/15 transition-all duration-300">
                    <CardContent className="p-5 lg:p-6">
                      <div className="flex items-start gap-4">
                        {/* Instructor Avatar */}
                        <Link
                          href={`/instructor/${course.instructor.userId}`}
                          className="relative group flex-shrink-0"
                        >
                          <div className="relative h-16 w-16 lg:h-20 lg:w-20 overflow-hidden rounded-2xl border-3 border-white/30 shadow-lg group-hover:border-white/50 transition-all duration-300 group-hover:scale-105">
                            <Image
                              src={
                                course.instructor.user?.profileImageUrl ??
                                IMAGES.SHADCN_DEFAULT
                              }
                              alt={course.instructor.user?.name || "Coursewave Instructor"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {/* Verified badge */}
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                            <Award className="w-3.5 h-3.5 text-white" />
                          </div>
                        </Link>

                        {/* Instructor Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-2 items-start sm:items-center md:mb-2">
                            <Link
                              href={`/instructor/${course.instructor.userId}`}
                              className="text-lg lg:text-xl font-bold text-white hover:text-blue-100 transition-colors"
                            >
                              {course.instructor.user?.name}
                            </Link>
                            <Badge className="rounded-full bg-blue-400/30 text-blue-50 border-blue-300/30 px-3 py-0.5 text-xs font-semibold self-start sm:self-auto">
                              Instructor
                            </Badge>
                          </div>

                          {/* Instructor Bio */}
                          {course.instructor.user?.about && (
                            <p className="text-sm text-blue-50/90 line-clamp-2 leading-relaxed mb-3">
                              {course.instructor.user.about}
                            </p>
                          )}

                          {/* Instructor Expertise */}
                          {course?.instructor?.expertise &&
                            course.instructor.expertise.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {course.instructor.expertise
                                  .slice(0, 3)
                                  .map((tech, index) => (
                                    <Badge
                                      key={index}
                                      className="text-xs font-medium rounded-full px-3 py-1 bg-white/20 backdrop-blur-sm text-white border-white/20 hover:bg-white/30 transition-all"
                                    >
                                      {tech}
                                    </Badge>
                                  ))}
                                {course.instructor.expertise.length > 3 && (
                                  <Badge className="text-xs font-medium rounded-full px-3 py-1 bg-white/15 backdrop-blur-sm text-white/80 border-white/20">
                                    +{course.instructor.expertise.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards - Improved grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="group border-0 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/25 backdrop-blur-sm p-3 group-hover:bg-white/35 transition-all">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">
                  {course?.studentCount > 1000
                    ? `${(course.studentCount / 1000).toFixed(1)}k`
                    : (course?.studentCount ?? 0)}
                </p>
                <p className="text-sm text-white/90 font-medium">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-0 bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/25 backdrop-blur-sm p-3 group-hover:bg-white/35 transition-all">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">
                  {avgRating?.toFixed(1) ?? "0.0"}
                </p>
                <p className="text-sm text-white/90 font-medium">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Description - Improved styling */}
      <Card className="border-0 shadow-lg dark:bg-zinc-900/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <h2
            className={`${dmSans.className} text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight`}
          >
            About This Course
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Everything you need to know before enrolling
          </p>
        </CardHeader>
        <CardContent>
          <CourseDescription
            courseDescription={
              course?.description ??
              "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos odit nam quae repellat quis cumque reiciendis autem ab expedita."
            }
          />
        </CardContent>
      </Card>

      {/* What You'll Learn - Same enhanced styling */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-zinc-900/95 dark:to-blue-950/20 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-400 blur-md opacity-75"></div>
              <div className="relative rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-500 p-3 shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h2
                className={`${dmSans.className} text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 dark:from-blue-400 dark:to-blue-400 bg-clip-text text-transparent tracking-tight`}
              >
                What You'll Learn
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Master these essential skills and concepts
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid gap-3 md:grid-cols-2">
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
                className="group flex items-start gap-3 p-4 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 border border-blue-100/50 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md"
              >
                <div className="relative flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-500 flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                    <CheckCircle className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors flex-1">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Total learning outcomes
              </span>
              <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0">
                {learningOutcomes.length > 0 ? learningOutcomes.length : 6}{" "}
                skills
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Requirements - Enhanced */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-zinc-900/95 dark:to-blue-950/20 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-400 blur-md opacity-75"></div>
              <div className="relative rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-500 p-3 shadow-lg">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h2
                className={`${dmSans.className} text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 dark:from-blue-400 dark:to-blue-400 bg-clip-text text-transparent tracking-tight`}
              >
                Requirements
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                What you need before starting
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid gap-3 md:grid-cols-2">
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
                className="group relative overflow-hidden rounded-xl bg-white/70 dark:bg-white/5 p-4 border border-blue-100/50 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-500 flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                      <ListChecks className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors flex-1">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Beginner-friendly course
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Easy requirements to get started
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-0">
                {prerequisites.length > 0 ? prerequisites.length : 4} items
              </Badge>
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
  const isLongDescription = courseDescription.length > 250;

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "prose prose-gray max-w-none dark:prose-invert prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed",
          !showFullDescription && isLongDescription && "line-clamp-4"
        )}
      >
        <p>{courseDescription}</p>
      </div>

      {isLongDescription && (
        <Button
          onClick={() => setShowFullDescription(!showFullDescription)}
          variant="ghost"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-semibold -ml-2"
        >
          {showFullDescription ? "Show Less" : "Read More"}
        </Button>
      )}
    </div>
  );
};
