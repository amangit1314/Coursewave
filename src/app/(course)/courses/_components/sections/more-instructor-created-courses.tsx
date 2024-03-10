"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { RatingStars } from "../rating-stars";
import { LuDot } from "react-icons/lu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Course } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

function MoreIntructorCreatedCourses({ instructorId, instructorName }: any) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<String | null>(null);
  const [instructorCreatedCourses, setInstructorCreatedCourses] =
    React.useState<Course[]>([]);

  useEffect(() => {
    const fetchInstructorCreatedCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/instructor/${instructorId}/dashboard/courses`
        );

        if (!response.ok) {
          console.log(
            "Failed to fetch instructor created courses from api ..."
          );
          setError("Failed to fetch instructor created courses from api ...");
        }

        const data = await response.json();
        setInstructorCreatedCourses(data.data);
      } catch (error: any) {
        console.log(
          "Failed to fetch instructor created courses from api, ERROR: ",
          error.message
        );
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorCreatedCourses();
  }, [instructorId]);

  if (loading) {
    return (
      <ScrollArea className="w-full md:w-[1080px] whitespace-nowrap">
        <div className="grid grid-cols-3 w-max space-x-4 pb-4">
          <CourseSkeleton />
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }

  if (error) {
    return <div>ERROR: {error}</div>;
  }

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
            {instructorCreatedCourses.map((course) => {
              return (
                <div key={course.courseId}>
                  <MoreCreatedCourseItem
                    courseId={course.courseId}
                    image={course.courseImage}
                    title={course.courseTitle}
                    avgRating={4.9}
                    instructorName={course.instructorName!}
                    numberOfEnrollements={12}
                    price={course.coursePrice}
                  />
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
}

export default MoreIntructorCreatedCourses;

type CreatedCourseProps = {
  courseId: string;
  image: string;
  title: string;
  avgRating: number;
  instructorName: string;
  numberOfEnrollements: number;
  price: string;
};

function MoreCreatedCourseItem({
  courseId,
  image,
  title,
  avgRating,
  instructorName,
  numberOfEnrollements,
  price,
}: CreatedCourseProps) {
  return (
    <Link href={`/courses/${courseId}`}>
      <div className="bg-transparent rounded-md max-w-[17rem] w-full">
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
                <p>
                  {numberOfEnrollements ? numberOfEnrollements : 20} enrolled
                </p>
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
}

function CourseSkeleton() {
  return (
    <div className="flex flex-col space-y-3 mb-6">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
