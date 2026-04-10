"use client";

import React from "react";
import Analytics from "./_components/Analytics";
import { useUserStore } from "@/zustand/userStore";
import { useMyInstructorAnlaytics } from "@/hooks/useInstructor";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  PageContainer,
  LoadingPage,
  EmptyState,
  UnauthorizedState,
} from "@/components/shared";
import { BarChart3 } from "lucide-react";

const AnalyticsPage = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const isInstructor = user?.roles?.includes("INSTRUCTOR");

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useMyInstructorAnlaytics();

  React.useEffect(() => {
    if (analyticsError) {
      toast.error(
        analyticsError instanceof Error
          ? `Failed to fetch analytics: ${analyticsError.message}`
          : "Failed to fetch analytics"
      );
    }
  }, [analyticsError]);

  if (!isInstructor) {
    return (
      <UnauthorizedState
        description="You need to be an instructor to access this dashboard."
        action={{
          label: "Become an Instructor",
          onClick: () => router.push(`/profile/${user?.id}`),
        }}
      />
    );
  }

  if (analyticsLoading) {
    return (
      <PageContainer>
        <LoadingPage variant="stats" />
      </PageContainer>
    );
  }

  if (!analyticsData) {
    return (
      <PageContainer>
        <EmptyState
          icon={BarChart3}
          title="No Analytics Data Available"
          description="Start creating courses to see your analytics."
          action={{
            label: "Create Your First Course",
            onClick: () => router.push("/instructor/courses/create"),
          }}
        />
      </PageContainer>
    );
  }

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
