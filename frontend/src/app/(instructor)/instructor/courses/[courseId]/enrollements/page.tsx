"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useMyCourseEnrollments } from "@/hooks/useInstructor";
import { useUserStore } from "@/zustand/userStore";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  PageContainer,
  PageHeader,
  StatCard,
  EmptyState,
  LoadingPage,
  UnauthorizedState,
  UserAvatar,
  ProgressBar,
  StatusBadge,
  resolveStatusType,
} from "@/components/shared";
import { staggerContainer, staggerItem } from "@/lib/config/motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { CourseEnrollmentEntry } from "@/types/instructor.service.types";

export default function CourseEnrollmentsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const { user } = useUserStore();
  const isInstructor = user?.roles?.includes("INSTRUCTOR");

  const { data, isLoading, error } = useMyCourseEnrollments(courseId);

  React.useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error
          ? `Failed to load enrollments: ${error.message}`
          : "Failed to load enrollments"
      );
    }
  }, [error]);

  if (!isInstructor) {
    return (
      <UnauthorizedState description="You need to be an instructor to view enrollments." />
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingPage variant="stats" />
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer>
        <EmptyState
          icon={Users}
          title="Course Not Found"
          description="This course doesn't exist or you are not the instructor."
          action={{
            label: "Back to Courses",
            onClick: () => router.push("/instructor/courses"),
          }}
        />
      </PageContainer>
    );
  }

  const activeCount = data.enrollments.filter(
    (e: CourseEnrollmentEntry) => e.status === "ACTIVE"
  ).length;
  const completedCount = data.enrollments.filter(
    (e: CourseEnrollmentEntry) => e.status === "COMPLETED"
  ).length;

  return (
    <PageContainer>
      <div className="mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/instructor/courses/${courseId}`)}
          className="text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to course
        </Button>
      </div>

      <PageHeader title={`Enrollments: ${data.course.title}`} />

      {/* Summary Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <StatCard
          label="Total Enrolled"
          value={data.totalEnrollments}
          icon={Users}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatCard
          label="Active"
          value={activeCount}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          label="Completed"
          value={completedCount}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-900/20"
        />
      </motion.div>

      {/* Enrollments Table */}
      {data.enrollments.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Enrollments"
          description="No one has enrolled in this course yet."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Chapters
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Enrolled
                </th>
              </tr>
            </thead>
            <motion.tbody
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="divide-y divide-border"
            >
              {data.enrollments.map((enrollment: CourseEnrollmentEntry) => (
                <motion.tr
                  key={enrollment.id}
                  variants={staggerItem}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={enrollment.user.name}
                        email={enrollment.user.email}
                        imageUrl={enrollment.user.profileImageUrl}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {enrollment.user.name || "Unnamed"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {enrollment.user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge
                      status={resolveStatusType(enrollment.status)}
                      label={enrollment.status}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <ProgressBar
                      value={enrollment.progress}
                      className="max-w-[8rem] mx-auto"
                    />
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-muted-foreground tabular-nums">
                    {enrollment.completedChapters}/{enrollment.totalChapters}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground tabular-nums">
                    {new Date(enrollment.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
}
