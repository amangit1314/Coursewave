import { Skeleton } from "@/components/ui/skeleton";

const ArticleContentLoadingSkeleton = () => {
  return (
    <div className="h-full min-h-screen justify-center overflow-x-hidden">
      {/* glassy header skeleton */}
      <div className="sticky top-0 z-20 border-stroke flex items-center justify-between border border-b-[1px] px-4 md:px-16 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm">
        <Skeleton className="h-10 w-20 rounded-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
      <div className="mx-4 my-8 md:my-16 w-full space-y-8 overflow-x-hidden md:mx-auto md:max-w-3xl">
        <Skeleton className="my-[24px] h-[42px] w-2/3" />
        <Skeleton className="h-8 w-1/3 rounded" />
        <Skeleton className="h-4 w-1/4 rounded" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-12 rounded" />
          <Skeleton className="h-6 w-12 rounded" />
          <Skeleton className="h-6 w-12 rounded" />
        </div>
        <Skeleton className="h-[22rem] w-full rounded-xl" />
        <Skeleton className="h-8 w-1/2 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
        <Skeleton className="h-4 w-1/3 rounded" />
        <Skeleton className="h-8 w-1/2 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
        <Skeleton className="h-4 w-1/3 rounded" />
      </div>
    </div>
  );
};

export default ArticleContentLoadingSkeleton;
