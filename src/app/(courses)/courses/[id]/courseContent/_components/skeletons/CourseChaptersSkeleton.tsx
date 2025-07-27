import { Skeleton } from "@/components/ui/skeleton";

 const CourseChaptersSkeleton = () => {
  return (
    <div className="max-w-[27rem] w-full border border-stroke p-2.5 h-full rounded-xl space-y-4">
      <Skeleton className="h-[16px] w-[16rem] rounded-xl" />

      <div className="space-y-2 w-full max-w-[25rem] ">
        <Skeleton className="h-[48px] rounded-xl" />
        <Skeleton className="h-[48px] rounded-xl" />
        <Skeleton className="h-[48px] rounded-xl" />
        <Skeleton className="h-[48px] rounded-xl" />
        <Skeleton className="h-[48px] rounded-xl" />
        <Skeleton className="h-[48px] rounded-xl" />
        <Skeleton className="h-[48px] rounded-xl" />
        <Skeleton className="h-[48px] rounded-xl" />
      </div>
    </div>
  );
};

export default CourseChaptersSkeleton;