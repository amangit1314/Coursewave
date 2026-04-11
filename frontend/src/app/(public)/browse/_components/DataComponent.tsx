"use client";

import React from "react";
import CourseWidget from "./CourseWidget";

import { Callout } from "@tremor/react";
import { useCoursesStore } from "@/zustand/coursesStore";
import { Course } from "@/types/course-details-api-response";
import { useCourses } from "@/hooks/useCourses";

const DataComponent = () => {
  const {
    data: courses,
    isLoading: areCoursesLoading,
    error: coursesError,
  } = useCourses();

  if (areCoursesLoading) {
    return (
      <div className="mx-auto my-6 grid w-9/12 grid-cols-1 justify-start gap-10 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="h-48 w-full rounded-lg bg-gray-200"></div>
            <div className="mt-4 space-y-3">
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              <div className="flex justify-between">
                <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/4 rounded bg-gray-200"></div>
              </div>
              <div className="h-8 w-full rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (coursesError) {
    return (
      <Callout
        title="Error fetching courses in data-components.tsx 🚨❌"
        color="red"
      >
        {coursesError.message} 🚨❌...
      </Callout>
    );
  }

  return (
    <div className="mx-auto my-6 grid w-9/12 grid-cols-1 justify-start gap-10 md:grid-cols-2 lg:grid-cols-3">
      {Array.isArray(courses) ? (
        courses.map((course: Course, index: number) => (
          <CourseWidget
            key={index}
            index={index.toString()}
            title={course.title}
            courseImage={course.imageUrl ?? "/assets/images/cover/cover-01.png"}
            courseNumber={course.id}
            duration="60"
            subject="Development"
            instructor={course.instructorId?.split("-")[0] || "Aman Soni"}
            instructorId={course.instructorId?.split("-")[0] || "Aman Soni"}
            price={course.price!.toString()}
            categories={course.categories.map((category) => category)}
          />
        ))
      ) : (
        <>
          <pre>{JSON.stringify(courses, null, 2)}</pre>
        </>
      )}
    </div>
  );
};

export default DataComponent;
