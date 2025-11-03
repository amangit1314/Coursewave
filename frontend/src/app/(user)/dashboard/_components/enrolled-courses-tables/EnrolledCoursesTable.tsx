import React, { useState, useMemo } from "react";
import {
  GraduationCap,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Calendar,
  Award,
  Clock,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Pause,
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { formatDateToMMDDYYYY } from "@/lib/utils/utils";

import { useEnrolledCourses } from "@/hooks/useAccount";
import { EnrolledCoursesTableSkeleton } from "../../loading";
import ErrorMessage from "../ErrorMessage";
import { useRouter } from "next/navigation";
import { dmSans } from "@/lib/config/fonts";
import handleDownloadCertificate from "@/lib/helpers/handle-download-certificate";
import { useUserStore } from "@/zustand/userStore";
import { formatDuration } from "@/lib/utils/format";

/**
 * Course interface matching the API response structure
 */
interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  price: number;
  dealPrice: number;
  discount: number;
  duration: number;
  isFree: boolean;
  isLive: boolean;
  isPublished: boolean;
  averageRating: number;
  categoryId: string;
  instructorId: string;
  categories: string[];
  learningOutcomes: string[];
  prerequisites: string[];
  targetAudience: string[];
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Enrollment status union type
 */
type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "PAUSED" | "DROPPED";

/**
 * Enrollment interface matching the API response structure
 */
interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  course: Course;
}

// Processed Data Types
// -------------------

/**
 * Processed enrollment data for table display
 */
interface ProcessedEnrollment {
  id: string;
  status: EnrollmentStatus;
  startDate: string;
  endDate: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  enrollmentDate: string;
  enrollmentStatus: EnrollmentStatus;
  progress: number;
  certificate: boolean;
  validity: string;
  createdAt: string;
  updatedAt: string;
  course: Course;
  courseProgress: number;
}

// Component State Types
// --------------------

/**
 * Sortable fields type (keys of ProcessedEnrollment)
 */
type SortField = keyof ProcessedEnrollment;

/**
 * Sort direction type
 */
type SortDirection = "asc" | "desc";

/**
 * Column visibility configuration
 */
interface VisibleColumns {
  courseTitle: boolean;
  status: boolean;
  progress: boolean;
  startDate: boolean;
  // endDate: boolean;
  certificate: boolean;
  validity: boolean;
  category: boolean;
}

// UI Component Types
// -----------------

/**
 * Status configuration for badges
 */
interface StatusConfig {
  color: string;
  icon: React.ReactElement;
}

/**
 * Status configuration mapping
 */
type StatusConfigMap = {
  [K in EnrollmentStatus]: StatusConfig;
};

// React Component Props Types
// --------------------------

/**
 * Props for StatusBadge component
 */
interface StatusBadgeProps {
  status: EnrollmentStatus;
}

/**
 * Props for ProgressBar component
 */
interface ProgressBarProps {
  progress: number;
}

/**
 * Props for SortButton component
 */
interface SortButtonProps {
  field: SortField;
  children: React.ReactNode;
}

// Hook/API Types
// --------------

/**
 * API hook return type structure
 */
interface UseEnrolledCoursesReturn {
  data: Enrollment[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Error message component props
 */
interface ErrorMessageProps {
  title: string;
  message: string;
}

// React Built-in Types Used
// -------------------------

/**
 * React functional component type
 */
type FC = React.FunctionComponent;

/**
 * React node type for children
 */
type ReactNode = React.ReactNode;

/**
 * JSX element type for icons
 */
type JSXElement = React.JSX.Element;

/**
 * React state setter function type
 */
type SetStateAction<T> = React.SetStateAction<T>;
type Dispatch<T> = React.Dispatch<T>;

/**
 * React mouse event handler type
 */
type MouseEventHandler<T> = React.MouseEventHandler<T>;

/**
 * React change event handler type
 */
type ChangeEventHandler<T = Element> = (event: React.ChangeEvent<T>) => void;

// Utility Types Used
// -----------------

/**
 * Record utility type for mapping
 */
/**
 * Record utility type for mapping
 */
type RecordMap<K extends keyof any, T> = Record<K, T>;

/**
 * Keyof utility type for object keys
 */
/**
 * Keyof utility type for object keys
 */
type ObjectKeys<T> = keyof T;

/**
 * Array type
 */
type ArrayType<T> = T[];

/**
 * Union type with null
 */
type Nullable<T> = T | null;

/**
 * Union type with undefined
 */
type Optional<T> = T | undefined;

// Event Handler Types
// ------------------

/**
 * Click handler type
 */
type ClickHandler = () => void;

/**
 * Input change handler type
 */
type InputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;

/**
 * Select change handler type
 */
type SelectChangeHandler = (
  event: React.ChangeEvent<HTMLSelectElement>
) => void;

// Pagination Types
// ---------------

/**
 * Pagination state type
 */
interface PaginationState {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
}

// Search and Filter Types
// ----------------------

/**
 * Search term type
 */
type SearchTerm = string;

/**
 * Status filter type
 */
type StatusFilter = "ALL" | EnrollmentStatus;

// Export Types for External Use
// -----------------------------
export type {
  // Core types
  Course,
  Enrollment,
  EnrollmentStatus,
  ProcessedEnrollment,

  // Component types
  SortField,
  SortDirection,
  VisibleColumns,
  StatusConfig,
  StatusConfigMap,

  // Props types
  StatusBadgeProps,
  ProgressBarProps,
  SortButtonProps,

  // Hook types
  UseEnrolledCoursesReturn,
  ErrorMessageProps,

  // Utility types
  PaginationState,
  SearchTerm,
  StatusFilter,
  ClickHandler,
  InputChangeHandler,
  SelectChangeHandler,
};

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
      status: enrollment.status,
      startDate: formatDateToMMDDYYYY(enrollment.startDate),
      endDate: formatDateToMMDDYYYY(enrollment.endDate),
      userId: enrollment.userId,
      courseId: enrollment.course.id,
      courseTitle: enrollment.course.title,
      enrollmentDate: formatDateToMMDDYYYY(enrollment.createdAt),
      enrollmentStatus: enrollment.status,
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
  const [visibleColumns, setVisibleColumns] = useState({
    courseTitle: true,
    status: true,
    progress: true,
    startDate: true,
    certificate: true,
    validity: true,
    category: true,
  });

  const router = useRouter();

  // Status configuration
  const statusConfig = {
    ACTIVE: {
      color:
        "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    COMPLETED: {
      color:
        "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800",
      icon: <Award className="w-3 h-3" />,
    },
    PAUSED: {
      color:
        "text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800",
      icon: <Pause className="w-3 h-3" />,
    },
    DROPPED: {
      color:
        "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800",
      icon: <XCircle className="w-3 h-3" />,
    },
  };

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

    // Sort data
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

  const StatusBadge = ({ status }: { status: keyof typeof statusConfig }) => {
    const config = statusConfig[status];
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.icon}
        {status}
      </div>
    );
  };

  const TextBadge = ({ text, color }: { text: string; color: string }) => {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}
      >
        {/* {config.icon} */}
        {text}
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
    children,
  }: {
    field: keyof Enrollment;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => handleSort(field)}
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

  // Add this function for navigation
  const handleRowClick = (courseId: string) => {
    router.push(`/learnings/${courseId}`);
  };

  if (areEnrolledCoursesLoading)
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Enrolled Courses
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
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
      <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
        <ErrorMessage
          title="Error Fetching Enrolled Courses"
          message={enrolledCoursesError.message}
        />
      </div>
    );

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3
              className={`${dmSans.className} text-xl font-semibold text-zinc-900 dark:text-white`}
            >
              Enrolled Courses
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Track your learning journey • {filteredAndSortedData.length}{" "}
              courses
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-6">
        {/* Search and Status Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${dmSans.className} appearance-none bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 pr-10 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="PAUSED">Paused</option>
              <option value="DROPPED">Dropped</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Column Visibility Toggle */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Columns:
          </span>
          {Object.entries(visibleColumns).map(([column, isVisible]) => (
            <button
              key={column}
              onClick={() => toggleColumnVisibility(column as keyof Enrollment)}
              className={`${dmSans.className} px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                isVisible
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
              }`}
            >
              {column.charAt(0).toUpperCase() +
                column.slice(1).replace(/([A-Z])/g, " $1")}
            </button>
          ))}
        </div>
      </div>

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
                    <SortButton field="course">
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
                    <SortButton field="progress">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        Progress
                      </span>
                    </SortButton>
                  </th>
                )}
                {visibleColumns.startDate && (
                  <th className="px-6 py-4 text-left">
                    <SortButton field="startDate">
                      {/* <Calendar className="w-4 h-4 mr-2" /> */}
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        Start Date
                      </span>
                    </SortButton>
                  </th>
                )}
                {/* {visibleColumns.endDate && (
                  <th className="px-6 py-4 text-left">
                    <SortButton field="endDate">
                    
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        End Date
                      </span>
                    </SortButton>
                  </th>
                )} */}
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
                    onClick={() => handleRowClick(course.courseId)}
                  >
                    {visibleColumns.courseTitle && (
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-center line-clamp-3 overflow-ellipsis text-sm text-zinc-900 dark:text-zinc-100 mb-1">
                            {course.courseTitle}
                          </div>
                          {/* <div className="text-sm text-zinc-500 dark:text-zinc-400">
                            by{" "}
                            {
                            course.course?.instructor?.user?.name || 
                            "Unknown Instructor"}
                          </div> */}
                        </div>
                      </td>
                    )}
                    {visibleColumns.category && (
                      <td className="px-6 py-4">
                        {/* <span className="inline-flex px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                          {course.course?.categories?.length > 0
                            ? course.course.categories[0]
                            : "Uncategorized"}
                        </span> */}

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
                        <StatusBadge
                          status={course.status as EnrollmentStatus}
                        />
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
                    {/* {visibleColumns.endDate && (
                      <td className="px-6 py-4">
                        <span className="text-zinc-700 text-sm text-center dark:text-zinc-300">
                          {course.endDate || course.endDate !== "Invalid date" ? course.endDate  : "Lifetime Access"}
                        </span>
                      </td>
                    )} */}
                    {/* {visibleColumns.certificate && (
                      <td className="px-6 py-4">
                        {course.certificate ? (
                          <div className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400">
                            <Award className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Available
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-400 dark:text-zinc-500 text-sm">
                            Not earned
                          </span>
                        )}
                      </td>
                    )} */}
                    {visibleColumns.certificate && (
                      <td className="px-6 py-4">
                        {course.certificate ? (
                          <button
                            className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 hover:underline hover:cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent parent row's onClick navigation
                              handleDownloadCertificate({
                                userName: user?.name || "Unknown User",
                                courseName: course?.courseTitle,
                                date: new Date().toLocaleDateString(), // todo: fix the data currently the immediate date will go
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
            {Math.min(startIndex + itemsPerPage, filteredAndSortedData.length)}{" "}
            of {filteredAndSortedData.length} courses
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                    onClick={() => setCurrentPage(pageNum)}
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
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrolledCoursesTable;
