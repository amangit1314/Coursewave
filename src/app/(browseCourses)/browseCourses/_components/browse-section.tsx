"use client";

import React, { useEffect } from "react";
import { Category } from "@prisma/client";
import CategoriesComponent from "@/app/(course)/courses/_components/courses-categories-component";
import { FilteredCoursesComponent } from "@/app/(course)/courses/_components/filtered-courses";
import useUserInfo from "@/hooks/use-user-info";
import useCoursesStore from "@/zustand/coursesStore";
import { useZustandStore } from "@/zustand/store";

interface BrowseSectionProps {
  children: React.ReactNode;
}

const BrowseSection: React.FC<BrowseSectionProps> = ({ children }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] =
    React.useState<number>(0);
  const [categoriesData, setCategories] = React.useState<Category[]>([]);

  const { courses, fetchCourses } = useCoursesStore();
  const { loading, categories, fetchCategories } = useZustandStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchCategories();

  }, [fetchCategories]);

  useEffect(() => {
    setCategories([
      { name: "All", createdAt: null, updatedAt: null },
      ...categories,
    ]);
  }, [setCategories, categories]);

  const handleClick = (index: number) => {
    setActiveCategoryIndex(index);
  };

  const activeCategory = categoriesData[activeCategoryIndex]?.name || "All";

  const user = useUserInfo();
  console.log("User: ", user);

  return (
    <div className="py-16 md:py-12 space-y-6 md:space-y-0 w-full px-6 md:px-12 overflow-x-hidden">
      <CategoriesComponent
        activeCategory={activeCategoryIndex}
        setActiveCategory={handleClick}
        categories={categoriesData}
        loading={loading}
      />
      <FilteredCoursesComponent
        activeCategory={activeCategory}
        categories={categoriesData}
      />
    </div>
  );
};

export default BrowseSection;
