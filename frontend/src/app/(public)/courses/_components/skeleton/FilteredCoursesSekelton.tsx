// import { Skeleton } from "@/components/ui/skeleton";

// export const FilteredCoursesSkeleton = () => {
//     return (
//       <div className="grid w-full grid-cols-1 justify-center gap-y-4 md:mx-auto md:max-w-7xl md:grid-cols-2 lg:grid-cols-4">
//         <FilteredCourseSkeleton />
//         <FilteredCourseSkeleton />
//         <FilteredCourseSkeleton />
//         <FilteredCourseSkeleton />
//         <FilteredCourseSkeleton />
//         <FilteredCourseSkeleton />
//       </div>
//     );
//   };
  
//   const FilteredCourseSkeleton = () => {
//     return (
//       <div className="mb-6 flex flex-col space-y-3">
//         <Skeleton className="h-[125px] w-full rounded-xl md:max-w-[250px]" />
//         <div className="space-y-2">
//           <Skeleton className="h-4 w-full md:max-w-[250px]" />
//           <Skeleton className="h-4 w-full md:max-w-[200px]" />
//         </div>
//       </div>
//     );
//   };
  

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";

export const FilteredCoursesSkeleton = () => {
  return (
    <div className="grid w-full grid-cols-1 justify-center gap-6 md:mx-auto md:max-w-7xl sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
      <FilteredCourseSkeleton />
      <FilteredCourseSkeleton />
      <FilteredCourseSkeleton />
      <FilteredCourseSkeleton />
      <FilteredCourseSkeleton />
      <FilteredCourseSkeleton />
    </div>
  );
};

const FilteredCourseSkeleton = () => {
  return (
    <div
      className={cn(
        "group relative h-full w-full overflow-hidden rounded-3xl border bg-white dark:bg-neutral-900 shadow-sm",
        "border-zinc-200 dark:border-zinc-800 md:max-w-[17rem] animate-pulse"
      )}
    >
      {/* Image Section with Shimmer */}
      <div className="relative w-full h-[9.5rem] overflow-hidden rounded-t-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10 animate-shimmer" />
      </div>

      {/* Card Content */}
      <div className="flex flex-col justify-between p-4 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded-md w-full" />
          <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded-md w-3/4" />
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded-md w-8" />
          <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded-md w-24" />
        </div>

        {/* Rating & Price */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-zinc-300 dark:bg-zinc-700 rounded-full w-16" />
          <div className="h-6 bg-zinc-300 dark:bg-zinc-700 rounded-full w-12" />
        </div>
      </div>

      {/* Wishlist Button */}
      <div className="absolute top-3 left-3 h-7 w-7 rounded-full bg-zinc-300/90 dark:bg-zinc-700/90" />
    </div>
  );
};