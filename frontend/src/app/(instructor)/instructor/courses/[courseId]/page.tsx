"use client";

import React from "react";
import CourseContent from "./_components/CourseContent";
import { Course } from "@/types/course";
import { useCourse } from "@/hooks/useCourses";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const CourseIdPage = () => {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  const { data: course, isLoading, error } = useCourse(courseId); // data is now the course directly

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-800 bg-red-100 p-4 rounded-xl max-w-md">
          <p className="font-semibold">Error loading course</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>No course data found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {course ? (
        <CourseContent
          course={course as unknown as Course}
        />
      ) : (
        <div className="p-6 text-center text-gray-500">
          No course data found...
        </div>
      )}
    </div>
  );
};

export default CourseIdPage;
