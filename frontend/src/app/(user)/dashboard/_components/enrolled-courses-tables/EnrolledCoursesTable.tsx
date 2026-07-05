import React, { useState, useMemo } from "react";
import { GraduationCap } from "lucide-react";

import { formatDateToMMDDYYYY } from "@/lib/utils/utils";
import { useEnrolledCourses } from "@/hooks/useAccount";
import { EnrolledCoursesTableSkeleton } from "../../loading";
import ErrorMessage from "../ErrorMessage";
import { useRouter } from "next/navigation";
import { dmSans } from "@/lib/config/fonts";
import { useUserStore } from "@/zustand/userStore";

import {
  Enrollment,
  VisibleColumns,
} from "./EnrolledCoursesTypes";
import { EnrolledCoursesFilters } from "./EnrolledCoursesFilters";
import { EnrolledCoursesTableBody } from "./EnrolledCoursesTableBody";

// Re-export types for backward compatibility
export type {
  Course,
  Enrollment,
  EnrollmentStatus,
  ProcessedEnrollment,
  SortField,
  SortDirection,
  VisibleColumns,
  StatusConfig,
  StatusConfigMap,
} from "./EnrolledCoursesTypes";

const EnrolledCoursesTable = () => {
  const {
    data: enrolledCoursesData,
    isLoading: areEnrolledCoursesLoading,
    error: enrolledCoursesError,
  } = useEnrolledCourses();
  const { user } = useUserStore();

  const enrolledCourses = enrolledCoursesData ?? [];

  const enrolledCoursesTableData = useMemo(() => {
    if (!enrolledCourses || !Array.isArray(enrolledCourses)) {
      return [];
    }
    return enrolledCourses.map((enrollment) => ({
      id: enrollment.id,
      status: enrollment.status as import("./EnrolledCoursesTypes").EnrollmentStatus,
      startDate: formatDateToMMDDYYYY(enrollment.startDate),
      endDate: formatDateToMMDDYYYY(enrollment.endDate),
      userId: enrollment.userId,
      courseId: enrollment.course.id,
      courseTitle: enrollment.course.title,
      enrollmentDate: formatDateToMMDDYYYY(enrollment.createdAt),
      enrollmentStatus: enrollment.status as import("./EnrolledCoursesTypes").EnrollmentStatus,
      progress: enrollment.progress,
      certificate: enrollment.progress === 100,
      validity: enrollment.status !== "DROPPED" ? "Lifetime" : "Expired",
      createdAt: formatDateToMMDDYYYY(
        enrollment.createdAt ? enrollment.createdAt : ""
      ),
      updatedAt: formatDateToMMDDYYYY(
        enrollment.updatedAt ? enrollment.updatedAt : ""
      ),
      course: enrollment.course,
      courseProgress: enrollment.progress,
    }));
  }, [enrolledCourses]);

  const data = enrolledCoursesTableData;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortField, setSortField] = useState("enrollmentDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>({
    courseTitle: true,
    status: true,
    progress: true,
    startDate: true,
    certificate: true,
    validity: true,
    category: true,
  });

  const router = useRouter();

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((course) => {
      const matchesSearch =
        course.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course?.categories?.some((cat) =>
          cat.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesStatus =
        statusFilter === "ALL" || course.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "courseTitle":
          aValue = a.courseTitle?.toLowerCase() || "";
          bValue = b.courseTitle?.toLowerCase() || "";
          break;
        case "progress":
          aValue = a.progress || 0;
          bValue = b.progress || 0;
          break;
        case "enrollmentDate":
          aValue = new Date(a.enrollmentDate || 0);
          bValue = new Date(b.enrollmentDate || 0);
          break;
        case "startDate":
          aValue = new Date(a.startDate || 0);
          bValue = new Date(b.startDate || 0);
          break;
        default:
          aValue = (a as any)[sortField] || "";
          bValue = (b as any)[sortField] || "";
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, searchTerm, statusFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (field: keyof Enrollment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleColumnVisibility = (column: keyof Enrollment) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column as keyof VisibleColumns]: !prev[column as keyof VisibleColumns],
    }));
  };

  const handleRowClick = (courseId: string) => {
    router.push(`/learnings/${courseId}`);
  };

  if (areEnrolledCoursesLoading)
    return (
      <div className="bg-card rounded-3xl shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Enrolled Courses
              </h3>
              <p className="text-sm text-muted-foreground">
                Track your learning journey
              </p>
            </div>
          </div>
        </div>
        <EnrolledCoursesTableSkeleton />
      </div>
    );

  if (enrolledCoursesError)
    return (
      <div className="bg-card rounded-3xl shadow-sm border border-border p-6">
        <ErrorMessage
          title="Error Fetching Enrolled Courses"
          message={enrolledCoursesError.message}
        />
      </div>
    );

  return (
    <div className="bg-card rounded-3xl shadow-sm border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3
              className={`${dmSans.className} text-xl font-semibold text-foreground`}
            >
              Enrolled Courses
            </h3>
            <p className="text-sm text-muted-foreground">
              Track your learning journey • {filteredAndSortedData.length}{" "}
              courses
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <EnrolledCoursesFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        visibleColumns={visibleColumns}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onToggleColumnVisibility={toggleColumnVisibility}
      />

      {/* Table + Pagination */}
      <EnrolledCoursesTableBody
        paginatedData={paginatedData}
        visibleColumns={visibleColumns}
        sortField={sortField}
        sortDirection={sortDirection}
        userName={user?.name || "Unknown User"}
        onSort={handleSort}
        onRowClick={handleRowClick}
        totalPages={totalPages}
        currentPage={currentPage}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        totalItems={filteredAndSortedData.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default EnrolledCoursesTable;
