import React from "react";
import {
  CheckCircle2,
  XCircle,
  Pause,
  Award,
  BookOpen,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { dmSans } from "@/lib/config/fonts";
import handleDownloadCertificate from "@/lib/helpers/handle-download-certificate";
import { formatDuration } from "@/lib/utils/format";
import {
  EnrollmentStatus,
  VisibleColumns,
  ProcessedEnrollment,
  Enrollment,
} from "./EnrolledCoursesTypes";

interface EnrolledCoursesTableBodyProps {
  paginatedData: ProcessedEnrollment[];
  visibleColumns: VisibleColumns;
  sortField: string;
  sortDirection: string;
  userName: string;
  onSort: (field: keyof Enrollment) => void;
  onRowClick: (courseId: string) => void;
  // Pagination
  totalPages: number;
  currentPage: number;
  startIndex: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const statusConfig: Record<EnrollmentStatus, { color: string; icon: React.ReactElement }> = {
  ACTIVE: {
    color: "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  COMPLETED: {
    color: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800",
    icon: <Award className="w-3 h-3" />,
  },
  PAUSED: {
    color: "text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800",
    icon: <Pause className="w-3 h-3" />,
  },
  DROPPED: {
    color: "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800",
    icon: <XCircle className="w-3 h-3" />,
  },
};

const StatusBadge = ({ status }: { status: EnrollmentStatus }) => {
  const config = statusConfig[status];
  if (!config) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-border text-muted-foreground">
        Unknown
      </div>
    );
  }
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}
    >
      {config.icon}
      {status}
    </div>
  );
};

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
    <span className="text-sm font-medium text-muted-foreground min-w-[40px]">
      {progress}%
    </span>
  </div>
);

const SortButton = ({
  field,
  sortField,
  sortDirection,
  onSort,
  children,
}: {
  field: keyof Enrollment;
  sortField: string;
  sortDirection: string;
  onSort: (field: keyof Enrollment) => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={() => onSort(field)}
    className="flex items-center gap-1 hover:text-foreground transition-colors group"
  >
    {children}
    <div className="flex flex-col">
      <ChevronUp
        className={`w-3 h-3 transition-colors ${
          sortField === field && sortDirection === "asc"
            ? "text-green-600 dark:text-green-400"
            : "text-muted-foreground group-hover:text-foreground"
        }`}
      />
      <ChevronDown
        className={`w-3 h-3 -mt-1 transition-colors ${
          sortField === field && sortDirection === "desc"
            ? "text-green-600 dark:text-green-400"
            : "text-muted-foreground group-hover:text-foreground"
        }`}
      />
    </div>
  </button>
);

export const EnrolledCoursesTableBody = ({
  paginatedData,
  visibleColumns,
  sortField,
  sortDirection,
  userName,
  onSort,
  onRowClick,
  totalPages,
  currentPage,
  startIndex,
  itemsPerPage,
  totalItems,
  onPageChange,
}: EnrolledCoursesTableBodyProps) => {
  return (
    <>
      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className={`${dmSans.className} bg-muted text-sm`}
            >
              <tr>
                {visibleColumns.courseTitle && (
                  <th className="px-6 py-4 text-left">
                    <SortButton field="course" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-muted-foreground">
                        Course
                      </span>
                    </SortButton>
                  </th>
                )}
                {visibleColumns.category && (
                  <th className="px-6 py-4 text-left">
                    <span className="font-semibold text-muted-foreground">
                      Category
                    </span>
                  </th>
                )}
                {visibleColumns.status && (
                  <th className="px-6 py-4 text-left">
                    <span className="font-semibold text-muted-foreground">
                      Status
                    </span>
                  </th>
                )}
                {visibleColumns.progress && (
                  <th className="px-6 py-4 text-left">
                    <SortButton field="progress" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>
                      <span className="font-semibold text-muted-foreground">
                        Progress
                      </span>
                    </SortButton>
                  </th>
                )}
                {visibleColumns.startDate && (
                  <th className="px-6 py-4 text-left">
                    <SortButton field="startDate" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>
                      <span className="font-semibold text-muted-foreground">
                        Start Date
                      </span>
                    </SortButton>
                  </th>
                )}
                {visibleColumns.certificate && (
                  <th className="px-6 py-4 text-left">
                    <span className="font-semibold text-muted-foreground">
                      Certificate
                    </span>
                  </th>
                )}
                {visibleColumns.validity && (
                  <th className="px-6 py-4 text-left">
                    <span className="font-semibold text-muted-foreground">
                      Validity
                    </span>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {paginatedData.length > 0 ? (
                paginatedData.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-muted/30 transition-colors"
                    onClick={() => onRowClick(course.courseId)}
                  >
                    {visibleColumns.courseTitle && (
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-center line-clamp-3 overflow-ellipsis text-sm text-foreground mb-1">
                            {course.courseTitle}
                          </div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.category && (
                      <td className="px-6 py-4">
                        <span
                          className="px-2 py-1 rounded-lg text-sm font-medium
                        bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400
                        "
                        >
                          {course.course?.categories?.length > 0
                            ? course.course.categories[0]
                            : "Uncategorized"}
                        </span>
                      </td>
                    )}
                    {visibleColumns.status && (
                      <td className="px-6 py-4">
                        <StatusBadge status={course.status as EnrollmentStatus} />
                      </td>
                    )}
                    {visibleColumns.progress && (
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <ProgressBar progress={course.progress} />
                        </div>
                      </td>
                    )}
                    {visibleColumns.startDate && (
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground text-sm text-center">
                          {course.startDate}
                        </span>
                      </td>
                    )}
                    {visibleColumns.certificate && (
                      <td className="px-6 py-4">
                        {course.certificate ? (
                          <button
                            className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 hover:underline hover:cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadCertificate({
                                userName: userName || "Unknown User",
                                courseName: course?.courseTitle,
                                date: new Date().toLocaleDateString(),
                                certContent:
                                  "Congratulations on your achievement!",
                                courseHours: formatDuration(
                                  course?.course?.duration
                                ),
                              });
                            }}
                          >
                            <Award className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Available
                            </span>
                          </button>
                        ) : (
                          <span className="text-muted-foreground dark:text-zinc-500 text-sm">
                            Not earned
                          </span>
                        )}
                      </td>
                    )}
                    {visibleColumns.validity && (
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            course.validity === "Lifetime"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {course.validity}
                        </span>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-3 bg-muted rounded-full">
                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">
                          No courses found
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, totalItems)}{" "}
            of {totalItems} courses
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      currentPage === pageNum
                        ? "bg-green-600 text-white"
                        : "text-muted-foreground bg-card border border-border hover:bg-muted"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
