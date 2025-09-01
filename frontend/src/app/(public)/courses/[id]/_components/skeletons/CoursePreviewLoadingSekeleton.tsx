import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-select";

// Loading Skeleton Component (matching dashboard style)
export const CoursePreviewLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="container mx-auto max-w-7xl space-y-8 px-4 py-6 lg:space-y-12 lg:px-8">
        {/* Navbar Skeleton */}
        <div className="sticky top-0 z-50 -mx-4 bg-white/80 px-4 py-3 backdrop-blur-md dark:bg-zinc-900/80 lg:mx-0 lg:px-0">
          <div className="flex w-full items-center justify-between rounded-xl bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md dark:bg-slate-900/90 lg:px-6">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section Skeleton */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8">
              <div className="space-y-4">
                <Skeleton className="h-4 w-32 bg-white/20" />
                <Skeleton className="h-12 w-3/4 bg-white/20" />
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-6 w-20 bg-white/20" />
                  <Skeleton className="h-6 w-16 bg-white/20" />
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full bg-white/20" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-white/20" />
                    <Skeleton className="h-3 w-32 bg-white/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-lg bg-white/20" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16 bg-white/20" />
                    <Skeleton className="h-4 w-24 bg-white/20" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-red-600 p-6">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-lg bg-white/20" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16 bg-white/20" />
                    <Skeleton className="h-4 w-24 bg-white/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections Skeleton */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-zinc-800 p-6 shadow-lg"
              >
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl">
              <Skeleton className="h-48 w-full rounded-t-2xl" />
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
                <Separator />
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
