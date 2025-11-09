// "use client";

import React from "react";
import { RiRadioButtonLine } from "react-icons/ri";
import {
  LineChart,
  Flex,
  Switch,
  Badge,
  BadgeDelta,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import { Course } from "@/types/course";
import { cn } from "@/lib/utils/utils";

interface BestSellingCoursesProps {
  courses: Course[];
}

export const BestSellingCourses: React.FC<BestSellingCoursesProps> = ({
  courses,
}) => {
  const [sortBy, setSortBy] = React.useState<"price" | "date" | "students">(
    "price"
  );

  const sortedCourses = [...courses].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return Number(b.price) - Number(a.price);
      case "date":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "students":
        return (b.totalStudents || 0) - (a.totalStudents || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
        <div className="flex flex-col-reverse items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Best Selling Courses
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Top performing courses
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow className="border-b border-zinc-100 dark:border-zinc-800">
              <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                Course Name
              </TableHeaderCell>
              <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                Published
              </TableHeaderCell>
              <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                Price
              </TableHeaderCell>
              <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                Students
              </TableHeaderCell>
              <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                Status
              </TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {sortedCourses.map((course: Course) => (
              <TableRow
                key={course.id}
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-sm"
              >
                {/* title column */}
                <TableCell className="px-6 py-4">
                  <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                    {course.title.length > 30
                      ? course.title.substring(0, 30) + "..."
                      : course.title}
                  </div>
                </TableCell>

                {/* date column */}
                <TableCell className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {new Date(course.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>

                {/* price column */}
                <TableCell className="px-6 py-4">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    ${parseFloat(course.price.toString()).toFixed(2)}
                  </span>
                </TableCell>

                {/* total students column */}
                <TableCell className="px-6 py-4">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {course.totalStudents || Math.floor(Math.random() * 50) + 5}
                  </span>
                </TableCell>

                {/* published status column */}
                <TableCell className="px-6 py-4">
                  {/* <Badge
                    // color={course.isPublished ? "green" : "yellow"}
                    className="inline-flex items-center rounded-badge px-2 py-1 text-xs font-medium overflow-hidden"
                    icon={RiRadioButtonLine}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge> */}
                  <Badge
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold tracking-wide border-0 shadow-sm",
                      course.isPublished
                        ? "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-300 ring-1 ring-green-500/20"
                        : "bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300 ring-1 ring-yellow-500/20"
                    )}
                    icon={RiRadioButtonLine}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedCourses.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No courses found
          </p>
        </div>
      )}
    </div>
  );
};
