import { Skeleton } from "@/components/ui/skeleton";

const CourseContentScreenSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="w-full bg-white dark:bg-zinc-900 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <Skeleton className="h-6 w-64 rounded-lg" />
        </div>
      </div>

      <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-start gap-8 px-4 md:flex-row md:px-6 lg:px-12">
        {/* Main Content Skeleton */}
        <div className="flex-1 space-y-8">
          {/* Video Player Skeleton */}
          <div className="space-y-4">
            {/* Mobile chapters button skeleton */}
            <div className="md:hidden">
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Video Player Skeleton */}
            <section className="w-full rounded-xl bg-white px-4 pt-4 pb-2 shadow-sm dark:bg-zinc-900 dark:border dark:border-zinc-800">
              <div className="flex items-center gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-40 rounded-lg" />
              </div>
              <div className="mt-4 aspect-video w-full rounded-e-lg bg-transparent">
                <Skeleton className="w-full aspect-video rounded-xl" />
              </div>
            </section>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            {/* About Section Skeleton */}
            <section>
              <Skeleton className="h-7 w-48 mb-4 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
              </div>
            </section>

            {/* AI Summary Skeleton */}
            <section>
              <Skeleton className="h-7 w-40 mb-4 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-4/5 rounded-lg" />
              </div>
            </section>

            {/* Instructor Skeleton */}
            <section>
              <Skeleton className="h-7 w-48 mb-4 rounded-lg" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-32 rounded-lg" />
                  <Skeleton className="h-4 w-24 rounded-lg" />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <aside className="w-full md:max-w-sm lg:max-w-md space-y-8">
          {/* Chapters Skeleton */}
          <div className="hidden md:block space-y-4">
            <Skeleton className="h-7 w-32 rounded-lg" />
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          </div>

          {/* Attachments Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-7 w-32 rounded-lg" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </div>

          {/* Notes Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-7 w-24 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseContentScreenSkeleton;