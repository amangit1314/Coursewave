"use client";

import React, { useEffect, useMemo } from "react";

import { useUserStore } from "@/zustand/userStore";
import { useCoursesStore } from "@/zustand/coursesStore";
import { useCategoriesStore } from "@/zustand/categoriesStore";
import { CategoriesComponent } from "../../courses/_components/courses-categories-component";
import { FilteredCoursesComponent } from "../../courses/_components/filtered-courses";

const BrowseSection = () => {
  const [activeCategoryIndex, setActiveCategoryIndex] =
    React.useState<number>(0);
  const { courses, fetchCourses } = useCoursesStore();
  const { loading, error, categories, fetchCategories } = useCategoriesStore();
  const { user, loadingState } = useUserStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  console.log("Courses in browse section: ", courses);
  console.log("Categories in browse section: ", categories);

  const categoriesWithData = useMemo(() => {
    return [{ id: 'All', name: "All", description: "", createdAt: undefined, updatedAt: undefined }, ...categories];
  }, [categories]);

  const handleClick = (index: number) => {
    setActiveCategoryIndex(index);
  };

  const activeCategory = categoriesWithData[activeCategoryIndex]?.name ?? "All";

  console.log("User in browse-section.tsx: ", user);

  return (
    <div className="w-full space-y-3 overflow-x-hidden px-6 py-16 md:space-y-0 md:py-0">
      <CategoriesComponent
        activeCategory={activeCategoryIndex}
        setActiveCategory={handleClick}
        categories={categoriesWithData}
        loading={loading}
      />
      <FilteredCoursesComponent
        activeCategory={activeCategory}
        categories={categoriesWithData}
      />
    </div>
  );
};

export default BrowseSection;
