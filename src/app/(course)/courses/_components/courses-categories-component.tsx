import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@prisma/client";
import Link from "next/link";

interface CategorysComponentProps {
  activeCategory: number;
  setActiveCategory: (index: number) => void;
  categories: Category[];
  loading: boolean;
}

export default function CategoriesComponent({
  activeCategory,
  setActiveCategory,
  categories,
  loading,
}: CategorysComponentProps) {
  return (
    <>
      <ul className="flex flex-wrap justify-center mt-4 pt-4 text-sm font-medium text-center mx-auto text-gray-500 dark:text-gray-400">
        {loading ? (
          <CourseCategoriesSkeleton />
        ) : (
          categories.map((category, index) => (
            <li key={index} className="mr-2">
              <Link
                href="#"
                onClick={() => setActiveCategory(index)}
                className={`inline-block px-6 py-2 rounded-full hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white ${
                  activeCategory === index
                    ? "text-white bg-blue-600"
                    : "text-gray-500"
                }`}
              >
                {category.name}
              </Link>
            </li>
          ))
        )}
      </ul>
    </>
  );
}

function CourseCategoriesSkeleton() {
  return (
    <div className="flex items-center space-x-3">
      <Skeleton className="px-6 py-2 rounded-full text-transparent">
        Loading
      </Skeleton>
      <Skeleton className="px-6 py-2 rounded-full text-transparent">
        Loading
      </Skeleton>
      <Skeleton className="px-6 py-2 rounded-full text-transparent">
        Loading
      </Skeleton>
      <Skeleton className="px-6 py-2 rounded-full text-transparent">
        Loading
      </Skeleton>
      <Skeleton className="px-6 py-2 rounded-full text-transparent">
        Loading
      </Skeleton>
    </div>
  );
}
