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
import { COURSE_MESSAGES } from "@/constants/messages";

export const CourseDetailsLeftSection = ({
  course,
  reviews,
}: {
  course: Course;
  reviews: Review[];
}) => {
  const learningOutcomes = course?.learningOutcomes?.length ? course.learningOutcomes : [];
  const prerequisites = course?.prerequisites?.length ? course.prerequisites : [];
  const reviewList = reviews ?? [];

  const avgRating =
    reviewList.length > 0
      ? reviewList.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviewList.length
      : course?.averageRating || 0.0;

  const totalReviews = reviewList.length;

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero Section */}
      <Card className="overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-lg">
        <CardContent className="p-6 lg:p-8 space-y-6">
          <div className="space-y-3">
            {course?.Category && (
              <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 text-xs font-semibold">
                {course.Category.name || "Course"}
              </Badge>
            )}

            <h1 className={`${dmSans.className} text-3xl font-extrabold tracking-tight text-white lg:text-4xl xl:text-5xl leading-tight`}>
              {course?.title}
            </h1>

            {course?.description && (
              <p className="text-base lg:text-lg text-blue-50/90 line-clamp-2 leading-relaxed">
                {course.description.substring(0, 150)}
                {course.description.length > 150 && "..."}
              </p>
            )}

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full">
                <FaStar className="text-yellow-300" size={18} />
                <span className="font-bold text-white text-lg">
                  {avgRating?.toFixed(1) ?? "0.0"}
                </span>
                <div className="w-px h-4 bg-white/30" />
                <span className="text-sm text-white/90 font-medium">
                  {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                </span>
              </div>

              <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30 px-4 py-2 text-sm font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                {COURSE_MESSAGES.POPULAR_CHOICE}
              </Badge>
            </div>
          </div>

          {/* Instructor Info */}
          {course?.instructor && (
            <Card className="border-0 rounded-2xl bg-white/10 shadow-md">
              <CardContent className="p-5 lg:p-6">
                <div className="flex items-start gap-4">
                  <Link
                    href={`/instructor/${course.instructor.userId}`}
                    className="relative group flex-shrink-0"
                  >
                    <div className="relative h-16 w-16 lg:h-20 lg:w-20 overflow-hidden rounded-2xl border-2 border-white/30 shadow-md">
                      <Image
                        src={course.instructor.user?.profileImageUrl ?? IMAGES.SHADCN_DEFAULT}
                        alt={course.instructor.user?.name || "Instructor"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <Award className="w-3.5 h-3.5 text-white" />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 items-start sm:items-center md:mb-2">
                      <Link
                        href={`/instructor/${course.instructor.userId}`}
                        className="text-lg lg:text-xl font-bold text-white hover:text-blue-100 transition-colors"
                      >
                        {course.instructor.user?.name}
                      </Link>
                      <Badge className="rounded-full bg-blue-400/30 text-blue-50 border-blue-300/30 px-3 py-0.5 text-xs font-semibold">
                        Instructor
                      </Badge>
                    </div>

                    {course.instructor.user?.about && (
                      <p className="text-sm text-blue-50/90 line-clamp-2 leading-relaxed mb-3">
                        {course.instructor.user.about}
                      </p>
                    )}

                    {course?.instructor?.expertise && course.instructor.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {course.instructor.expertise.slice(0, 3).map((tech, index) => (
                          <Badge
                            key={index}
                            className="text-xs font-medium rounded-full px-3 py-1 bg-white/20 text-white border-white/20"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {course.instructor.expertise.length > 3 && (
                          <Badge className="text-xs font-medium rounded-full px-3 py-1 bg-white/15 text-white/80 border-white/20">
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
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="group border-0 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/25 p-3">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">
                  {course?.studentCount > 1000
                    ? `${(course.studentCount / 1000).toFixed(1)}k`
                    : (course?.studentCount ?? 0)}
                </p>
                <p className="text-sm text-white/90 font-medium">{COURSE_MESSAGES.STUDENTS_LABEL}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-0 bg-gradient-to-br from-amber-500 to-orange-600 shadow-md hover:shadow-lg transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/25 p-3">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">
                  {avgRating?.toFixed(1) ?? "0.0"}
                </p>
                <p className="text-sm text-white/90 font-medium">{COURSE_MESSAGES.AVG_RATING_LABEL}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Description */}
      <Card className="border-0 shadow-md dark:bg-zinc-900/90">
        <CardHeader className="pb-4">
          <h2 className={`${dmSans.className} text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight`}>
            {COURSE_MESSAGES.ABOUT_TITLE}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {COURSE_MESSAGES.ABOUT_SUBTITLE}
          </p>
        </CardHeader>
        <CardContent>
          <CourseDescription courseDescription={course?.description || COURSE_MESSAGES.NO_DESCRIPTION} />
        </CardContent>
      </Card>

      {/* What You'll Learn */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-zinc-900/95 dark:to-zinc-900">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-600 p-3 shadow-sm">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className={`${dmSans.className} text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight`}>
                {COURSE_MESSAGES.LEARN_TITLE}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {COURSE_MESSAGES.LEARN_SUBTITLE}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {learningOutcomes.length > 0 ? (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                {learningOutcomes.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/60 dark:bg-white/5 border border-blue-100/50 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <CheckCircle className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {COURSE_MESSAGES.TOTAL_OUTCOMES}
                  </span>
                  <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0">
                    {learningOutcomes.length} skills
                  </Badge>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              {COURSE_MESSAGES.NO_LEARNING_OUTCOMES}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-zinc-900/95 dark:to-zinc-900">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-600 p-3 shadow-sm">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className={`${dmSans.className} text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight`}>
                {COURSE_MESSAGES.REQUIREMENTS_TITLE}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {COURSE_MESSAGES.REQUIREMENTS_SUBTITLE}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {prerequisites.length > 0 ? (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                {prerequisites.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/70 dark:bg-white/5 border border-blue-100/50 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <ListChecks className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {COURSE_MESSAGES.BEGINNER_FRIENDLY}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {COURSE_MESSAGES.EASY_REQUIREMENTS}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-0">
                    {prerequisites.length} items
                  </Badge>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              {COURSE_MESSAGES.NO_PREREQUISITES}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const CourseDescription = ({ courseDescription }: { courseDescription: string }) => {
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
