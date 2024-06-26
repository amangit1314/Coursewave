"use client";

import React, { useEffect } from "react";
import { Category, Course } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { CourseCard } from "./course-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import useCoursesStore from "@/zustand/coursesStore";

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
  const { courses, fetchCourses, loading, error } = useCoursesStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  console.log("Courses from api: ", courses);

  const [currentPage, setCurrentPage] = React.useState(1); // Track current page

  const coursesPerPage = 12; // Number of courses per page

  const coursesFilteredByCategories = activeCategory
    ? activeCategory === "All"
      ? courses
      : courses.filter(
          (course: Course) =>
            course.courseTitle.includes(activeCategory) ||
            (course.courseCategories &&
              course.courseCategories.includes(activeCategory))
        )
    : courses;

  const coursesFilteredOnSearchInput = activeCategory
    ? activeCategory === "All"
      ? courses.filter(
          (course: Course) =>
            course.courseTitle
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (course.courseCategories &&
              course.courseCategories.some((cat) =>
                cat.toLowerCase().includes(searchQuery.toLowerCase())
              ))
        )
      : courses.filter(
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
    : courses.filter(
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

  const totalPages =
    Math.ceil(coursesFilteredByCategories?.length / coursesPerPage) || 1;

  const coursesToDisplay = filteredCourses?.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  if (loading) {
    return (
      <div className="flex flex-wrap justify-center my-6 md:p-6 md:mx-auto ">
        <FilteredCoursesSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col mx-auto my-auto justify-center items-center">
        <p className="flex mx-auto items-center justify-center">ERROR: {error}</p>
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
    <div className="max-w-7xl w-full my-6">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 md:max-w-7xl w-full gap-4 my-6 justify-center items-center mx-auto">
        {filteredCourses &&
          filteredCourses.map((course: Course) => (
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
}

function CoursesPagination({ currentPage, totalPages, onPageChange }: any) {
  const handlePrevious = () => onPageChange(currentPage - 1);
  const handleNext = () => onPageChange(currentPage + 1);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            // disabled={currentPage === 1}
            onClick={handlePrevious}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                isActive={currentPage === pageNumber}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            // disabled={currentPage === totalPages}
            onClick={handleNext}
          ></PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

// <------------------------------------- SKELETON ---------------------------------------->
function FilteredCoursesSkeleton() {
  return (
    <div className="md:max-w-7xl w-full justify-center md:mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4">
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
      <Skeleton className="h-[125px] md:max-w-[250px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 md:max-w-[250px] w-full" />
        <Skeleton className="h-4 md:max-w-[200px] w-full " />
      </div>
    </div>
  );
}
