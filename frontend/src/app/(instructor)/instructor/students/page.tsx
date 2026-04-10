"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search } from "lucide-react";
import { useMyInstructorStudents } from "@/hooks/useInstructor";
import { useUserStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  PageContainer,
  PageHeader,
  EmptyState,
  LoadingPage,
  UnauthorizedState,
  UserAvatar,
  ProgressBar,
} from "@/components/shared";
import { staggerContainer, staggerItem } from "@/lib/config/motion";
import type { InstructorStudent } from "@/types/instructor.service.types";

export default function StudentsPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const isInstructor = user?.roles?.includes("INSTRUCTOR");
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useMyInstructorStudents();

  React.useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error
          ? `Failed to load students: ${error.message}`
          : "Failed to load students"
      );
    }
  }, [error]);

  if (!isInstructor) {
    return (
      <UnauthorizedState
        description="You need to be an instructor to view students."
        action={{
          label: "Become an Instructor",
          onClick: () => router.push(`/profile/${user?.id}`),
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingPage variant="table" />
      </PageContainer>
    );
  }

  if (!data || data.totalStudents === 0) {
    return (
      <PageContainer>
        <EmptyState
          icon={Users}
          title="No Students Yet"
          description="Once students enroll in your courses, they will appear here."
          action={{
            label: "Create a Course",
            onClick: () => router.push("/instructor/courses/create"),
          }}
        />
      </PageContainer>
    );
  }

  const filteredStudents = data.students.filter((student: InstructorStudent) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      student.name?.toLowerCase().includes(q) ||
      student.email.toLowerCase().includes(q)
    );
  });

  return (
    <PageContainer>
      <PageHeader
        title="Students"
        description={`${data.totalStudents} total student${data.totalStudents !== 1 ? "s" : ""}`}
      >
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
          />
        </div>
      </PageHeader>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Courses
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Avg Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Enrolled In
              </th>
            </tr>
          </thead>
          <motion.tbody
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="divide-y divide-border"
          >
            {filteredStudents.map((student: InstructorStudent) => (
              <motion.tr
                key={student.id}
                variants={staggerItem}
                className="transition-colors hover:bg-muted/30"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={student.name}
                      email={student.email}
                      imageUrl={student.profileImageUrl}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {student.name || "Unnamed"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {student.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-sm text-muted-foreground tabular-nums">
                  {student.totalCourses}
                </td>
                <td className="px-6 py-4">
                  <ProgressBar value={student.averageProgress} className="max-w-[8rem] mx-auto" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {student.enrolledCourses.slice(0, 2).map((ec) => (
                      <span
                        key={ec.courseId}
                        className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {ec.courseTitle.length > 25
                          ? `${ec.courseTitle.slice(0, 25)}...`
                          : ec.courseTitle}
                      </span>
                    ))}
                    {student.enrolledCourses.length > 2 && (
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        +{student.enrolledCourses.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No students match your search.
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
