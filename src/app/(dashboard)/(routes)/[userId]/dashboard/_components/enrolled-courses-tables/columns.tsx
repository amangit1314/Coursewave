"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Enrollment = {
  id: string;
  courseId: string;
  courseName: string;
  enrollmentDate: string;
  progress: number;
  status: "started" | "inProgress" | "completed";
};

export const columns: ColumnDef<Enrollment>[] = [
  {
    accessorKey: "enrollmentId",
    header: "Enrollment Id",
  },
  {
    accessorKey: "courseTitle",
    header: "Course Title",
  },
  {
    accessorKey: "enrollmentDate",
    header: "Enrollment Date",
  },
  // {
  //   accessorKey: "progress",
  //   header: "Progress",
  // },
  {
    accessorKey: "completionStatus",
    header: "Status",
  },
];
