"use client";

import React, { useEffect, useMemo } from "react";
import { Category } from "@prisma/client";


import { useUserStore } from "@/zustand/userStore";
import { useCoursesStore } from "@/zustand/coursesStore";
import { useCategoriesStore } from "@/zustand/categoriesStore";
import CategoriesComponent from "../../courses/_components/courses-categories-component";
import { FilteredCoursesComponent } from "../../courses/_components/filtered-courses";

// interface BrowseSectionProps {
//   children: React.ReactNode;
// }
// : React.FC<BrowseSectionProps>d

const BrowseSection = () => {
  const [activeCategoryIndex, setActiveCategoryIndex] =
    React.useState<number>(0);
  const [categoriesData, setCategories] = React.useState<Category[]>([]);

  const { courses, fetchCourses, fetchCourseCategories } = useCoursesStore();
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
    return [{ name: "All", createdAt: null, updatedAt: null }, ...categories];
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
