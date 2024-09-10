import { Skeleton } from "@/components/ui/skeleton";

 const CourseContentScreenSkeleton = () => {
  return (
    <div className="flex px-12 py-8 justify-between space-x-6 items-center max-w-7xl w-full overflow-x-hidden mx-auto">
      <div className="space-y-6 max-w-[720px] w-full">
        <Skeleton className="h-[360px] w-full rounded-xl" />

        <div className="space-y-4 max-w-[720px]  w-full  rounded-xl">
          <Skeleton className="h-[16px] w-[160px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-[12px] w-[720px] rounded-xl" />
            <Skeleton className="h-[12px] w-[720px] rounded-xl" />
            <Skeleton className="h-[12px] w-[720px] rounded-xl" />
            <Skeleton className="h-[12px] w-[720px] rounded-xl" />
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default CourseContentScreenSkeleton;
