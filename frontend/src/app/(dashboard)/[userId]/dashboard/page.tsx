"use client";

import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import { enrollmentColumns } from "./_components/enrolled-courses-tables/columns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Callout,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import { DataTable } from "./_components/enrolled-courses-tables/data-table";
import { createdArticlesColumns } from "./_components/created-articles-table/created-articles-columns";
import { savedArticlesColumns } from "./_components/saved-articles-table/saved-articles-columns";
import { useUserStore } from "@/zustand/userStore";
import UserDashboardStats from "./_components/user-dashboard-stats";
import LearningGoals from "./_components/learning-goals/learning-goals";
import { EnrollementWithProgress } from "@/types/enrollment-with-progress";
import { Poppins } from "next/font/google";
import ScheduledSessions from "./_components/scheduled-sessions/scheduled-sessions";
import {
  BookmarkIcon,
  PencilIcon,
  GraduationCapIcon,
  ClockIcon,
  TrendingUpIcon,
  CalendarIcon,
  TargetIcon,
  SparklesIcon,
} from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { BlogArticle } from "@/types/blog-api-response";
import { useParams } from "next/navigation";
import { EnrolledCourse } from "@/types/enrollments-api-response";
import { cn } from "@/lib/utils";
import LearningActivityLineChart from "./_components/user-learning-activity/learning-activity-line-chart";
import { poppins } from "@/lib/fonts";
import ErrorMessage from "./_components/ErrorMessage";
import {
  CreatedArticlesSkeleton,
  EnrolledCoursesTableSkeleton,
  SavedArticlesSkeleton,
} from "./loading";
import EmptyState from "./_components/EmptyState";
import { Enrollment } from "@/types/user-enrollments-api-response";
import { formatDateToMMDDYYYY } from "@/utils/utils";

///* ---------------------------- DESIRED SECTIONS --------------------
/**
 * Final Order:
 * 1. Personalized Learning Path (New).
 * 2. Progress Overview (New).
 * 3. Stats (Existing).
 * 4. Recent Activity Feed (New).
 * 5. Upcoming Sessions & Deadlines (New).
 * 6. Enrolled Courses Table (Existing).
 * 7. Certificates & Achievements (New).
 * 8. Personalized Recommendations (New).
 * 9. Articles Section (Existing).
 * 10. Learning Goals Section (Existing).
 * 11. Project Showcase (New).
 * 12. Best Selling Courses (Instructor-related, if applicable).
 */
//* -----------------------------------------------------------------------

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

// ---------------------------------------------------------------------------------------

const DashboardPage = () => {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const { theme } = useTheme();

  const {
    fetchEnrolledCourses,
    enrolledCourses,
    loadingState: { loading, error },
  } = useUserStore();

  useEffect(() => {
    fetchEnrolledCourses();
    // userId
  }, [userId, fetchEnrolledCourses]);

  const totalEnrolledCourses = enrolledCourses?.length || 0;
  const totalCompletedCourses =
    enrolledCourses?.filter(
      (enrollment: Enrollment) => enrollment.status === "COMPLETED"
    ).length || 0;
  const totalOngoingCourses =
    enrolledCourses?.filter(
      (course: any) => course.enrollmentStatus === "ACTIVE"
    ).length || 0;

  // Calculate completion rate
  const completionRate =
    totalEnrolledCourses > 0
      ? Math.round((totalCompletedCourses / totalEnrolledCourses) * 100)
      : 0;

  return (
    <div className={poppins.className}>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-900/20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="mx-auto max-w-7xl px-4 py-11 sm:px-6 lg:pr-14">
          {/* Header Section */}
          <motion.div className="mb-8 mt-16" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
                  Welcome back! 👋
                </h1>
                <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
                  Track your learning progress and stay motivated
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-sm text-zinc-500 dark:text-zinc-400">
                  <ClockIcon className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString("en-GB")}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <UserDashboardStats
              totalEnrolledCourses={totalEnrolledCourses}
              totalCompletedCourses={totalCompletedCourses}
              totalOngoingCourses={totalOngoingCourses}
            />
          </motion.div>

          {/* Progress Overview */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <TrendingUpIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                      Learning Progress
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Your course completion overview
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {completionRate}%
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Completion Rate
                  </div>
                </div>
              </div>

              <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {totalEnrolledCourses}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Enrolled
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                    {totalOngoingCourses}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    In Progress
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {totalCompletedCourses}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Completed
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Learning Activity Chart */}
          <motion.div variants={itemVariants} className="mb-8">
            <LearningActivityLineChart />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enrolled Courses - Takes 2 columns */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <EnrolledCourses
                enrolledCourses={enrolledCourses}
                areEnrolledCoursesLoading={loading}
                enrolledCoursesError={error}
              />
            </motion.div>

            {/* Learning Goals - Takes 1 column */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
                <LearningGoals />
              </div>
            </motion.div>
          </div>

          {/* Articles Section - Full Width */}
          <motion.div variants={itemVariants} className="mt-8">
            <ArticlesAndLearningGoals userId={userId} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;

// ----------------------------- components -----------------------------

/// Enrolled Courses
interface EnrolledCoursesProps {
  enrolledCourses: Enrollment[];
  areEnrolledCoursesLoading: boolean;
  enrolledCoursesError: string | null;
}

const EnrolledCourses: React.FC<EnrolledCoursesProps> = ({
  enrolledCourses,
  areEnrolledCoursesLoading,
  enrolledCoursesError,
}) => {
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

  if (areEnrolledCoursesLoading) return <EnrolledCoursesTableSkeleton />;
  if (enrolledCoursesError)
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
        <ErrorMessage
          title="Error Fetching Enrolled Courses"
          message={enrolledCoursesError}
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

// ---------------------------------------------------------------------------------------

// Optimized ArticlesAndLearningGoals Component
interface ArticlesAndLearningGoals {
  userId: string;
}

const ArticlesAndLearningGoals: React.FC<ArticlesAndLearningGoals> = ({
  userId,
}) => {
  const {
    fetchCreatedArticles,
    createdArticles,
    loadingState: { loading, error },
    savedArticles,
    loadingState: { loading: savedArticlesLoading, error: savedArticlesError },
  } = useUserStore();

  useEffect(() => {
    fetchCreatedArticles();
  }, [userId, fetchCreatedArticles]);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <PencilIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                My Content
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Articles and learning materials
              </p>
            </div>
          </div>
        </div>

        <Articles
          savedArticles={savedArticles}
          savedArticlesLoading={savedArticlesLoading}
          savedArticlesError={savedArticlesError}
          createdArticles={createdArticles}
          createdArticlesLoading={loading}
          createdArticlesError={error}
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------

// Optimized Articles Component
interface ArticlesProps {
  savedArticles: BlogArticle[];
  savedArticlesLoading: boolean;
  savedArticlesError: string | null;
  createdArticles: BlogArticle[];
  createdArticlesLoading: boolean;
  createdArticlesError: string | null;
}

const Articles: React.FC<ArticlesProps> = ({
  savedArticles,
  savedArticlesLoading,
  savedArticlesError,
  createdArticles,
  createdArticlesLoading,
  createdArticlesError,
}) => {
  const [isSelected, setIsSelected] = React.useState(1);

  return (
    <div className="w-full">
      <TabGroup>
        <TabList
          defaultValue="1"
          color="blue"
          className="mb-6 bg-zinc-50 dark:bg-zinc-700 p-1 rounded-xl flex border border-zinc-200 dark:border-zinc-600"
        >
          <Tab
            value="1"
            className="flex-1 cursor-pointer text-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 data-[state=selected]:bg-blue-500 data-[state=selected]:text-white data-[state=selected]:shadow-sm data-[state=inactive]:hover:bg-blue-500 data-[state=inactive]:hover:text-white data-[state=inactive]:text-zinc-600 data-[state=inactive]:dark:text-zinc-400"
          >
            <div className="flex items-center justify-center space-x-2">
              <BookmarkIcon className="h-4 w-4" />
              <span>Saved Articles</span>
            </div>
          </Tab>
          <Tab
            value="2"
            className="flex-1 cursor-pointer text-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 data-[state=selected]:bg-blue-500 data-[state=selected]:text-white data-[state=selected]:shadow-sm data-[state=inactive]:hover:bg-blue-500 data-[state=inactive]:hover:text-white data-[state=inactive]:text-zinc-600 data-[state=inactive]:dark:text-zinc-400"
          >
            <div className="flex items-center justify-center space-x-2">
              <PencilIcon className="h-4 w-4" />
              <span>Created Articles</span>
            </div>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {savedArticlesLoading ? (
              <SavedArticlesSkeleton />
            ) : savedArticlesError ? (
              <ErrorMessage
                title="Error fetching saved articles"
                message={savedArticlesError}
              />
            ) : (
              <div>
                {(savedArticles?.length || 0) > 0 ? (
                  <DataTable
                    columns={savedArticlesColumns}
                    data={savedArticles || []}
                  />
                ) : (
                  <EmptyState
                    title="No saved articles"
                    description="You haven't saved any articles yet. Browse and save one to get started."
                    icon={BookmarkIcon}
                    action={{
                      label: "Browse Articles",
                      href: "/articles",
                    }}
                  />
                )}
              </div>
            )}
          </TabPanel>

          <TabPanel>
            {createdArticlesLoading ? (
              <CreatedArticlesSkeleton />
            ) : createdArticlesError ? (
              <ErrorMessage
                title="Error fetching created articles"
                message={createdArticlesError}
              />
            ) : (
              <div>
                {(createdArticles?.length || 0) > 0 ? (
                  <DataTable
                    columns={createdArticlesColumns}
                    data={createdArticles || []}
                  />
                ) : (
                  <EmptyState
                    title="No created articles"
                    description="Share your knowledge by creating your first article."
                    icon={PencilIcon}
                    action={{
                      label: "Create Article",
                      href: "/articles/new",
                    }}
                  />
                )}
              </div>
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};
