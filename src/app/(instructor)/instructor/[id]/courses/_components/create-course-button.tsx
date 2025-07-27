"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { IoAddCircleOutline } from "react-icons/io5";

function CreateCourseButton(printCourses: any) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const instructorId = params.id;

  return (
    <Button
      onClick={() =>
        router.push(`/instructor/${instructorId}/courses/createCourse`)
      }
      className="ml-auto flex justify-center rounded-lg bg-blue-500 p-2 font-medium text-gray-300 shadow-xl hover:bg-blue-700 hover:font-semibold hover:text-white"
    >
      <IoAddCircleOutline size={22} />
      <p className="pl-1 font-semibold text-white">Create Course</p>
    </Button>
  );
}

export default CreateCourseButton;
