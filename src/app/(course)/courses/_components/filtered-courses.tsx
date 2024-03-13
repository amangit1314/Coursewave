import React, { useEffect } from "react";
import { CourseItem } from "./course-item";
import { Category, Course } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

interface FilteredCoursesComponentProps {
  activeCategory: string | null;
  categories: Category[];
}

export function FilteredCoursesComponent({
  activeCategory,
  categories,
}: FilteredCoursesComponentProps) {
  const [loading, setLoading] = React.useState(true);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || ""; // Get the query string parameter "q"

  useEffect(() => {
    // https://localhost:3000
    fetch("/api/courses/")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to fetch courses");
        }
      })
      .then((data) => {
        setCourses(data.data); // Assuming your data.data is an array of courses
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, []); // Empty dependency array to ensure useEffect runs only once

  // const filteredCourses = activeCategory
  //   ? activeCategory === "All"
  //     ? courses
  //     : courses.filter(
  //         (course: Course) =>
  //           course.courseTitle.includes(activeCategory) ||
  //           (course.courseCategories &&
  //             course.courseCategories.includes(activeCategory))
  //       )
  //   : courses;

  const filteredCourses = activeCategory
    ? activeCategory === "All"
      ? courses.filter(
          (course) =>
            course.courseTitle
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (course.courseCategories &&
              course.courseCategories.some((cat) =>
                cat.toLowerCase().includes(searchQuery.toLowerCase())
              ))
        )
      : courses.filter(
          (course) =>
            course.courseTitle
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (course.courseCategories &&
              course.courseCategories.some((cat) =>
                cat.toLowerCase().includes(searchQuery.toLowerCase())
              ) &&
              course.courseCategories.includes(activeCategory))
        )
    : courses.filter(
        (course) =>
          course.courseTitle
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (course.courseCategories &&
            course.courseCategories.some((cat) =>
              cat.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );

  if (loading) {
    return (
      <div className="flex flex-wrap justify-center my-6 p-6 mx-auto ">
        <FilteredCoursesSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 max-w-7xl w-full gap-4 my-6 justify-center items-center mx-auto">
      {filteredCourses.map((course: Course) => (
        <CourseItem key={course.courseId} course={course} />
      ))}
    </div>
  );
}

function FilteredCoursesSkeleton() {
  return (
    <div className="max-w-7xl w-full justify-center mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
      <FilteredCourseSkeleton />
      <FilteredCourseSkeleton />
      <FilteredCourseSkeleton />
      <FilteredCourseSkeleton />
      <FilteredCourseSkeleton />
      <FilteredCourseSkeleton />
    </div>
  );
}

function FilteredCourseSkeleton() {
  return (
    <div className="flex flex-col space-y-3 mb-6">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
