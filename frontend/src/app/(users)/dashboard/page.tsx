"use client";

import React from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { poppins } from "@/lib/config/fonts";
import { useEnrolledCourses } from "@/hooks/useEnrolledCourses";
import { ClockIcon, Divide, TrendingUpIcon } from "lucide-react";

import UserDashboardStats from "./_components/UserDashboardStats";
import LearningGoals from "./_components/learning-goals/learning-goals";
import LearningActivityLineChart from "./_components/user-learning-activity/learning-activity-line-chart";
import EnrolledCourses from "./_components/EnrolledCourses";

import LearningProgress from "./_components/LearningProgress";
import { Enrollment } from "@/lib/api/services";
import { Callout } from "@tremor/react";
import ArticlesSection from "./_components/ArticlesSection";

///* ---------------------------- DESIRED SECTIONS --------------------
/**
 * Final Order:
 * 1. Personalized Learning Path (--------- New ----------).
 * 2. Progress Overview (New).
 * 3. Stats (Existing).
 * 4. Recent Activity Feed (--------- New ---------).
 * 5. Upcoming Sessions & Deadlines (--------- New ---------).
 * 6. Enrolled Courses Table (Existing).
 * 7. Certificates & Achievements (--------- New ---------).
 * 8. Personalized Recommendations (--------- New ---------).
 * 9. Articles Section (Existing).
 * 10. Learning Goals Section (Existing).
 * 11. Project Showcase (--------- New ---------).
 */
//* -----------------------------------------------------------------------

// *---------------------------------- EXISTING --------------------------
/**
 * 2. Progress Overview.
 * 3. Stats.
 * 6. Enrolled Courses Table.
 * 9. Articles Section.
 * 10. Learning Goals Section.
 */
// *----------------------------------------------------------------------

// *----------------------------------- NEW ------------------------------
/**
 * 1.  Personalized Learning Path.
 * 4.  Recent Activity Feed.
 * 5.  Upcoming Sessions & Deadlines.
 * 7.  Certificates & Achievements.
 * 8.  Personalized Recommendations.
 * 11. Project Showcase.
 */
// *----------------------------------------------------------------------

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
  const {
    data: enrolledCourses,
    isLoading: areEnrolledCoursesLoading,
    error: enrolledCoursesError,
  } = useEnrolledCourses();

  const totalEnrolledCourses = enrolledCourses?.length || 0;
  const totalCompletedCourses =
    enrolledCourses?.filter(
      (enrollment: Enrollment) => enrollment.status === "COMPLETED"
    ).length || 0;
  // const totalCompletedCourses = 0; // Placeholder for now

  const totalOngoingCourses =
    enrolledCourses?.filter(
      (course: any) => course.enrollmentStatus === "ACTIVE"
    ).length || 0;

  // Calculate completion rate
  const completionRate =
    totalEnrolledCourses > 0
      ? Math.round((totalCompletedCourses / totalEnrolledCourses) * 100)
      : 0;
  // const completionRate = 0; // Placeholder for now

  console.log("Enrolled Courses:", enrolledCourses);

  if (areEnrolledCoursesLoading) {
    return (
      <div>
        <Callout title={"Loading enrolled courses"} color={"yellow"} />
      </div>
    );
  } else if (enrolledCoursesError) {
    return <Callout title={enrolledCoursesError.message} color={"red"} />;
  }

  return (
    <div className={poppins.className}>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-900/20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="mx-auto max-w-7xl px-4 py-11 sm:px-6 lg:pr-14 space-y-8">
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
          <motion.div variants={itemVariants} className="">
            <UserDashboardStats
              totalEnrolledCourses={totalEnrolledCourses}
              totalCompletedCourses={totalCompletedCourses}
              totalOngoingCourses={totalOngoingCourses}
            />
          </motion.div>

          {/* Progress Overview */}
          <motion.div variants={itemVariants} className="">
            <LearningProgress
              completionRate={completionRate}
              totalEnrolledCourses={totalEnrolledCourses}
              totalOngoingCourses={totalOngoingCourses}
              totalCompletedCourses={totalCompletedCourses}
            />
          </motion.div>

          {/* Learning Activity Chart */}
          <motion.div variants={itemVariants} className="">
            <LearningActivityLineChart />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enrolled Courses - Takes 2 columns */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <EnrolledCourses />
            </motion.div>

            {/* Learning Goals - Takes 1 column */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
                <LearningGoals />
              </div>
            </motion.div>
          </div>

          {/* Articles Section - Full Width */}
          <motion.div variants={itemVariants} className="">
            <ArticlesSection />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
