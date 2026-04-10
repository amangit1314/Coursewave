"use client";

import { motion } from "framer-motion";
import { ClockIcon } from "lucide-react";
import { useEnrolledCourses } from "@/hooks/useAccount";
import { Enrollment } from "@/types/user-enrollments-api-response";
import { dmSans, poppins } from "@/lib/config/fonts";
import UserDashboardStats from "./_components/UserDashboardStats";
import LearningProgress from "./_components/LearningProgress";
import LearningActivityLineChart from "./_components/user-learning-activity/learning-activity-line-chart";
import EnrolledCoursesTable from "./_components/enrolled-courses-tables/EnrolledCoursesTable";
import LearningGoals from "./_components/learning-goals/LearningGoals";
import ArticlesSection from "./_components/ArticlesSection";
import { useUserStore } from "@/zustand/userStore";
import { staggerContainer, staggerItem } from "@/lib/config/motion";
import { LoadingPage } from "@/components/shared";

const DashboardPage = () => {
  const { user } = useUserStore();
  const {
    data: enrolledCoursesData,
    isLoading: areEnrolledCoursesLoading,
    error: enrolledCoursesError,
  } = useEnrolledCourses();

  const enrolledCourses = enrolledCoursesData ?? [];

  if (areEnrolledCoursesLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingPage variant="stats" />
      </div>
    );
  }

  if (enrolledCoursesError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            {enrolledCoursesError instanceof Error
              ? enrolledCoursesError.message
              : "Failed to load enrolled courses"}
          </p>
        </div>
      </div>
    );
  }

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
        className="min-h-screen bg-background"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <motion.div className="pt-8" variants={staggerItem}>
            <div className="flex items-center justify-between">
              <div>
                <h1
                  className={`${dmSans.className} tracking-tight text-3xl font-bold text-foreground sm:text-4xl`}
                >
                  Hi, {user?.name}
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Track your learning progress and stay motivated
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <ClockIcon className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString("en-GB")}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={staggerItem}>
            <UserDashboardStats
              totalEnrolledCourses={totalEnrolledCourses}
              totalCompletedCourses={totalCompletedCourses}
              totalOngoingCourses={totalOngoingCourses}
            />
          </motion.div>

          {/* Progress Overview */}
          <motion.div variants={staggerItem}>
            <LearningProgress
              completionRate={completionRate}
              totalEnrolledCourses={totalEnrolledCourses}
              totalOngoingCourses={totalOngoingCourses}
              totalCompletedCourses={totalCompletedCourses}
            />
          </motion.div>

          {/* Learning Activity Chart */}
          <motion.div variants={staggerItem}>
            <LearningActivityLineChart />
          </motion.div>

          {/* Main Grid */}
          <motion.div variants={staggerItem}>
            <EnrolledCoursesTable />
          </motion.div>

          {/* Learning Goals */}
          <motion.div variants={staggerItem}>
            <div className="rounded-xl border border-border bg-card p-6">
              <LearningGoals />
            </div>
          </motion.div>

          {/* Articles */}
          <motion.div variants={staggerItem}>
            <ArticlesSection />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
