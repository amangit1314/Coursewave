"use client";

import React from "react";
import CourseWidget from "./CourseWidget";

import { Callout } from "@tremor/react";
import { useCoursesStore } from "@/zustand/coursesStore";
import { Course } from "@/types/course-details-api-response";


const DataComponent = () => {
  const { loadingState, courses, fetchCourses } = useCoursesStore();

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (loadingState.error) {
    return (
      <Callout
        title="Error fetching courses in data-components.tsx 🚨❌"
        color="red"
      >
        {loadingState.error} 🚨❌...
      </Callout>
    );
  }

  console.log("Courses in the Data component : ", courses);

  return (
    <div className="mx-auto my-6 grid w-9/12 grid-cols-1 justify-start gap-10 md:grid-cols-2 lg:grid-cols-3">
      {Array.isArray(courses) ? (
        courses.map((course: Course, index: number) => (
          <CourseWidget
            key={index}
            index={index.toString()}
            title={course.title}
            courseImage={
              course.imageUrl ?? "/assets/images/cover/cover-01.png"
            }
            courseNumber={course.id}
            duration="60"
            subject="Development"
            instructor={course.instructorId?.split("-")[0] || "Aman Soni"}
            instructorId={course.instructorId?.split("-")[0] || "Aman Soni"}
            price={course.price!}
            categories={course.categories.map((category) => category.name)}
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
