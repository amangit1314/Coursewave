"use client";

import React from "react";
import { FiEdit2 } from "react-icons/fi";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface CourseProps {
  index: string;
  courseImage: string;
  courseNumber: string;
  title: string;
  duration?: string;
  subject?: string;
  instructor: string;
  price: string;
  categories?: string[];
  instructorId?: string;
  // onClickToEditButton?: VoidFunction;
}

function CreatedCourseWidget({
  index,
  instructorId,
  courseImage,
  courseNumber,
  title,
  duration,
  subject,
  instructor,
  price,
  categories,
}: CourseProps) {
  const router = useRouter();
  const params = useParams();

  const onViewDetails = () => {
    router.push(`/browseCourses/courseDetails/${instructorId}`);
  };

  const onClickToEditButton = () => {
    //* here index is my courseId
    router.push(
      `/instructor/${instructorId}/courses/createdCourses/${index}/editCourse`,
    );
  };

  return (
    <div
      onClick={onViewDetails}
      key={index}
      className="relative h-60 w-full max-w-80 overflow-hidden rounded-xl shadow-lg hover:cursor-pointer"
    >
      {/* Background Image */}
      <Image
        className="absolute h-full w-full rounded-lg bg-slate-700 opacity-80"
        src={courseImage}
        alt="Course Image"
        layout="fill"
        objectFit="cover"
        priority
      />

      {/* Blurred Overlay
            <div className='absolute inset-0 bottom-0 left-0 right-0 h-30 backdrop-blur-sm bg-opacity-30 bg-gray-800 rounded-lg'></div> */}

      {/* Content */}
      <div className="h-30 absolute inset-0 bottom-0 left-0 right-0 top-[10rem] flex items-start justify-between rounded-bl-lg rounded-br-lg bg-black bg-opacity-70 pl-4 backdrop-blur-lg">
        <div>
          <div className="mt-3 text-xs font-thin text-gray-400"> {index} </div>
          <div className="mb-3 w-10/12 text-clip text-sm font-medium text-gray-200">
            {" "}
            {title}{" "}
          </div>
        </div>
        <button
          onClick={onClickToEditButton}
          className="mr-3 mt-5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-600"
        >
          <FiEdit2 />
        </button>
      </div>
    </div>
  );
}

export default CreatedCourseWidget;
