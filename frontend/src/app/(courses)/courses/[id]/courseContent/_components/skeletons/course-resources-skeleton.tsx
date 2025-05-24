import { Skeleton } from "@/components/ui/skeleton";

const CourseResourcesSkeleton = () => {
  return (
    <div className="space-y-2 mt-2">
      <div className="flex justify-start space-x-4 items-center">
        <Skeleton className="h-[10px] w-[10px] rounded-full" />
        <Skeleton className="h-[12px] w-full rounded-badge" />
      </div>
      <div className="flex justify-start space-x-4 items-center">
        <Skeleton className="h-[10px] w-[10px] rounded-full" />
        <Skeleton className="h-[12px] w-full rounded-badge" />
      </div>
      <div className="flex justify-start space-x-4 items-center">
        <Skeleton className="h-[10px] w-[10px] rounded-full" />
        <Skeleton className="h-[12px] w-full rounded-badge" />
      </div>
      <div className="flex justify-start space-x-4 items-center">
        <Skeleton className="h-[10px] w-[10px] rounded-full" />
        <Skeleton className="h-[12px] w-full rounded-badge" />
      </div>
    </div>
  );
};

export default CourseResourcesSkeleton;
