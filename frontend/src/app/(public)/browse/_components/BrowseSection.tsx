"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";

// import { useUserStore } from "@/zustand/userStore";
import { useCoursesStore } from "@/zustand/coursesStore";
import { useCategoriesStore } from "@/zustand/categoriesStore";

import CategoriesComponent from "../../courses/_components/CategoriesComponent";
import FilteredCoursesComponent from "./FilteredCourses";

const BrowseSection = () => {
  const [activeCategoryIndex, setActiveCategoryIndex] = React.useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { courses, fetchCourses } = useCoursesStore();
  const { loading, error, categories, fetchCategories } = useCategoriesStore();
  // const { user, loadingState } = useUserStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const categoriesWithData = useMemo(() => {
    return [
      {
        id: "All",
        name: "All",
        description: "",
        createdAt: undefined,
        updatedAt: undefined,
      },
      ...categories,
    ];
  }, [categories]);

  const handleClick = (index: number) => {
    setActiveCategoryIndex(index);
  };

  const activeCategory = categoriesWithData[activeCategoryIndex]?.name ?? "All";

  // Search bar UI
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full space-y-6 overflow-x-hidden px-6 py-6 md:py-0 md:space-y-0 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-6 mt-10 flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-2 text-center">
          Browse Courses
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto text-center">
          Discover your next skill. Filter by category or search for something specific. All courses are hand-picked and updated regularly.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-4">
        <div className="relative w-full max-w-xl">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
            <FiSearch size={20} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for courses, topics, or instructors..."
            className="w-full rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-neutral-900 py-3 pl-12 pr-4 text-base text-zinc-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-blue-400 dark:focus:ring-blue-900 transition-all outline-none"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Categories */}
      <CategoriesComponent
        activeCategory={activeCategoryIndex}
        setActiveCategory={handleClick}
        categories={categoriesWithData}
        loading={loading}
      />

      {/* Filtered Courses */}
      <div className="px-4">
        <FilteredCoursesComponent
          activeCategory={activeCategory}
          categories={categoriesWithData}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default BrowseSection;
