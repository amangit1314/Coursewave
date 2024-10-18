"use client";

import React, { useEffect, useMemo } from "react";
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
import { cn } from "@/utils/utils";
import { DataTable } from "./_components/enrolled-courses-tables/data-table";
import { createdArticlesColumns } from "./_components/created-articles-table/created-articles-columns";
import { savedArticlesColumns } from "./_components/saved-articles-table/saved-articles-columns";
import { useUserStore } from "@/zustand/userStore";
// import DashboardHeader from "./_components/dashboard-header";
import UserDashboardStats from "./_components/user-dashboard-stats";
import LearningGoals from "./_components/learning-goals/learning-goals";
import { EnrollementWithProgress } from "@/types/enrollment-with-progress";
import { BlogWithComments } from "@/types/blog-with-comments";
import { Poppins } from "next/font/google";
import LearningActivityLineChart from "./_components/user-learning-activity/learning-activity-line-chart";
import ScheduledSessions from "./_components/scheduled-sessions/scheduled-sessions";

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

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const DashboardPage = ({ params }: { params: { userId: string } }) => {
  const { userId } = params;

  const {
    fetchEnrolledCourses,
    enrolledCourses,
    loadingState: { loading, error },
  } = useUserStore();

  useEffect(() => {
    fetchEnrolledCourses(userId);
  }, [userId, fetchEnrolledCourses]);

  const totalEnrolledCourses = enrolledCourses?.length || 0;
  const totalCompletedCourses =
    enrolledCourses?.filter(
      (enrollment: EnrollementWithProgress) =>
        enrollment.enrollmentStatus === "COMPLETED",
    ).length || 0;
  const totalOngoingCourses =
    enrolledCourses?.filter(
      (course: any) => course.enrollmentStatus === "ACTIVE",
    ).length || totalEnrolledCourses;

  return (
    <div className={poppins.className}>
      <div className="overflow-x-hidden py-8 pl-8 pr-8 md:pl-0">
        {/* header */}
        {/* <DashboardHeader /> */}

        {/* other content */}
        <div className="space-y-6 md:space-y-8">
          {/* user dashboard text */}
          <p className="text-xl font-semibold tracking-tight text-tremor-content-strong dark:text-dark-tremor-content-strong">
            User Dashboard
          </p>

          {/* <---------------------------- user dashboard stats ----------------------> */}
          <UserDashboardStats
            totalEnrolledCourses={totalEnrolledCourses}
            totalCompletedCourses={totalCompletedCourses}
            totalOngoingCourses={totalOngoingCourses}
          />

          {/* <--------------------------- Line chart for learning activity -----------> */}
          {/* <LearningActivityLineChart /> */}

          {/* <--------------------------- Sessions -----------------------------------> */}
          <ScheduledSessions />

          {/* <--------------------------- Activity Bar Chart --------------------------> */}
          {/* <BarChartExampleWithCustomTooltip /> */}

          {/* <--------------------------- Enrolled Courses -----------------------------> */}
          <EnrolledCourses
            enrolledCourses={enrolledCourses}
            areEnrolledCoursesLoading={loading}
            enrolledCoursesError={error}
          />

          {/* <------------------------------ Articles & Learning Goals -------------------------> */}
          <ArticlesAndLearningGoals userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

// ----------------------------- components -----------------------------

/// Enrolled Courses
interface EnrolledCoursesProps {
  enrolledCourses: EnrollementWithProgress[];
  areEnrolledCoursesLoading: boolean;
  enrolledCoursesError: string | null;
}

const EnrolledCourses: React.FC<EnrolledCoursesProps> = ({
  enrolledCourses,
  areEnrolledCoursesLoading,
  enrolledCoursesError,
}) => {
  const enrolledCoursesTableData = useMemo(() => {
    return enrolledCourses.map((enrollment) => ({
      enrollmentId: enrollment.enrollmentId,
      userId: enrollment.user.id,
      courseId: enrollment.course.courseId,
      courseTitle: enrollment.course.courseTitle,
      courseProgressId: enrollment.courseProgress.id,
      enrollmentDate: enrollment.enrollmentDate,
      enrollmentStatus: enrollment.enrollmentStatus,
      progress: enrollment.courseProgress.completedPercentage,
      certificate:
        enrollment.courseProgress.completedPercentage === 100 ? true : false,
      validity:
        enrollment.enrollmentStatus !== "DROPPED" ? "Lifetime" : "Expired",
      createdAt: enrollment.createdAt ? new Date(enrollment.createdAt) : null,
      updatedAt: enrollment.updatedAt ? new Date(enrollment.updatedAt) : null,
      ChapterProgress: enrollment.ChapterProgress,
      user: enrollment.user,
      course: enrollment.course,
      courseProgress: enrollment.courseProgress,
    }));
  }, [enrolledCourses]);

  if (areEnrolledCoursesLoading) return <EnrolledCoursesTableSkeleton />;
  if (enrolledCoursesError)
    return (
      <Callout title="Error Fetching Enrolled Courses 🚨❌" color="red">
        {enrolledCoursesError} 🚨❌
      </Callout>
    );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium tracking-tight text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Enrolled Courses
      </h3>

      {enrolledCourses?.length > 0 ? (
        <DataTable
          columns={enrollmentColumns}
          data={enrolledCoursesTableData}
        />
      ) : (
        <Callout title="No Enrolled Courses" color="yellow">
          You haven't enrolled in any courses yet ...
        </Callout>
      )}
    </div>
  );
};

/// Articles and Learning Goals Courses
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
    fetchCreatedArticles(userId);
  }, [userId, fetchCreatedArticles]);

  return (
    <div className="border-stroke mb-8 flex flex-col items-start justify-start space-y-6 rounded-md border p-4 md:grid md:grid-cols-3 md:justify-between md:gap-6 md:space-y-0">
      <Articles
        savedArticles={savedArticles}
        savedArticlesLoading={savedArticlesLoading}
        savedArticlesError={savedArticlesError}
        createdArticles={createdArticles}
        createdArticlesLoading={loading}
        createdArticlesError={error}
      />

      <div className="md:cols-span-1 w-full">
        <LearningGoals />
      </div>
    </div>
  );
};

/// Articles
interface ArticlesProps {
  savedArticles: BlogWithComments[];
  savedArticlesLoading: boolean;
  savedArticlesError: string | null;
  createdArticles: BlogWithComments[];
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
  return (
    <div className="w-full space-y-4 md:col-span-2">
      <h3 className="text-lg font-medium tracking-tight text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Articles
      </h3>

      <TabGroup className="space-y-2">
        <TabList
          defaultValue="1"
          color={"blue"}
          className="overflow-hidden rounded-xl p-2 dark:bg-zinc-800"
        >
          <Tab
            value="1"
            className={cn(
              "border-stroke flex items-center justify-center overflow-hidden rounded-md border border-transparent bg-transparent px-4 py-2 font-medium tracking-tight text-blue-500 hover:border-transparent hover:bg-blue-600 hover:text-white active:border-transparent active:bg-blue-600 active:text-white dark:hover:bg-zinc-700",
            )}
          >
            Saved Articles
          </Tab>
          <Tab
            value="2"
            className={cn(
              "border-stroke flex items-center justify-center overflow-hidden rounded-md border border-transparent bg-transparent px-4 py-2 font-medium tracking-tight text-blue-500 hover:border-transparent hover:bg-blue-600 hover:text-white active:border-transparent active:bg-blue-600 active:text-white dark:hover:bg-zinc-700",
            )}
          >
            Created Articles
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {savedArticlesLoading ? (
              <SavedArticlesSkeleton />
            ) : savedArticlesError ? (
              <Callout title="Error fetching Saved Articles 🚨❌" color="red">
                {savedArticlesError} 🚨❌ ...
              </Callout>
            ) : (
              <div>
                {savedArticles.length > 0 ? (
                  <DataTable
                    columns={savedArticlesColumns}
                    data={savedArticles}
                  />
                ) : (
                  <Callout title="No saved articles" color="yellow">
                    You haven't saved any articles. Browse and save one 😁 ...
                  </Callout>
                )}
              </div>
            )}
          </TabPanel>

          <TabPanel>
            {createdArticlesLoading ? (
              <CreatedArticlesSkeleton />
            ) : createdArticlesError ? (
              <Callout title="Error Fetching Created Articles 🚨❌" color="red">
                {createdArticlesError} 🚨❌ ...
              </Callout>
            ) : (
              <div>
                {createdArticles.length > 0 ? (
                  <DataTable
                    columns={createdArticlesColumns}
                    data={createdArticles}
                  />
                ) : (
                  <Callout title="No created articles 🧐" color="yellow">
                    Wow such empty, Create your first article 😁 ...
                  </Callout>
                )}
              </div>
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

/// ---------------------------- SKELETONS ------------------------------
const SavedArticlesSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-16 w-full rounded-md" />
      <Skeleton className="h-16 w-full rounded-md" />
      <Skeleton className="h-16 w-full rounded-md" />
      <Skeleton className="h-16 w-full rounded-md" />
    </div>
  );
};

const CreatedArticlesSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-16 w-full rounded-md" />
      <Skeleton className="h-16 w-full rounded-md" />
      <Skeleton className="h-16 w-full rounded-md" />
      <Skeleton className="h-16 w-full rounded-md" />
    </div>
  );
};

// TODO: Enrolled courses table skeleton
const EnrolledCoursesTableSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-16 w-full rounded-md" />
      <Skeleton className="h-16 w-full rounded-md" />
      <Skeleton className="h-16 w-full rounded-md" />
      <Skeleton className="h-16 w-full rounded-md" />
    </div>
  );
};
