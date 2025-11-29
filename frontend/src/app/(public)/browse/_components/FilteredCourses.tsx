"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Category } from "@/types/category";
import { FilteredCoursesSkeleton } from "../../courses/_components/skeleton/FilteredCoursesSekelton";
import { CourseCard } from "./CourseCard";
import { CoursesPagination } from "../../courses/_components/CoursesPagination";
import { useCourses } from "@/hooks/useCourses";
import { Course } from "@/types";

interface FilteredCoursesComponentProps {
  activeCategory: string | null;
  searchQuery: string | null;
  categories: Category[];
}

export default function FilteredCoursesComponent({
  activeCategory,
  searchQuery,
  categories,
}: FilteredCoursesComponentProps) { // Added categories prop
  const { data: courses, isLoading, isError, error, refetch } = useCourses();

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  // --- FIXED Helper Functions ---
  const matchesCategory = useCallback((course: Course, category: string | null) => {
    if (!category || category === "All") return true;

    // Check if course has a Category object with matching name
    if (course.Category?.name === category) return true;

    // Also check if course categories array contains the category
    return course.categories?.some((cat) => cat?.includes(category));
  }, []);

  const matchesSearch = useCallback((course: Course, query: string | null) => {
    if (!query) return true;

    const q = query.toLowerCase();

    return (
      course.title?.toLowerCase().includes(q) ||
      course.instructor?.user?.name?.toLowerCase().includes(q) ||
      course.Category?.name?.toLowerCase().includes(q) ||
      course.categories?.some((cat) => cat?.toLowerCase().includes(q))
    );
  }, []);

  // --- Filtering + Pagination (memoized) ---
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      return (
        matchesCategory(course, activeCategory) &&
        matchesSearch(course, searchQuery)
      );
    });
  }, [courses, activeCategory, searchQuery, matchesCategory, matchesSearch]); // Added dependencies

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage) || 1;

  const coursesToDisplay = useMemo(() => {
    return filteredCourses.slice(
      (currentPage - 1) * coursesPerPage,
      currentPage * coursesPerPage
    );
  }, [filteredCourses, currentPage]);

  const handlePageChange = useCallback((pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  }, [totalPages]);

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="my-10 flex flex-wrap justify-center md:mx-auto md:p-6">
        <FilteredCoursesSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto my-20 flex flex-col items-center justify-center gap-4 text-center">
        <div className="text-2xl font-bold text-red-500">
          Something went wrong
        </div>
        <div className="text-zinc-500 dark:text-zinc-300 mb-2">
          {error?.message || "Please try again later."}
        </div>
        <button
          onClick={() => refetch()}
          className="rounded-full bg-blue-600 px-6 py-2 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-20 gap-4 text-center">
        <img
          src="/assets/illustrations/no-courses.webp"
          alt="No courses"
          className="w-40 h-40 opacity-80 mb-2"
        />
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

  return (
    <div className="mb-6 w-full max-w-7xl space-y-12">
      {/* Courses */}
      <div className="mx-auto grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch justify-center transition-all">
        {coursesToDisplay.map((course) => (
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