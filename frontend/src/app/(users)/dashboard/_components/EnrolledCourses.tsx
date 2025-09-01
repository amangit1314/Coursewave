import { formatDateToMMDDYYYY } from "@/lib/utils/utils";
import { useMemo } from "react";
import { EnrolledCoursesTableSkeleton } from "../loading";
import ErrorMessage from "./ErrorMessage";
import { GraduationCapIcon } from "lucide-react";
import { DataTable } from "./enrolled-courses-tables/data-table";
import { enrollmentColumns } from "./enrolled-courses-tables/columns";
import EmptyState from "./EmptyState";
import { useEnrolledCourses } from "@/hooks/useEnrolledCourses";

const EnrolledCourses = () => {
  const {
    data: enrolledCourses,
    isLoading: areEnrolledCoursesLoading,
    error: enrolledCoursesError,
  } = useEnrolledCourses();

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

  if (areEnrolledCoursesLoading)
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <GraduationCapIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <GraduationCapIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
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

      {enrolledCourses?.length > 0 ? (
        <DataTable
          columns={enrollmentColumns}
          data={enrolledCoursesTableData}
        />
      ) : (
        <EmptyState
          title="No Enrolled Courses"
          description="Start your learning journey by enrolling in courses that interest you."
          icon={GraduationCapIcon}
          action={{
            label: "Browse Courses",
            href: "/courses/browse",
          }}
        />
      )}
    </div>
  );
};

export default EnrolledCourses;
