"use client";

import Image from "next/image";
import Link from "next/link";
import { LuDot } from "react-icons/lu";
import React, { useEffect } from "react";
import  RatingStars from "../RatingStars";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CourseCard } from "../../../browse/_components/CourseCard";
import { FaStar, FaUsers, FaClock, FaPlay } from "react-icons/fa";
import { Course } from "@/types/course";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@tremor/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const MoreIntructorCreatedCourses = ({
  instructorName,
  instructorCreatedCourses,
}: {instructorName: string, instructorCreatedCourses: Course[]}) => {

  if (!instructorCreatedCourses || instructorCreatedCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaPlay className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          No More Courses Available
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400">
          This instructor hasn't created any other courses yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
          More Courses by{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {instructorName || "Aman Soni"}
          </span>
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400">
          Explore other courses from this instructor
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructorCreatedCourses.map((course: Course) => (
          <MoreCreatedCourseNewItem key={course.id} course={course} />
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center pt-6">
        <Button 
          variant="outline" 
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600"
        >
          View All Courses by {instructorName}
        </Button>
      </div>
    </div>
  );
};

export const MoreCreatedCourseNewItem = ({ course }: { course: Course }) => {
  const router = useRouter();

  const onViewDetails = () => {
    router.push(`/courses/${course.id}`);
  };

  return (
    <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-800 hover:scale-105">
      <div className="relative">
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            src={course.imageUrl ?? "/assets/images/android-jetpack.jpg"}
            alt={course.title || "Course"}
            width={400}
            height={200}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <Badge className="bg-blue-500 text-white border-0">
              {course.isFree ? "Free" : `$${course.price}`}
            </Badge>
            <Badge className="bg-yellow-500 text-white border-0 flex items-center gap-1">
              <FaStar className="w-3 h-3" />
              {course.averageRating?.toFixed(1) || "4.9"}
            </Badge>
          </div>

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <FaPlay className="w-6 h-6 text-blue-600 ml-1" />
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Course Title */}
        <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title || "Course Title"}
        </h4>

        {/* Instructor */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          By {course.instructor?.user?.name || "Instructor"}
        </p>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          <div className="flex items-center gap-1">
            <FaUsers className="w-4 h-4" />
            <span>{course.totalStudents?.toLocaleString() || "0"} students</span>
          </div>
          <div className="flex items-center gap-1">
            <FaClock className="w-4 h-4" />
            <span>{course.totalLessons || "0"} lessons</span>
          </div>
        </div>

        {/* Categories */}
        {course.categories && course.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {course.categories.slice(0, 2).map((category) => (
              <Badge key={category.id} variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            ))}
            {course.categories.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{course.categories.length - 2} more
              </Badge>
            )}
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {course.isFree ? (
              <span className="text-lg font-bold text-green-600">Free</span>
            ) : (
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                ${course.price}
              </span>
            )}
          </div>
          <Button 
            size="sm" 
            onClick={onViewDetails}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600"
          >
            View Course
          </Button>
        </div>
      </CardContent>
    </Card>
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
            <p className="text-md tracking-tight font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-2">
              {title ? title : "Full Stack Development Bootcamp"}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-thin ">
              {instructorName ? instructorName : "Aman Soni"}
            </p>

            <div className="flex justify-start items-center">
              <RatingStars courseStarRatings={avgRating ? avgRating : 4.9} />
              <p className="flex justify-start items-center text-xs">
                <LuDot className="text-blue-500" size={20} />
                <p>{numberOfEnrollments ? numberOfEnrollments : 20} enrolled</p>
              </p>
            </div>

            <p className="text-zinc-800 dark:text-white text-lg tracking-tight font-semibold">
              ${price ? price : "19"}
            </p>
          </div>
        </div>
      </div>
    </Link>
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

export const CourseSkeleton = () => {
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};
