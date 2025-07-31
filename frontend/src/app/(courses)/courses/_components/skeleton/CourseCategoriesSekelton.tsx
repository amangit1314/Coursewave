import { Skeleton } from "@/components/ui/skeleton";

export default function CourseCategoriesSkeleton() {
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