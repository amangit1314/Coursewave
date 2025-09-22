import { Skeleton } from "@/components/ui/skeleton";

const ArticleAuthorCardLoadingSkeleton = () => {
  return (
    <div className="my-8 space-y-6">
      <Skeleton className="h-[60px] w-[60px] rounded-full" />

      <div className="space-y-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center justify-start space-x-2">
            <Skeleton className="h-8 w-[45px]" />
            <Skeleton className="h-8 w-[150px]" />
          </div>

          <p className="border-stroke cursor-pointer rounded-badge border px-4 py-2 text-center text-xs text-green-700 transition-all duration-200 hover:bg-green-700 hover:text-white">
            Follow
          </p>
        </div>

        <div className="flex items-center justify-start space-x-2">
          <Skeleton className="h-4 w-[40px]" />
          <Skeleton className="h-4 w-[95px]" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[75px]" />
        </div>
      </div>
    </div>
  );
};

export default ArticleAuthorCardLoadingSkeleton;
