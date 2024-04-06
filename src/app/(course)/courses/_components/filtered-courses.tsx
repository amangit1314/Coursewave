"use client";

import React from "react";
import { Category, Course } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { CourseCard } from "./course-card";
import useCourses from "@/hooks/use-courses";

interface FilteredCoursesComponentProps {
  activeCategory: string | null;
  categories: Category[];
}

export function FilteredCoursesComponent({
  activeCategory,
  categories,
}: FilteredCoursesComponentProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const courses = useCourses();
  console.log("Courses from api: ", courses);

  const coursesFilteredByCategories = activeCategory
    ? activeCategory === "All"
      ? courses?.courses
      : courses?.courses?.filter(
          (course: Course) =>
            course.courseTitle.includes(activeCategory) ||
            (course.courseCategories &&
              course.courseCategories.includes(activeCategory))
        )
    : courses?.courses;

  const coursesFilteredOnSearchInput = activeCategory
    ? activeCategory === "All"
      ? courses?.courses?.filter(
          (course: Course) =>
            course.courseTitle
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (course.courseCategories &&
              course.courseCategories.some((cat) =>
                cat.toLowerCase().includes(searchQuery.toLowerCase())
              ))
        )
      : courses?.courses?.filter(
          (course: Course) =>
            course.courseTitle
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (course.courseCategories &&
              course.courseCategories.some((cat) =>
                cat.toLowerCase().includes(searchQuery.toLowerCase())
              ) &&
              course.courseCategories.includes(activeCategory))
        )
    : courses?.courses?.filter(
        (course: Course) =>
          course.courseTitle
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (course.courseCategories &&
            course.courseCategories.some((cat) =>
              cat.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );

  const filteredCourses = searchQuery
    ? coursesFilteredOnSearchInput
    : coursesFilteredByCategories;

  if (courses.isLoading) {
    return (
      <div className="flex flex-wrap justify-center my-6 p-6 mx-auto ">
        <FilteredCoursesSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 max-w-7xl w-full gap-4 my-6 justify-center items-center mx-auto">
      {filteredCourses.map((course: Course) => (
        <CourseCard key={course.courseId} course={course} />
      ))}
    </div>
  );
}

function FilteredCoursesSkeleton() {
  return (
    <div className="max-w-7xl w-full justify-center mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
