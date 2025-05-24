"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CourseCard } from "./course-card";
import { useCoursesStore } from "@/zustand/coursesStore";
import { FilteredCoursesSkeleton } from "./skeleton/filtered-courses-sekelton";
import { CoursesPagination } from "./courses-pagination";
import { Category } from "@/types/category";

interface FilteredCoursesComponentProps {
  activeCategory: string | null;
  categories: Category[];
}

export const FilteredCoursesComponent = ({
  activeCategory,
}: FilteredCoursesComponentProps) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { courses, fetchCourses, loadingState } = useCoursesStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  console.log("Courses from api: ", courses);

  const [currentPage, setCurrentPage] = React.useState(1);

  const coursesPerPage = 12;

  const coursesFilteredByCategories = activeCategory
    ? activeCategory === "All"
      ? courses
      : courses.filter(
          (course: any) =>
            course.courseTitle.includes(activeCategory) ||
            (course.courseCategories &&
              course.courseCategories.includes(activeCategory))
        )
    : courses;

  const coursesFilteredOnSearchInput = activeCategory
    ? activeCategory === "All"
      ? courses.filter(
          (course: any) =>
            course.courseTitle
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (course.courseCategories &&
              course.courseCategories.some((cat: any) =>
                cat.toLowerCase().includes(searchQuery.toLowerCase())
              ))
        )
      : courses.filter(
          (course: any) =>
            course.courseTitle
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (course.courseCategories &&
              course.courseCategories.some((cat: any) =>
                cat.toLowerCase().includes(searchQuery.toLowerCase())
              ) &&
              course.courseCategories.includes(activeCategory))
        )
    : courses.filter(
        (course: any) =>
          course.courseTitle
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (course.courseCategories &&
            course.courseCategories.some((cat: any) =>
              cat.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );

  const filteredCourses = searchQuery
    ? coursesFilteredOnSearchInput
    : coursesFilteredByCategories;

  const totalPages =
    Math.ceil(coursesFilteredByCategories?.length / coursesPerPage) || 1;

  const coursesToDisplay = filteredCourses?.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  if (loadingState.loading) {
    return (
      <div className="my-6 flex flex-wrap justify-center md:mx-auto md:p-6">
        <FilteredCoursesSkeleton />
      </div>
    );
  }

  // todo: use a callout for error
  if (loadingState.error) {
    return (
      <div className="mx-auto my-auto flex flex-col items-center justify-center">
        <p className="mx-auto flex items-center justify-center">
          ERROR: {loadingState.error}
        </p>
      </div>
    );
  }

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    return params.toString();
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      createQueryString("page", `${pageNumber}`);
    }
  };

  return (
    <div className="mb-6 w-full max-w-7xl">
      <div className="mx-auto my-6 grid w-full grid-cols-2 items-center justify-center gap-4 md:max-w-7xl md:grid-cols-2 lg:grid-cols-4">
        {filteredCourses &&
          filteredCourses.map((course: any) => (
            <CourseCard key={course.courseId} course={course} />
          ))}
      </div>
      {totalPages > 1 && (
        <CoursesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};