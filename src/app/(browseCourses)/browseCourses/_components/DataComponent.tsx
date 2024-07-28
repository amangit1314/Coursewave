"use client";

import React from "react";
import { Course } from "@prisma/client";
import CourseWidget from "./course-widget";
import { useZustandStore } from "@/zustand/store";

// const getCourses = async () => {
//   try {
//     const res = await fetch("api/courses");
//     if (!res.ok) {
//       throw new Error("Could not retrieve courses");
//     }
//     console.log(res.json.toString());
//     return res.json();
//   } catch (error: any) {
//     console.error("Error fetching courses:", error.message);
//     throw error;
//   }
// };

const DataComponent = () => {
  // const courses = await getCourses();
  const { loading, courses, fetchCourses } = useZustandStore();

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  console.log("Courses in the Data component : ", courses);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 my-6 w-9/12 justify-start mx-auto">
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
