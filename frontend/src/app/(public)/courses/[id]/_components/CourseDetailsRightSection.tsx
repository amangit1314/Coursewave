"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Course } from "@/types";
import { CourseEnrollButton } from "./CourseEnrollButton";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Award,
  Shield,
  Play,
  CheckCircle2,
  Monitor,
  Download,
  Infinity,
  Star,
  Users,
  BarChart3,
} from "lucide-react";
import { formatCourseDuration } from "@/lib/utils/utils";
import { ShareButton } from "./ShareButton";
import { ApplyCouponCode } from "./ApplyCouponCode";
import { dmSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";
import { useCurrencyStore } from "@/zustand/currencyStore";
import { IMAGES } from "@/constants/images";
import { COURSE_MESSAGES } from "@/constants/messages";
import { AddToCartButton } from "./AddToCartButton";

export const CourseDetailsRightSection = ({ course }: { course: Course }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { formatPrice } = useCurrencyStore();

  const hasDiscount =
    !course?.isFree &&
    course?.dealPrice != null &&
    course.dealPrice > 0 &&
    course?.price != null &&
    course.price > 0 &&
    course.dealPrice < course.price;

  const displayPrice = course?.isFree
    ? "Free"
    : hasDiscount
      ? formatPrice(course.dealPrice ?? 0)
      : course?.price && course.price > 0
        ? formatPrice(course.price)
        : COURSE_MESSAGES.PRICE_NOT_SET;

  return (
    <div className="space-y-4">
      <Card className="sticky top-24 border border-zinc-200 dark:border-zinc-800 shadow-md dark:bg-zinc-900 overflow-hidden rounded-2xl">
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-800 group cursor-pointer">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
          )}
          <Image
            className={cn("object-cover", imageLoaded ? "opacity-100" : "opacity-0")}
            src={course?.imageUrl ?? IMAGES.FALLBACK_IMAGE}
            alt={course?.title || "Course"}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            priority
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="rounded-full bg-white/90 dark:bg-black/60 p-4 shadow-md">
              <Play className="h-6 w-6 text-blue-600 dark:text-white" fill="currentColor" />
            </div>
          </div>

          {/* Preview badge */}
          <Badge className="absolute top-3 left-3 bg-blue-600 text-white border-0 text-xs font-semibold">
            <Play className="w-3 h-3 mr-1" fill="white" />
            Preview
          </Badge>
        </div>

        <CardContent className="p-5">
          {/* Price + CTA Section */}
          <div className="space-y-4">
            {/* Price row */}
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className={cn("text-3xl font-extrabold text-gray-900 dark:text-white", dmSans.className)}>
                {displayPrice}
              </span>

              {hasDiscount && (
                <span className="text-base text-gray-400 dark:text-gray-500 line-through">
                  {formatPrice(course.price)}
                </span>
              )}

              {!course?.isFree && course?.discount != null && course.discount > 0 && (
                <Badge className="bg-red-500 text-white border-0 text-xs font-bold ml-1">
                  {course.discount}% OFF
                </Badge>
              )}
            </div>

            {/* Buttons — stacked tight */}
            <div className="space-y-2">
              <AddToCartButton course={course!} />
              <CourseEnrollButton course={course!} courseId={course?.id} />
            </div>

            {/* Guarantee */}
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{COURSE_MESSAGES.MONEY_BACK}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 my-4" />

          {/* Course includes — compact list */}
          <div className="space-y-2.5">
            <h3 className={cn("text-sm font-semibold text-gray-900 dark:text-white", dmSans.className)}>
              {COURSE_MESSAGES.COURSE_INCLUDES}
            </h3>
            {[
              { icon: Clock, text: formatCourseDuration(course?.duration) ? `${formatCourseDuration(course?.duration)} of video` : COURSE_MESSAGES.VIDEO_CONTENT },
              { icon: Award, text: COURSE_MESSAGES.CERTIFICATE },
              { icon: Download, text: COURSE_MESSAGES.DOWNLOADABLE },
              { icon: Infinity, text: COURSE_MESSAGES.FULL_ACCESS },
              { icon: Monitor, text: COURSE_MESSAGES.MOBILE_ACCESS },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
              </div>
            ))}
          </div>

          {/* Technologies */}
          {course?.technologies && course.technologies.length > 0 && (
            <>
              <div className="border-t border-zinc-200 dark:border-zinc-800 my-4" />
              <div className="space-y-2.5">
                <h3 className={cn("text-sm font-semibold text-gray-900 dark:text-white", dmSans.className)}>
                  {COURSE_MESSAGES.TECHNOLOGIES_COVERED}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {course.technologies.slice(0, 5).map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs font-medium rounded-full px-2.5 py-0.5"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {course.technologies.length > 5 && (
                    <Badge variant="outline" className="text-xs rounded-full px-2.5 py-0.5">
                      +{course.technologies.length - 5}
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Divider */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 my-4" />

          {/* Stats row */}
          <div className="grid grid-cols-3 text-center">
            <div className="py-2">
              <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                {course?.averageRating?.toFixed(1) ?? "0.0"}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 flex items-center justify-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                Rating
              </p>
            </div>
            <div className="py-2 border-x border-zinc-200 dark:border-zinc-700">
              <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                {course?.studentCount ?? 0}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 flex items-center justify-center gap-1">
                <Users className="h-3 w-3 text-blue-500" />
                Students
              </p>
            </div>
            <div className="py-2">
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight whitespace-nowrap">
                {(((course as any)?.level?.replace(/_/g, " ")) ?? "All Levels").replace("ALL LEVELS", "All")}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 flex items-center justify-center gap-1">
                <BarChart3 className="h-3 w-3 text-emerald-500" />
                Level
              </p>
            </div>
          </div>

          {/* Share + Coupon */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 mt-4 pt-3">
            <div className="flex items-center justify-between gap-2">
              <ShareButton />
              <ApplyCouponCode />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
