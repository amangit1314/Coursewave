import React from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <ReviewLoadingWidget />
    </div>
  );
}

// Reviews Loading WIdget
const ReviewLoadingWidget = () => {
  return (
    <div>
      <ScrollArea className="w-full md:w-[1080px] whitespace-nowrap">
        <div className="grid grid-cols-3 w-max space-x-4 pb-4">
          <ReviewSkeleton />
          <ReviewSkeleton />
          <ReviewSkeleton />
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

//? --------------------------------------------------------------
function ReviewSkeleton() {
  return (
    <div className="flex flex-col space-y-3 mb-6">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
