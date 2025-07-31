"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCoursesStore } from "@/zustand/coursesStore";
import { Category } from "@/types/category";
import { FilteredCoursesSkeleton } from "../../courses/_components/skeleton/FilteredCoursesSekelton";
import { CourseCard } from "./CourseCard";
import { CoursesPagination } from "../../courses/_components/CoursesPagination";

interface FilteredCoursesComponentProps {
  activeCategory: string | null;
  searchQuery: string | null;
  categories: Category[];
}

export default function FilteredCoursesComponent({
  activeCategory,
  searchQuery,
}: FilteredCoursesComponentProps) {
  // const searchParams = useSearchParams();
  // const searchQuery = searchParams.get("q") || "";
  const { courses, fetchCourses, loadingState } = useCoursesStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  console.log("Courses from api: ", courses);

  const [currentPage, setCurrentPage] = React.useState(1);

  const coursesPerPage = 6;

  // Ensure courses is an array and has data
  const safeCourses = Array.isArray(courses) ? courses : [];

  // Helper: check if course matches category
  const matchesCategory = (course: any, category: string | null) => {
    if (!category || category === "All") return true;
    // Check title
    if (course.title && course.title.includes(category)) return true;
    // Check categories array
    if (
      course.categories &&
      Array.isArray(course.categories) &&
      course.categories.some(
        (cat: any) => cat && cat.name && cat.name.includes(category)
      )
    ) {
      return true;
    }
    return false;
  };

  // Helper: check if course matches search query
  const matchesSearch = (course: any, query: string | null) => {
    if (!query) return true;
    const q = query.toLowerCase();
    // Check title
    if (
      course.title &&
      typeof course.title === "string" &&
      course.title.toLowerCase().includes(q)
    )
      return true;
    // Check categories array
    if (
      course.categories &&
      Array.isArray(course.categories) &&
      course.categories.some(
        (cat: any) =>
          cat &&
          cat.name &&
          typeof cat.name === "string" &&
          cat.name.toLowerCase().includes(q)
      )
    ) {
      return true;
    }
    return false;
  };

  // Filtering logic:
  // 1. If both searchQuery and activeCategory (not "All") are set, filter by BOTH.
  // 2. If only searchQuery, filter by search.
  // 3. If only activeCategory (not "All"), filter by category.
  // 4. If neither, show all.

  let filteredCourses: any[] = safeCourses;

  if (searchQuery && activeCategory && activeCategory !== "All") {
    // Both search and category: must match both
    filteredCourses = safeCourses.filter(
      (course: any) =>
        matchesCategory(course, activeCategory) &&
        matchesSearch(course, searchQuery)
    );
  } else if (searchQuery) {
    // Only search
    filteredCourses = safeCourses.filter((course: any) =>
      matchesSearch(course, searchQuery)
    );
  } else if (activeCategory && activeCategory !== "All") {
    // Only category
    filteredCourses = safeCourses.filter((course: any) =>
      matchesCategory(course, activeCategory)
    );
  } // else: show all

  // For pagination, total pages should be based on the filtered list
  const coursesFilteredByCategories =
    activeCategory && activeCategory !== "All"
      ? safeCourses.filter((course: any) =>
          matchesCategory(course, activeCategory)
        )
      : safeCourses;

  const totalPages =
    Math.ceil(coursesFilteredByCategories?.length / coursesPerPage) || 1;

  const coursesToDisplay = filteredCourses?.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  if (loadingState.loading) {
    return (
      <div className="my-10 flex flex-wrap justify-center md:mx-auto md:p-6">
        <FilteredCoursesSkeleton />
      </div>
    );
  }

  if (loadingState.error) {
    return (
      <div className="mx-auto my-20 flex flex-col items-center justify-center gap-4 text-center">
        <div className="text-2xl font-bold text-red-500">
          Something went wrong
        </div>
        <div className="text-zinc-500 dark:text-zinc-300 mb-2">
          {loadingState.error}
        </div>
        <button
          onClick={fetchCourses}
          className="rounded-full bg-blue-600 px-6 py-2 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!filteredCourses || filteredCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-20 gap-4 text-center">
        <img
          src="/assets/illustrations/no-courses.webp"
          alt="No courses"
          className="w-40 h-40 opacity-80 mb-2"
        />
        {/* <img src="/assets/illustrations/no-notifications.webp" alt="No Notifications" className="w-32 h-32 mb-4 mx-auto" /> */}
        <div className="text-xl font-semibold text-zinc-700 dark:text-zinc-200">
          No courses found
        </div>
        <div className="text-zinc-500 dark:text-zinc-400 max-w-md">
          Try a different category or search term. We're always adding new
          courses!
        </div>
      </div>
    );
  }

  // const createQueryString = (name: string, value: string) => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   params.set(name, value);

  //   return params.toString();
  // };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // createQueryString("page", `${pageNumber}`);
    }
  };

  return (
    <div className="mb-6 w-full max-w-7xl space-y-12">
      {/* Courses */}
      <div className="mx-auto grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch justify-center transition-all">
        {coursesToDisplay &&
          coursesToDisplay.map((course: any) => (
            <CourseCard key={course.id} course={course} />
          ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 bottom-2">
        {totalPages > 1 && (
          <CoursesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
