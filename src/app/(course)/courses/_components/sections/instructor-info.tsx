"use client";

import Image from "next/image";
import { Course } from "@prisma/client";
import React, { useEffect } from "react";
import "swiper/css";
import useInstructorInfo from "@/hooks/use-instructor-info";
import { Separator } from "@/components/ui/separator";
import { Callout } from "@tremor/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

export const InstructorCard = ({ instructorId }: { instructorId: string }) => {
  console.log(`Instructor id in the instructor-info.tsx: ${instructorId} `);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<String | null>(null);
  const [instructorCreatedCourses, setInstructorCreatedCourses] =
    React.useState<Course[]>([]);

  const instructorData = useInstructorInfo(instructorId);
  const instructor = instructorData.instructor;

  useEffect(() => {
    const fetchInstructorCreatedCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `api/instructor/${instructorId}/dashboard/courses`
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

  const fetchInstructorStudentsCount = async () => {
    const response = await fetch(
      `api/instructor/${instructorId}/dashboard/courses/totalStudents`
    );

    if (!response.ok) {
      console.log("Failed to fetch instructor students count from api ...");
    }

    const data = await response.json();
    console.log('Instructor students count json data before returning ...');
    return data; 
  };

  const {
    data: instructorStudentsCountData,
    isLoading: instructorStudentsCountLoading,
    error: instructorStudentsCountError,
  } = useQuery({
    queryKey: ["instructorStudentsCount"],
    queryFn: fetchInstructorStudentsCount,
    staleTime: 4,
  });

  const fetchInstructorTotalReviewsCount = async () => {
    const response = await fetch(
      `api/instructor/${instructorId}/dashboard/courses/totalReviews`
    );

    if (!response.ok) {
      console.log("Failed to fetch instructor reviews count from api ...");
      setError("Failed to fetch instructor reviews count from api ...");
    }

    const data = await response.json();
    return data.data; // Ensure correct data return
  };

  const {
    data: instructorReviewsCountData,
    isLoading: instructorTotalReviewsCountLoading,
    error: instructorTotalReviewsCountError,
  } = useQuery({
    queryKey: ["instructorTotalReviewsCount"],
    queryFn: fetchInstructorTotalReviewsCount,
    staleTime: 4,
  });

  if (
    loading ||
    instructorTotalReviewsCountLoading ||
    instructorStudentsCountLoading
  ) {
    return <InstructorCardLoadingSkeleton />;
  }

  if (
    error ||
    instructorStudentsCountError ||
    instructorTotalReviewsCountError
  ) {
    const errorMessage =
      error ||
      instructorStudentsCountError?.message ||
      instructorTotalReviewsCountError?.message;

    return (
      <Callout className="" title="Failed to Fetch Data" color="red">
        ERROR: <span>{errorMessage}</span>
      </Callout>
    );
  }

  const instructorStudentsCount = instructorStudentsCountData as number;
  const instructorTotalReviewsCount = instructorReviewsCountData as number;

  return (
    <div className="flex flex-col my-4 md:mt-4 md:mb-0 max-w-7xl justify-start">
      <div className="flex flex-col md:flex-row justify-start items-start rounded-xl mb-6">
        <div className="flex flex-col space-y-2">
          <Image
            src={
              instructor
                ? instructor.instructorProfilePicUrl
                : "https://wcgwzdehnxpexussrkni.supabase.co/storage/v1/object/public/assets/green-3d.jpg"
            }
            alt={`Image`}
            height={150}
            width={150}
            objectFit="cover"
            quality={100}
            className="rounded-xl object-cover flex items-center justify-start h-[10rem] w-[16rem] ring-1 ring-white"
          />

          <div className="flex flex-col items-start text-start text-base max-w-[16rem] w-full">
            <p className="text-lg text-gray-800 dark:text-slate-200 line-clamp-1 tracking-tight font-semibold">
              {instructor ? instructor.instructorName : "Aman Soni"}
            </p>
            <p className="text-sm line-clamp-2 tracking-tight text-gray-700 dark:text-gray-400 font-thin ">
              {instructor ? instructor.instructorTag : "Full Stack Engineer"}
            </p>
          </div>
        </div>

        <div className="mt-4 md:mt-0 md:px-6 md:ml-6">
          <div>
            <p className="text-lg text-gray-800 dark:text-slate-200 tracking-tight mb-1 font-semibold">
              About Instructor
            </p>

            <p className="text-sm md:text-md text-start md:text-base md:text-md max-w-3xl w-full line-clamp-3 md:line-clamp-4 font-normal text-gray-700 dark:text-gray-400">
              {instructor
                ? instructor.aboutInstructor
                : `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos odit nam quae repellat quis cumque reiciendis autem ab expedita Provident eos odit nam quae repellat. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos odit nam quae repellat quis cumque reiciendis autem ab expedita Provident eos odit nam quae repellat.`}
            </p>
          </div>

          <div className="border-t pt-8 mt-4">
            <div className="flex h-5 items-center space-x-4 text-sm">
              <div>
                <p className="uppercase text-sm font-medium text-gray-800 dark:text-white">
                  Courses
                </p>
                <p className="text-xl font-bold text-black dark:text-white">
                  {instructorCreatedCourses.length}
                </p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p className="uppercase text-sm font-medium text-gray-800 dark:text-white">
                  Students
                </p>
                <p className="text-xl font-bold text-black dark:text-white">
                  {instructorStudentsCount}
                </p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p className="uppercase text-sm font-medium text-gray-800 dark:text-white">
                  Reviews
                </p>
                <p className="text-xl font-bold text-black dark:text-white">
                  {instructorTotalReviewsCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col space-y-4">
        {instructorCreatedCourses.map((course) => (
          <div
            key={course.courseId}
            className="flex flex-col p-4 bg-gray-100 rounded-md"
          >
            <Image
              src={course?.courseImage!}
              alt={course.courseTitle}
              height={100}
              width={100}
              objectFit="cover"
              className="rounded-md"
            />
            <p className="text-lg font-semibold">{course.courseTitle}</p>
            <p className="text-sm">{course.courseDescription}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
};

const InstructorCardLoadingSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row justify-start items-start rounded-xl mb-6 ">
      <div className="flex flex-col space-y-3 mb-6">
        <Skeleton className="rounded-xl flex items-center justify-start h-[10rem] w-[16rem] " />

        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      <div className="space-y-4 md:px-6">
        <Skeleton className="h-8 w-[200px]" />

        <div className="space-y-2 max-w-screen w-full">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="flex justify-start items-center space-x-4 text-sm">
          <div className="space-y-1">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-8 w-[50px]" />
          </div>

          <Separator orientation="vertical" />

          <div className="space-y-1">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-8 w-[50px]" />
          </div>

          <Separator orientation="vertical" />

          <div className="space-y-1">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-8 w-[50px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
