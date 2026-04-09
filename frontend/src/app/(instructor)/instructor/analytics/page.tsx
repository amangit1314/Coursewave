"use client";

import React from "react";
import Analytics from "./_components/Analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/zustand/userStore";
import { useMyInstructorAnlaytics } from "@/hooks/useInstructor";
import { useRouter } from "next/navigation";

const AnalyticsPage = () => {
  const router = useRouter();
  const { user } = useUserStore();

  // 🔹 Role check: Only allow users with INSTRUCTOR role
  const isInstructor = user?.roles?.includes("INSTRUCTOR");

  // STEP 2: Fetch analytics for verified instructor
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useMyInstructorAnlaytics();

  // 🔹 Error handling via toast
  React.useEffect(() => {
    if (analyticsError) {
      toast.error(
        analyticsError instanceof Error
          ? `Failed to fetch analytics: ${analyticsError.message}`
          : "Failed to fetch analytics"
      );
    }
  }, [
    // instructorError,
    analyticsError,
  ]);

  // 🚫 Block if user is not instructor
  if (!isInstructor) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Unauthorized Access
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You need to be an instructor to access this dashboard.
          </p>
          <button
            onClick={() => router.push(`/profile/${user?.id}`)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Become an Instructor
          </button>
        </div>
      </div>
    );
  }

  // ⏳ Loading state
  if (analyticsLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  // 🚫 No analytics data available
  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            No Analytics Data Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start creating courses to see your analytics.
          </p>
          <button
            onClick={() =>
              (router.push(`/instructor/courses/create`))
            }
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Course
          </button>
        </div>
      </div>
    );
  }

  // Render Analytics with real API data
  return (
    <Analytics
      totalEarning={analyticsData?.totalEarnings?.toString() ?? "0"}
      totalStudents={analyticsData?.totalStudents ?? 0}
      totalCourses={analyticsData?.totalCourses ?? 0}
      createdCourses={analyticsData.createdCourses ?? []}
    />
  );
};

export default AnalyticsPage;
