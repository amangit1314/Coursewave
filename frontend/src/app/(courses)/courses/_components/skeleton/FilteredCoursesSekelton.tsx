import { Skeleton } from "@/components/ui/skeleton";

export const FilteredCoursesSkeleton = () => {
    return (
      <div className="grid w-full grid-cols-1 justify-center gap-y-4 md:mx-auto md:max-w-7xl md:grid-cols-2 lg:grid-cols-4">
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
      <div className="mb-6 flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl md:max-w-[250px]" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full md:max-w-[250px]" />
          <Skeleton className="h-4 w-full md:max-w-[200px]" />
        </div>
      </div>
    );
  };
  