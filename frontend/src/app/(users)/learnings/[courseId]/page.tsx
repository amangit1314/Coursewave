"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import CourseDetails from "./_components/CourseDetails";

const CourseContentPage = () => {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  return (
    <div className="h-auto overflow-x-hidden py-16">
      <CourseDetails courseId={courseId} />
      <div className="h-12 w-2" />
    </div>
  );
};

export default CourseContentPage;
