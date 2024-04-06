"use client";

import Image from "next/image";
import { Course } from "@prisma/client";
import React, { useEffect } from "react";
import "swiper/css";
import useInstructorInfo from "@/hooks/use-instructor-info";
import { Separator } from "@/components/ui/separator";
import { Divider } from "@tremor/react";

export default function InstructorCard({
  instructorId,
}: {
  instructorId: string;
  }) {
  console.log(`Instructor id in the instructor-info.tsx: ${instructorId} `)
  const instructor = useInstructorInfo(instructorId);
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
    return <div>...Loading</div>
  }

  if (error) {
    return <div>ERROR: {error}</div>;
  }

  return (
    <div className="flex flex-col my-4 md:mt-4 md:mb-0 max-w-7xl justify-start">
      <div className="flex flex-col md:flex-row justify-start items-start rounded-xl mb-6">
        <div className="flex flex-col space-y-2">
          <Image
            src={
              instructor.data
                ? instructor.data.instructorProfilePicUrl
                : "/assets/images/cards/cards-01.png"
            }
            alt={`Image`}
            height={150}
            width={150}
            objectFit="cover"
            className="rounded-xl flex items-center justify-start h-[10rem] w-[16rem] ring-1 ring-white"
          />

          <div className="flex flex-col items-start text-start text-base">
            <p className="text-lg text-gray-800 dark:text-slate-200 line-clamp-1 tracking-tight font-semibold">
              {instructor.data ? instructor.data.instructorName : "Aman Soni"}
            </p>
            <p className="text-sm line-clamp-2 tracking-tight text-gray-700 dark:text-gray-400 font-thin ">
              {instructor.data
                ? instructor.data.instructorTag
                : "Full Stack Engineer"}
            </p>
          </div>
        </div>

        <div className="mt-4 md:mt-0 md:px-6 md:ml-6">
          <p className="text-lg text-gray-800 dark:text-slate-200 tracking-tight mb-1 font-semibold">
            About Instructor
          </p>
          {/* hidden md:visible */}
          <p className="text-sm md:text-md text-start md:text-base md:text-md max-w-3xl w-full line-clamp-3 md:line-clamp-4 font-noraml text-gray-700 dark:text-gray-400">
            {instructor.data
              ? instructor.data.aboutInstructor
              : `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident
          eos odit nam quae repellat quis cumque reiciendis autem ab expedita
          Provident eos odit nam quae repellat. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident
          eos odit nam quae repellat quis cumque reiciendis autem ab expedita
          Provident eos odit nam quae repellat.
          `}
          </p>

          {/* Stats */}
          <div>
            <Divider />
            <div className="flex h-5 items-center space-x-4 text-sm">
              <div>
                <p className="uppercase text-sm font-medium ">Courses</p>
                <p className="text-xl font-bold text-black dark:text-white">
                  {instructorCreatedCourses
                    ? instructorCreatedCourses.length
                    : 0}
                </p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p className="uppercase text-sm font-medium ">Students</p>
                <p className="text-xl font-bold text-black dark:text-white">
                  170
                </p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p className="uppercase text-sm font-medium ">Reviews</p>
                <p className="text-xl font-bold text-black dark:text-white">
                  164
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
