"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";
import { IoAddCircleOutline } from "react-icons/io5";
import { useUserInfo } from "@/hooks/useUserInfo";

function CreateCourseButton(printCourses: any) {
  const router = useRouter();
  const user = useUserInfo();

  return (
    <Button
      onClick={() =>
        router.push(`/instructor/${user.user?.id!}/courses/createCourse`)
      }
      className="ml-auto flex justify-center rounded-lg bg-blue-500 p-2 font-medium text-gray-300 shadow-xl hover:bg-blue-700 hover:font-semibold hover:text-white"
    >
      <IoAddCircleOutline size={22} />
      <p className="pl-1 font-semibold text-white">Create Course</p>
    </Button>
  );
}

export default CreateCourseButton;
