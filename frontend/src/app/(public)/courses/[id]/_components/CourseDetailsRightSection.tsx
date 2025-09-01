"use client";

import React from "react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Course } from "@/types";
import { CourseEnrollButton } from "./CourseEnrollButton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

//* icons
import { Clock, BookOpen, Award, Shield, Zap } from "lucide-react";
import { formatCourseDuration } from "@/lib/utils/utils";
import { ShareButton } from "./ShareButton";
import { ApplyCouponCode } from "./ApplyCouponCode";

export const CourseDetailsRightSection = ({ course }: { course: Course }) => {
  // console.log("Course in right section: ", JSON.stringify(course));

  return (
    <div className="space-y-6">
      {/* <Toaster /> */}

      {/* Course Card */}
      <Card className="sticky top-24 border-0 shadow-xl dark:bg-zinc-900/90">
        {/* Course Image */}
        <div className="relative rounded-t-xl overflow-hidden">
          <Image
            className="h-48 w-full object-cover"
            src={
              course?.imageUrl ??
              "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210301154221/System-Design-Live-Course-By-GeeksforGeeks.png"
            }
            alt={course?.title || "Course"}
            width={400}
            height={200}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Play Button Overlay */}
          {/* <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
              <Play className="h-8 w-8 text-white" fill="white" />
            </div>
          </div> */}
        </div>

        {/* Other content */}
        <CardContent className="p-6">
          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${course?.price ?? 499}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                lifetime access
              </span>
            </div>
          </div>

          {/* Enroll Button */}
          <CourseEnrollButton course={course!} courseId={course?.id} />

          <div className="grid grid-cols-3 gap-3 mt-3">
            <button
              className="col-span-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              type="button"
              // onClick={handleAddToCart}
              // disabled={isLoading}
            >
              Add to Cart
            </button>
            <button
              className="col-span-1 w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              type="button"
              // onClick={handleAddToWishlist}
              // disabled={isLoading}
            >
              {/* Replace with stateful logic for filled/outline heart */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                  // If added, use fill="currentColor" for filled heart
                  fill="none"
                />
              </svg>
              Wishlist
            </button>
          </div>

          {/* Guarantee */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              30-Day Money-Back Guarantee
            </p>
          </div>

          <Separator className="my-6" />

          {/* Course Includes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              This course includes:
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {formatCourseDuration(course?.duration)}
                    </span>{" "}
                    <span className="text-gray-700 dark:text-gray-300">
                      of high-quality, on-demand video
                    </span>
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Certificate of completion
                </span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Downloadable resources
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Full lifetime access
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Access on mobile and TV
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Technologies */}
          {course?.technologies && course.technologies.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Technologies you'll learn:
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.technologies.slice(0, 4).map((tech, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs font-medium rounded-full px-3 py-1 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-pink-900/40 border-0 shadow-sm text-blue-700 dark:text-blue-200 flex items-center gap-1"
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 mr-1" />
                    {tech}
                  </Badge>
                ))}
                {course.technologies.length > 4 && (
                  <Badge
                    variant="outline"
                    className="text-xs font-medium rounded-full px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-0 shadow-sm text-gray-700 dark:text-gray-200 flex items-center gap-1"
                  >
                    +{course.technologies.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <Separator className="my-6" />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <ShareButton />
            <ApplyCouponCode />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
