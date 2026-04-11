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
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-400">
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
    <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 min-w-[40px]">
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
    className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
  >
    {children}
    <div className="flex flex-col">
      <ChevronUp
        className={`w-3 h-3 transition-colors ${
          sortField === field && sortDirection === "asc"
            ? "text-green-600 dark:text-green-400"
            : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
        }`}
      />
      <ChevronDown
        className={`w-3 h-3 -mt-1 transition-colors ${
          sortField === field && sortDirection === "desc"
            ? "text-green-600 dark:text-green-400"
            : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
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
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className={`${dmSans.className} bg-zinc-50 text-sm dark:bg-zinc-900/50`}
            >
              <tr>
                {visibleColumns.courseTitle && (
                  <th className="px-6 py-4 text-left">
                    <SortButton field="course" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        Course
                      </span>
                    </SortButton>
                  </th>
                )}
                {visibleColumns.category && (
                  <th className="px-6 py-4 text-left">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Category
                    </span>
                  </th>
                )}
                {visibleColumns.status && (
                  <th className="px-6 py-4 text-left">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Status
                    </span>
                  </th>
                )}
                {visibleColumns.progress && (
                  <th className="px-6 py-4 text-left">
                    <SortButton field="progress" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        Progress
                      </span>
                    </SortButton>
                  </th>
                )}
                {visibleColumns.startDate && (
                  <th className="px-6 py-4 text-left">
                    <SortButton field="startDate" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        Start Date
                      </span>
                    </SortButton>
                  </th>
                )}
                {visibleColumns.certificate && (
                  <th className="px-6 py-4 text-left">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Certificate
                    </span>
                  </th>
                )}
                {visibleColumns.validity && (
                  <th className="px-6 py-4 text-left">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Validity
                    </span>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {paginatedData.length > 0 ? (
                paginatedData.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors"
                    onClick={() => onRowClick(course.courseId)}
                  >
                    {visibleColumns.courseTitle && (
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-center line-clamp-3 overflow-ellipsis text-sm text-zinc-900 dark:text-zinc-100 mb-1">
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
                        <span className="text-zinc-700 text-sm text-center dark:text-zinc-300">
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
                          <span className="text-zinc-400 dark:text-zinc-500 text-sm">
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
                      <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                        <BookOpen className="w-8 h-8 text-zinc-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                          No courses found
                        </h4>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
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
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, totalItems)}{" "}
            of {totalItems} courses
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                        : "text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
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
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
