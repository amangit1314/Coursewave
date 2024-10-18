"use client";

import Image from "next/image";
import Link from "next/link";
import { LuDot } from "react-icons/lu";
import React, { useEffect } from "react";
import  RatingStars from "../rating-stars";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CourseCard } from "../course-card";
import { FaStar } from "react-icons/fa";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@tremor/react";
import { CourseWithOtherFields } from "@/types/course-with-other-fields";

export const MoreIntructorCreatedCourses = ({
  // instructorId,
  instructorName,
  instructorCreatedCourses,
}: {instructorName: string, instructorCreatedCourses: CourseWithOtherFields[]}) => {


  return (
    <div className="md:mt-8  max-w-7xl w-full items-center overflow-x-hidden">
      <div className="flex justify-start items-center space-x-2 mb-8">
        <p className="text-xl tracking-tight font-semibold text-gray-800 dark:text-gray-100">
          More Courses by
        </p>
        <strong className="text-xl tracking-tighter font-bold text-blue-500">
          {instructorName ? instructorName : "Aman Soni"}
        </strong>
      </div>

      <ScrollArea className="w-full md:w-[1080px] whitespace-nowrap">
        {instructorCreatedCourses ? (
          <div className="flex w-max space-x-4 pb-4">
            {instructorCreatedCourses.map((course: CourseWithOtherFields) => {
              return (
                <div key={course.courseId}>
                  <MoreCreatedCourseNewItem course={course} />
                </div>
              );
            })}
          </div>
        ) : (
          <div></div>
        )}

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

type CreatedCourseProps = {
  courseId: string;
  image: string;
  title: string;
  avgRating: number;
  instructorName: string;
  numberOfEnrollments: number;
  price: string;
};

export const MoreCreatedCourseNewItem = ({ course }: { course: CourseWithOtherFields }) => {
  const router = useRouter();

  const onViewDetails = () => {
    router.push(`/courses/${course.courseId}`);
  };

  return (
    <Link
      href={`/courses/${course.courseId}`}
      key={course.courseId}
      onClick={onViewDetails}
      className="group cursor-pointer border border-stroke hover:border-zinc-700 dark:border-none rounded-3xl max-h-[13rem] h-full md:max-w-[20rem] w-full dark:hover:bg-zinc-800 transition-all duration-300 hover:bg-white dark:hover:border-neutral-700 dark:bg-neutral-800/30"
    >
      {/* Course Image */}
      <div className="relative">
        <Image
          className="max-h-[8.5rem] h-full md:w-[17rem] w-full bg-slate-700 rounded-t-3xl relative left-0 right-0 object-cover"
          src={course.courseImage ?? "./assets/images/android-jetpack.jpg"}
          alt="Next.js Logo"
          width={250}
          height={35}
          style={{
            objectFit: "cover",
          }}
        />

        <div className="flex justify-between items-center absolute bottom-2 right-0 left-0 md:w-[17rem] px-2">
          {/* course star ratings */}
          <div className="flex flex-row justify-center item-center rounded-badge text-xs px-2 py-1 border border-none border-stroke bg-zinc-900 text-white dark:border dark:border-stroke space-x-1">
            <FaStar className="text-yellow-400 mt-[1px]" />
            <p className="font-medium">
              {course.avgStarRatings ? course.avgStarRatings.toFixed(1) : 5.0}
            </p>
          </div>

          {/* course price badge */}
          <Badge className="dark:bg-zinc-900 dark:text-white">
            {course.isFree ? (
              "Free"
            ) : (
              <div className="flex justify-start items-center space-x-1">
                <span className="font-semibold text-yellow-400 text-sm">$</span>
                <p className="text-xs font-medium">{course.coursePrice}</p>
              </div>
            )}
          </Badge>
        </div>
      </div>

      <div className="p-2.5">
        {/* Course Title */}
        <p className="text-md text-[#333333] dark:text-white tracking-tight mt-1 mr-3 font-semibold line-clamp-1">
          {course.courseTitle ? course.courseTitle : "Aman Soni"}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center py-auto">
            <div className="flex justify-start items-center space-x-1">
              <p className="text-xs text-gray-600 tracking-tight dark:text-gray-400">
                By
              </p>
              <p className="text-xs font-medium hover:underline text-gray-600  tracking-tight dark:text-gray-400">
                {course.instructorName ? course.instructorName : "Aman Soni"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const MoreCreatedCourseItem = ({
  courseId,
  image,
  title,
  avgRating,
  instructorName,
  numberOfEnrollments,
  price,
}: CreatedCourseProps) => {
  return (
    <Link href={`/courses/${courseId}`}>
      <div className="bg-transparent dark:bg-zinc-800 rounded-md max-w-[17rem] w-full">
        <Image
          src={image ? image : "/assets/images/cards/cards-01.png"}
          alt={`Image`}
          objectFit="cover"
          width={272}
          height={160}
          className="h-[160px] w-[17rem] rounded-t-md justify-center"
        />

        <div className="pt-2 ">
          <div className="items-start mr-auto text-base">
            <p className="text-md tracking-tight font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
              {title ? title : "Full Stack Development Bootcamp"}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-thin ">
              {instructorName ? instructorName : "Aman Soni"}
            </p>

            <div className="flex justify-start items-center">
              <RatingStars courseStarRatings={avgRating ? avgRating : 4.9} />
              <p className="flex justify-start items-center text-xs">
                <LuDot className="text-blue-500" size={20} />
                <p>{numberOfEnrollments ? numberOfEnrollments : 20} enrolled</p>
              </p>
            </div>

            <p className="text-gray-800 dark:text-white text-lg tracking-tight font-semibold">
              ${price ? price : "19"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const CourseSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3 mb-6">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};
