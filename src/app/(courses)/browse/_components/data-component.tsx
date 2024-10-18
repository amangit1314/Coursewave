"use client";

import React from "react";
import CourseWidget from "./course-widget";

import { Course } from "@prisma/client";
import { Callout } from "@tremor/react";
import { useCoursesStore } from "@/zustand/coursesStore";


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
            title={course.courseTitle}
            courseImage={
              course.courseImage ?? "/assets/images/cover/cover-01.png"
            }
            courseNumber={course.courseId}
            duration="60"
            subject="Development"
            instructor={course.instructorID?.split("-")[0] || "Aman Soni"}
            instructorId={course.instructorID?.split("-")[0] || "Aman Soni"}
            price={course.coursePrice!}
            categories={course.courseCategories}
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
