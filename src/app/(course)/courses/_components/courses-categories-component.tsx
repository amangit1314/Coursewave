import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@prisma/client";
import { Poppins } from "next/font/google";
import Link from "next/link";

interface CategorysComponentProps {
  activeCategory: number;
  setActiveCategory: (index: number) => void;
  categories: Category[];
  loading: boolean;
}

// export default function CategoriesComponent({
//   activeCategory,
//   setActiveCategory,
//   categories,
//   loading,
// }: CategorysComponentProps) {
//   return (
//     <>
//       <ul className="mx-auto mt-4 flex justify-center max-w-8xl pt-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
//         {loading ? (
//           <CourseCategoriesSkeleton />
//         ) : (
//           // categories list
//           categories.map((category, index) => (
//             <li key={index} className="mr-2">
//               <Link
//                 href="#"
//                 onClick={() => setActiveCategory(index)}
//                 className={`flex items-center text-center justify-center rounded-full px-4 h-9 max-w-[140px] w-full hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white ${
//                   activeCategory === index
//                     ? "bg-blue-600 text-white"
//                     : "text-gray-500"
//                 }`}
//               >
//                 {category.name}
//               </Link>
//             </li>
//           ))
//         )}
//       </ul>
//     </>
//   );
// }
const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function CategoriesComponent({
  activeCategory,
  setActiveCategory,
  categories,
  loading,
}: CategorysComponentProps) {
  return (
    <div className={poppins.className}>
      <ScrollArea className="max-w-8xl mt-8 w-full whitespace-nowrap">
      {loading ? (
        <div className="mx-auto flex w-max flex-wrap justify-center">
          <CourseCategoriesSkeleton />
        </div>
      ) : (
        // categories list
        <div className="flex w-max justify-center space-x-2 overflow-x-auto text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          {categories.map((category, index) => (
            <div key={index} className="shrink-0">
              <button
                onClick={() => setActiveCategory(index)}
                className={`flex h-9 w-full items-center justify-center rounded-full px-4 text-center hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white ${
                  activeCategory === index
                    ? "bg-blue-500 dark:bg-blue-600 text-white tracking-tight font-medium dark:hover:bg-blue-700"
                    : "text-gray-500 font-medium"
                }`}
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>
      )}

      <ScrollBar orientation="horizontal" className="mt-8 scrollbar-thumb-blue-500" color="blue" />
    </ScrollArea>
    </div>
    
  );
}

function CourseCategoriesSkeleton() {
  return (
    <div className="flex items-center space-x-3">
      <Skeleton className="rounded-full px-6 py-2 text-transparent">
        Loading
      </Skeleton>
      <Skeleton className="rounded-full px-6 py-2 text-transparent">
        Loading
      </Skeleton>
      <Skeleton className="rounded-full px-6 py-2 text-transparent">
        Loading
      </Skeleton>
      <Skeleton className="rounded-full px-6 py-2 text-transparent">
        Loading
      </Skeleton>
      <Skeleton className="rounded-full px-6 py-2 text-transparent">
        Loading
      </Skeleton>
      <Skeleton className="rounded-full px-6 py-2 text-transparent">
        Loading
      </Skeleton>
      <Skeleton className="rounded-full px-6 py-2 text-transparent">
        Loading
      </Skeleton>
      <Skeleton className="rounded-full px-6 py-2 text-transparent">
        Loading
      </Skeleton>
    </div>
  );
}
