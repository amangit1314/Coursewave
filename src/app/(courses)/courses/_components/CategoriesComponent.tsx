/* eslint-disable @typescript-eslint/no-unused-vars */
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Category } from "@/types/category";
import { Poppins } from "next/font/google";

import CourseCategoriesSkeleton from "./skeleton/CourseCategoriesSekelton";

interface CategoriesComponentProps {
  activeCategory: number;
  setActiveCategory: (index: number) => void;
  categories: Category[];
  loading: boolean;
}

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function CategoriesComponent({
  activeCategory,
  setActiveCategory,
  categories,
  loading,
}: CategoriesComponentProps) {
  return (
    <div
      className={
        poppins.className +
        "sticky top-0 z-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur"
      }
    >
      <ScrollArea className="max-w-8xl w-full whitespace-nowrap">
        {loading ? (
          <div className="mx-auto flex w-max flex-wrap justify-center">
            <CourseCategoriesSkeleton />
          </div>
        ) : (
          <div className="flex w-max justify-center space-x-2 overflow-x-auto text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 py-2 px-4 md:my-4">
            {categories.map((category, index) => (
              <div key={index} className="shrink-0">
                <button
                  onClick={() => setActiveCategory(index)}
                  className={`flex h-8 w-full items-center justify-center rounded-full px-4 text-center transition-all duration-150 
  ${
    activeCategory === index
      ? "bg-blue-600 dark:bg-blue-700 text-white tracking-tight font-semibold shadow-md border-2 border-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
      : "text-zinc-500 font-medium border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
  }
`}
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>
        )}
        <ScrollBar
          orientation="horizontal"
          className="mt-8 scrollbar-thumb-blue-500"
          color="blue"
        />
      </ScrollArea>
    </div>
  );
}
