"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { FiHeart, FiUsers, FiClock } from "react-icons/fi";
import { Course } from "@/types/";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils/utils";
import { IoMdHeart } from "react-icons/io";
import { poppins, dmSans } from "@/lib/config/fonts";
import { useCurrencyStore } from "@/zustand/currencyStore";
import { useAddToWishlist } from "@/hooks/useWishlist";

export const CourseCard = ({ course }: { course: Course }) => {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { formatPrice } = useCurrencyStore();
  const { mutate: wishlistCourse } = useAddToWishlist();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((prev) => !prev);
    wishlistCourse(course.id);
  };

  // Calculate if there's a discount
  const hasDiscount =
    course?.dealPrice && course?.price && course.dealPrice < course.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((course.price - (course.dealPrice ?? 0)) / course.price) * 100
      )
    : 0;

  console.log("Courses: ", JSON.stringify(course));

  return (
    <div
      className={cn(
        "group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl border bg-white dark:bg-zinc-900/50 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-600",
        "border-zinc-200 dark:border-zinc-800 md:max-w-[17rem]"
      )}
    >
      <Link href={`/courses/${course.id}`} className={poppins.className}>
        {/* Image Wrapper with overlay gradient */}
        <div className="relative w-full h-[10rem] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-zinc-200 dark:bg-zinc-700" />
          )}

          <Image
            src={course.imageUrl ?? "/assets/images/cover/cover-01.png"}
            alt={course.title || "Course image"}
            fill
            className={cn(
              "object-cover object-center transition-all duration-500 group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Wishlist button with improved styling */}
          <button
            onClick={handleWishlistToggle}
            className={cn(
              "absolute top-3 left-3 z-10 rounded-full p-2 shadow-lg backdrop-blur-md transition-all duration-300 outline-transparent outline-0 ring-0 ring-transparent bg-white/90 hover:bg-white hover:scale-110 dark:bg-zinc-900/90 dark:hover:bg-zinc-800",
              wishlisted && "scale-110"
            )}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wishlisted ? (
              <IoMdHeart className="text-red-500 w-4 h-4" />
            ) : (
              <FiHeart className="w-4 h-4 text-zinc-800 dark:text-white" />
            )}
          </button>
        </div>

        {/* Card Body */}
        <div className="flex flex-col gap-2 p-4">
          {/* Title */}
          <h3
            className={`${dmSans.className} text-base font-bold tracking-tight text-zinc-900 dark:text-white line-clamp-2  leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200`}
          >
            {course.title || "Course Title"}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-1.5 text-sm">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {course.instructor?.user?.profileImageUrl ? (
                <Image
                  src={course.instructor.user.profileImageUrl}
                  alt={course.instructor.user.name ?? "Instructor"}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
              ) : (
                (course.instructor?.user?.name?.[0]?.toUpperCase() ?? "I")
              )}
            </div>
            <span className="text-zinc-500 dark:text-zinc-400 text-xs">by</span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 line-clamp-1 text-sm">
              {course.instructor?.user?.name ?? "Instructor"}
            </span>
          </div>

          {/* Pricing Section */}
          <div className="flex items-center justify-start gap-2 flex-wrap mt-1">
            {/* Current Price (dealPrice if available, otherwise regular price) */}
            <span
              className={cn(
                "text-lg font-extrabold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent",
                dmSans.className
              )}
            >
              {course?.isFree
                ? "Free"
                : `${formatPrice(course?.dealPrice ?? course?.price ?? 499)}`}
            </span>

            {/* Original Price (show only when there's a discount) */}
            {!course?.isFree && hasDiscount && (
              <span
                className={cn(
                  "text-sm text-gray-400 dark:text-gray-500 line-through",
                  dmSans.className
                )}
              >
                {formatPrice(course.price)}
              </span>
            )}

            {/* Discount Badge (inline version for card body) */}
            {!course?.isFree && hasDiscount && discountPercentage > 0 && (
              <Badge
                className={cn(
                  "bg-red-500 rounded-full text-white border-0 px-2 py-0.5 font-bold text-xs",
                  dmSans.className
                )}
              >
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1">
                <FaStar className="text-amber-500 w-3.5 h-3.5" />
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  {course.averageRating?.toFixed(1) ?? "5.0"}
                </span>
              </div>
            </div>

            {/* Additional metadata */}
            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
              {/* Students count (example) */}
              <div
                className="flex items-center gap-1"
                title="Students enrolled"
              >
                <FiUsers className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">
                  {course.studentCount && course.studentCount > 999
                    ? (course.studentCount / 1000).toFixed(1) + "k"
                    : (course.studentCount ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Hover effect glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-indigo-500/10 group-hover:to-cyan-500/10 transition-all duration-500 pointer-events-none" />
    </div>
  );
};
