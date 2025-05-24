import { Skeleton } from "@/components/ui/skeleton";

const InstructorBadgeLoadingSkeleton = () => {
  return (
    <div className="flex items-center justify-start space-x-4">
      <Skeleton className="h-20 w-20 rounded-full" />

      <div className="space-y-2">
        <Skeleton className="h-6 w-full rounded-md" />
        <Skeleton className="h-3 w-full rounded-md" />
      </div>
    </div>
  );
};

export default InstructorBadgeLoadingSkeleton;