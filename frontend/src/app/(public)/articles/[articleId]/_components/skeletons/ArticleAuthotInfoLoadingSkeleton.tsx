import { Skeleton } from "@/components/ui/skeleton";

const ArticleAuthorInfoLoadingSkeleton = () => {
  return (
    <div className="flex items-center justify-start space-x-4">
      <Skeleton className="h-[40px] w-[40px] rounded-full" />

      <div className="space-y-2">
        <div className="flex items-center justify-start space-x-2">
          <div className="flex items-center justify-start space-x-2">
            <Skeleton className="h-6 w-[195px]" />
            <Skeleton className="h-6 w-[50px]" />
          </div>

          {/* <p className="text-xs text-green-500 cursor-pointer">Follow</p> */}
        </div>

        <div className="flex items-center justify-start space-x-2">
          <Skeleton className="h-4 w-[40px]" />
          <Skeleton className="h-4 w-[195px]" />
        </div>
      </div>
    </div>
  );
};

export default ArticleAuthorInfoLoadingSkeleton;