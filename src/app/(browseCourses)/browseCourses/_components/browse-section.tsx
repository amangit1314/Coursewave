"use client";

import React, { useEffect } from "react";
import { Category } from "@prisma/client";
import CategoriesComponent from "@/app/(course)/courses/_components/courses-categories-component";
import { FilteredCoursesComponent } from "@/app/(course)/courses/_components/filtered-courses";
import useUserInfo from "@/hooks/use-user-info";
import { useZustandStore } from "@/zustand/store";

interface BrowseSectionProps {
  children: React.ReactNode;
}

const BrowseSection: React.FC<BrowseSectionProps> = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [activeCategoryIndex, setActiveCategoryIndex] =
    React.useState<number>(0);
  const [categories, setCategories] = React.useState<Category[]>([]);

  // const { courses } = useZustandStore((state: any) => ({
  //   bears: 0,
  //   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 }),
  // }));

  useEffect(() => {
    fetch("/api/categories/")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to fetch categories");
        }
      })
      .then((data) => {
        setCategories([{ name: "All" }, ...data.data]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, []);

  const handleClick = (index: number) => {
    setActiveCategoryIndex(index);
  };

  const activeCategory = categories[activeCategoryIndex]?.name || "All";

  const user = useUserInfo();
  console.log("User: ", user);

  return (
    <div className="py-12 w-full px-12 overflow-x-hidden">
      <CategoriesComponent
        activeCategory={activeCategoryIndex}
        setActiveCategory={handleClick}
        categories={categories}
        loading={loading}
      />
      <FilteredCoursesComponent
        activeCategory={activeCategory}
        categories={categories}
      />
    </div>
  );
};

export default BrowseSection;
