"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { FiHeart, FiHeart as FiHeartFilled } from "react-icons/fi";
import { Course } from "@/types/";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils/utils";
import { IoMdHeart } from "react-icons/io";
import { poppins } from "@/lib/config/fonts";

export const CourseCard = ({ course }: { course: Course }) => {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((prev) => !prev);
    // TODO: Hook this to a wishlist system
  };

  console.log("Courses: ", JSON.stringify(course));

  return (
    <div
      className={cn(
        "group relative h-full w-full cursor-pointer overflow-hidden rounded-3xl border bg-white dark:bg-neutral-900 shadow-sm transition-all duration-200 hover:shadow-xl hover:border-gray-600 dark:hover:border-gray-400",
        "border-zinc-200 dark:border-zinc-800 md:max-w-[17rem]"
      )}
    >
      <Link href={`/courses/${course.id}`} className={poppins.className}>
        {/* Image Wrapper */}
        <div className="relative w-full h-[9.5rem] overflow-hidden rounded-t-3xl">
          <Image
            src={course.imageUrl ?? "/assets/images/cover/cover-01.png"}
            alt={course.title || "Course image"}
            fill
            className="object-cover object-center"
          />

          {/* Wishlist */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 left-2 z-10 rounded-full bg-white/90 p-2 text-zinc-800 shadow-md hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black outline-transparent outline-0 ring-0 ring-transparent"
          >
            {wishlisted ? <IoMdHeart className="text-red-500" /> : <FiHeart />}
          </button>
        </div>

        {/* Card Body */}
        <div className="flex flex-col justify-between p-4">
          {/* Title */}
          <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white line-clamp-2">
            {course.title || "Course Title"}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-1 text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">By</span>
            <span className="font-medium text-blue-700 dark:text-blue-300 line-clamp-1">
              {course.instructor?.user?.name ?? "Instructor"}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 mt-2">
            <Badge className="flex items-center gap-1 rounded-full border-none bg-yellow-400/90 px-3 py-1 text-xs font-semibold text-zinc-900 dark:bg-yellow-500/90">
              <FaStar className="text-yellow-600 dark:text-yellow-700" />
              <span>{course.averageRating?.toFixed(1) ?? "5.0"}</span>
            </Badge>
            {/* <Badge
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                course.isFree
                  ? "bg-green-500/90 text-white"
                  : "bg-blue-600/90 text-white"
              )}
            >
              {course.isFree ? "Free" : `$${course.price}`}
            </Badge> */}
            <Badge
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                course.isFree
                  ? "bg-green-500/90 text-white"
                  : "bg-blue-600/90 text-white"
              )}
            >
              {course.isFree ? "Free" : `$${course.price ?? 0}`}
            </Badge>
          </div>
        </div>
      </Link>
    </div>
  );
};
