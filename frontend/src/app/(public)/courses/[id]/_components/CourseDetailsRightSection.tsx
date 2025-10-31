"use client";

import React, { useState } from "react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Course } from "@/types";
import { CourseEnrollButton } from "./CourseEnrollButton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

//* icons
import {
  Clock,
  BookOpen,
  Award,
  Shield,
  Zap,
  Play,
  CheckCircle2,
  Monitor,
  Download,
  Infinity,
} from "lucide-react";
import { formatCourseDuration } from "@/lib/utils/utils";
import { ShareButton } from "./ShareButton";
import { ApplyCouponCode } from "./ApplyCouponCode";
import { dmSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";
import { useCurrencyStore } from "@/zustand/currencyStore";
import { IMAGES } from "@/constants/images";

export const CourseDetailsRightSection = ({ course }: { course: Course }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { formatPrice } = useCurrencyStore();

  const courseIncludes = [
    {
      icon: Clock,
      label: "Video content",
      value: formatCourseDuration(course?.duration),
      highlighted: true,
    },
    {
      icon: Award,
      label: "Certificate of completion",
      value: null,
    },
    {
      icon: Download,
      label: "Downloadable resources",
      value: null,
    },
    {
      icon: Infinity,
      label: "Full lifetime access",
      value: null,
    },
    {
      icon: Monitor,
      label: "Access on mobile and TV",
      value: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Course Enrollment Card */}
      <Card className="sticky top-24 border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-300 dark:bg-zinc-900/95 backdrop-blur-sm overflow-hidden rounded-2xl">
        {/* Course Image with Play Button */}
        <div className="relative h-52 overflow-hidden bg-zinc-100 dark:bg-zinc-800 group">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-zinc-200 dark:bg-zinc-700" />
          )}

          <Image
            className={cn(
              "h-full w-full object-cover transition-all duration-500 group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            src={course?.imageUrl ?? IMAGES.FALLBACK_IMAGE}
            alt={course?.title || "Course"}
            width={400}
            height={208}
            priority
            onLoad={() => setImageLoaded(true)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Preview Badge */}
          <div className="absolute top-4 left-4">
            <Badge
              className={cn(
                "bg-blue-600/90 backdrop-blur-sm text-white border-0 px-3 py-1 font-semibold shadow-lg",
                dmSans.className
              )}
            >
              <Play className="w-3 h-3 mr-1.5" fill="white" />
              Preview Available
            </Badge>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="rounded-full bg-white/25 backdrop-blur-md p-5 hover:bg-white/35 transition-all hover:scale-110 cursor-pointer shadow-2xl">
              <Play className="h-8 w-8 text-white" fill="white" />
            </div>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-6 space-y-6">
          {/* Price Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-start gap-3 flex-wrap">
              {/* Current Price (dealPrice if available, otherwise regular price) */}
              <span
                className={cn(
                  "text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent",
                  dmSans.className
                )}
              >
                {course?.isFree
                  ? "Free"
                  : `${formatPrice(course?.dealPrice ?? course?.price ?? 499)}`}
              </span>

              {/* Original Price (show only when there's a discount) */}
              {!course?.isFree &&
                course?.dealPrice &&
                course?.price &&
                course.dealPrice < course.price && (
                  <span
                    className={cn(
                      "text-lg text-gray-400 dark:text-gray-500 line-through",
                      dmSans.className
                    )}
                  >
                    {formatPrice(course.price)}
                  </span>
                )}

              {/* Discount Badge */}
              {!course?.isFree && course?.discount && course.discount > 0 && (
                <Badge
                  className={cn(
                    "bg-red-500 text-white border-0 px-3 py-1 font-bold text-sm shadow-lg",
                    dmSans.className
                  )}
                >
                  {course.discount}% OFF
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Lifetime access • One-time payment
              </span>
            </div>
          </div>

          {/* Enroll Button */}
          <CourseEnrollButton course={course!} courseId={course?.id} />

          {/* Money-Back Guarantee */}
          <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              30-Day Money-Back Guarantee
            </p>
          </div>

          <Separator className="bg-zinc-200 dark:bg-zinc-800" />

          {/* Course Includes */}
          <div className="space-y-4">
            <h3
              className={cn(
                "text-lg font-bold text-gray-900 dark:text-white",
                dmSans.className
              )}
            >
              This course includes:
            </h3>
            <div className="space-y-3">
              {courseIncludes.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 group hover:translate-x-1 transition-transform duration-200"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                        <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.highlighted && item.value ? (
                        <span className="text-sm">
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {item.value}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {" "}
                            of {item.label}
                          </span>
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {item.label}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator className="bg-zinc-200 dark:bg-zinc-800" />

          {/* Technologies */}
          {course?.technologies && course.technologies.length > 0 && (
            <div className="space-y-4">
              <h3
                className={cn(
                  "text-lg font-bold text-gray-900 dark:text-white",
                  dmSans.className
                )}
              >
                Technologies covered:
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.technologies.slice(0, 5).map((tech, index) => (
                  <Badge
                    key={index}
                    className="text-xs font-semibold rounded-full px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-200 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/60 dark:hover:to-indigo-900/60 transition-all hover:scale-105 cursor-default shadow-sm"
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mr-1.5 animate-pulse" />
                    {tech}
                  </Badge>
                ))}
                {course.technologies.length > 5 && (
                  <Badge className="text-xs font-semibold rounded-full px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 cursor-default">
                    +{course.technologies.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <Separator className="bg-zinc-200 dark:bg-zinc-800" />

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2">
            <ShareButton />
            <ApplyCouponCode />
          </div>

          {/* Trust Indicators */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {course?.averageRating?.toFixed(1) ?? "5.0"}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Rating
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {course?.studentCount ?? 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Students
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {
                    // course?.level ??
                    "All"
                  }
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Level
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
