"use client";

import { motion } from "framer-motion";
import { ClockIcon } from "lucide-react";
import { useEnrolledCourses } from "@/hooks/useAccount";
import { Callout } from "@tremor/react";
import { Enrollment } from "@/types/user-enrollments-api-response";
import { dmSans, poppins } from "@/lib/config/fonts";
import UserDashboardStats from "./_components/UserDashboardStats";
import LearningProgress from "./_components/LearningProgress";
import LearningActivityLineChart from "./_components/user-learning-activity/learning-activity-line-chart";
import EnrolledCoursesTable from "./_components/enrolled-courses-tables/EnrolledCoursesTable";
import LearningGoals from "./_components/learning-goals/LearningGoals";
import ArticlesSection from "./_components/ArticlesSection";
import { useUserStore } from "@/zustand/userStore";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const DashboardPage = () => {
  const { user } = useUserStore();
  const {
    data: enrolledCoursesData,
    isLoading: areEnrolledCoursesLoading,
    error: enrolledCoursesError,
  } = useEnrolledCourses();

  const enrolledCourses = enrolledCoursesData ?? [];

  // Loading state
  if (areEnrolledCoursesLoading) {
    return <Callout title="Loading enrolled courses" color="yellow" />;
  }

  // Error state
  if (enrolledCoursesError) {
    return (
      <Callout
        title={
          enrolledCoursesError instanceof Error
            ? enrolledCoursesError.message
            : "Failed to load enrolled courses"
        }
        color="red"
      />
    );
  }

  // Stats
  const totalEnrolledCourses = enrolledCourses.length;
  const totalCompletedCourses =
    enrolledCourses.filter(
      (enrollment: Enrollment) => enrollment.status === "COMPLETED"
    ).length || 0;

  const totalOngoingCourses =
    enrolledCourses.filter((course: Enrollment) => course.status === "ACTIVE")
      .length || 0;

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
        <div className="mx-auto max-w-7xl px-4 py-11 sm:px-6 lg:pr-14 space-y-8">
          {/* Header */}
          <motion.div className="mb-8 mt-16" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <div>
                <h1
                  className={`${dmSans.className} tracking-tight text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl`}
                >
                  {/* Welcome back!, */}
                  Hi, {user?.name} 👋
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

          {/* Stats */}
          <motion.div variants={itemVariants}>
            <UserDashboardStats
              totalEnrolledCourses={totalEnrolledCourses}
              totalCompletedCourses={totalCompletedCourses}
              totalOngoingCourses={totalOngoingCourses}
            />
          </motion.div>

          {/* Progress Overview */}
          <motion.div variants={itemVariants}>
            <LearningProgress
              completionRate={completionRate}
              totalEnrolledCourses={totalEnrolledCourses}
              totalOngoingCourses={totalOngoingCourses}
              totalCompletedCourses={totalCompletedCourses}
            />
          </motion.div>

          {/* Learning Activity Chart */}
          <motion.div variants={itemVariants}>
            <LearningActivityLineChart />
          </motion.div>

          {/* Main Grid */}
          <motion.div variants={itemVariants}>
            <EnrolledCoursesTable />
          </motion.div>

          {/* Learning Goals */}
          <motion.div variants={itemVariants}>
            <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
              <LearningGoals />
            </div>
          </motion.div>

          {/* Articles */}
          <motion.div variants={itemVariants}>
            <ArticlesSection />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
