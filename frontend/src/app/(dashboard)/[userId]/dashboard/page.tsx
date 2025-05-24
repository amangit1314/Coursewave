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
import { DataTable } from "./_components/enrolled-courses-tables/data-table";
import { createdArticlesColumns } from "./_components/created-articles-table/created-articles-columns";
import { savedArticlesColumns } from "./_components/saved-articles-table/saved-articles-columns";
import { useUserStore } from "@/zustand/userStore";
import UserDashboardStats from "./_components/user-dashboard-stats";
import LearningGoals from "./_components/learning-goals/learning-goals";
import { EnrollementWithProgress } from "@/types/enrollment-with-progress";
import { Poppins } from "next/font/google";
import ScheduledSessions from "./_components/scheduled-sessions/scheduled-sessions";
import { BookmarkIcon, PencilIcon } from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { BlogArticle } from "@/types/blog-api-response";
import { useParams } from "next/navigation";
import { EnrolledCourse } from "@/types/enrollments-api-response";
import { cn } from "@/lib/utils";
import LearningActivityLineChart from "./_components/user-learning-activity/learning-activity-line-chart";

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

// const DashboardPage = ({ params }: { params: { userId: string } }) => {
//   const { userId } = params;
const DashboardPage = () => {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;

  const {
    fetchEnrolledCourses,
    enrolledCourses,
    loadingState: { loading, error },
  } = useUserStore();

  useEffect(() => {
    fetchEnrolledCourses(userId);
    // fetchScheduledSessions(userId);
  }, [
    userId,
    fetchEnrolledCourses,
    //  fetchScheduledSessions
  ]);

  console.log("User id in dashboard: ", userId);
  console.log("Enrolled Courses: ", enrolledCourses);

  const totalEnrolledCourses = enrolledCourses?.length || 0;
  const totalCompletedCourses =
    enrolledCourses?.filter(
      (enrollment: EnrolledCourse) => enrollment.status === "COMPLETED"
    ).length || 0;
  const totalOngoingCourses =
    enrolledCourses?.filter(
      (course: any) => course.enrollmentStatus === "ACTIVE"
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
          <LearningActivityLineChart />

          {/* <--------------------------- Sessions -----------------------------------> */}
          {/* <ScheduledSessions userId={userId} /> */}

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
  enrolledCourses: EnrolledCourse[];
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
      id: enrollment.id,
      status: enrollment.status,
      startDate: enrollment.startDate,
      endDate: enrollment.endDate,
      userId: enrollment.userId,
      courseId: enrollment.course.courseId,
      courseTitle: enrollment.course.courseTitle,
      enrollmentDate: enrollment.createdAt,
      enrollmentStatus: enrollment.status,
      progress: enrollment.progress,
      certificate: enrollment.progress === 100,
      validity: enrollment.status !== "DROPPED" ? "Lifetime" : "Expired",
      createdAt: enrollment.createdAt ? enrollment.createdAt : "", // Keep as string
      updatedAt: enrollment.updatedAt ? enrollment.updatedAt : "", // Keep as string
      course: enrollment.course,
      courseProgress: enrollment.progress,
    }));
  }, [enrolledCourses]);

  console.log("Enrollments in enrolled courses:", enrolledCourses);

  if (areEnrolledCoursesLoading) return <EnrolledCoursesTableSkeleton />;
  if (enrolledCoursesError)
    return (
      <Callout
        title="Error Fetching Enrolled Courses 🚨❌"
        className="rounded-lg bg-red-100 text-red-800 "
      >
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
        // <div>Enrollments received</div>

        <Callout
          title="No Enrolled Courses"
          className="rounded-lg bg-yellow-100 text-yellow-800 "
        >
          You haven't enrolled in any courses yet ...
        </Callout>
      )}
    </div>
  );
};

// /// Articles and Learning Goals Courses
// interface ArticlesAndLearningGoals {
//   userId: string;
// }

// const ArticlesAndLearningGoals: React.FC<ArticlesAndLearningGoals> = ({
//   userId,
// }) => {
//   const {
//     fetchCreatedArticles,
//     createdArticles,
//     loadingState: { loading, error },
//     savedArticles,
//     loadingState: { loading: savedArticlesLoading, error: savedArticlesError },
//   } = useUserStore();

//   useEffect(() => {
//     fetchCreatedArticles(
//       // userId
//     );
//   }, [userId, fetchCreatedArticles]);

//   return (
//     <div className="border-stroke mb-8 flex flex-col items-start justify-start space-y-6 rounded-md border p-4 md:grid md:grid-cols-3 md:justify-between md:gap-6 md:space-y-0">
//       <Articles
//         savedArticles={savedArticles}
//         savedArticlesLoading={savedArticlesLoading}
//         savedArticlesError={savedArticlesError}
//         createdArticles={createdArticles}
//         createdArticlesLoading={loading}
//         createdArticlesError={error}
//       />

//       <div className="md:cols-span-1 w-full">
//         <LearningGoals />
//       </div>
//     </div>
//   );
// };

// /// Articles
// interface ArticlesProps {
//   savedArticles: BlogArticle[];
//   savedArticlesLoading: boolean;
//   savedArticlesError: string | null;
//   createdArticles: BlogArticle[];
//   createdArticlesLoading: boolean;
//   createdArticlesError: string | null;
// }

// const Articles: React.FC<ArticlesProps> = ({
//   savedArticles,
//   savedArticlesLoading,
//   savedArticlesError,
//   createdArticles,
//   createdArticlesLoading,
//   createdArticlesError,
// }) => {
//   return (
//     <div className="w-full space-y-4 md:col-span-2">
//       <h3 className="text-lg font-medium tracking-tight text-tremor-content-strong dark:text-dark-tremor-content-strong">
//         Articles
//       </h3>

//       <TabGroup className="space-y-2">
//         <TabList
//           defaultValue="1"
//           color={"blue"}
//           className="overflow-hidden rounded-xl p-2 dark:bg-zinc-800"
//         >
//           <Tab
//             value="1"
//             className={cn(
//               "border-stroke flex items-center justify-center overflow-hidden rounded-md border border-transparent bg-transparent px-4 py-2 font-medium tracking-tight text-blue-500 hover:border-transparent hover:bg-blue-600 hover:text-white active:border-transparent active:bg-blue-600 active:text-white dark:hover:bg-zinc-700",
//             )}
//           >
//             Saved Articles
//           </Tab>
//           <Tab
//             value="2"
//             className={cn(
//               "border-stroke flex items-center justify-center overflow-hidden rounded-md border border-transparent bg-transparent px-4 py-2 font-medium tracking-tight text-blue-500 hover:border-transparent hover:bg-blue-600 hover:text-white active:border-transparent active:bg-blue-600 active:text-white dark:hover:bg-zinc-700",
//             )}
//           >
//             Created Articles
//           </Tab>
//         </TabList>

//         <TabPanels>
//           <TabPanel>
//             {savedArticlesLoading ? (
//               <SavedArticlesSkeleton />
//             ) : savedArticlesError ? (
//               <Callout title="Error fetching Saved Articles 🚨❌" color="red">
//                 {savedArticlesError} 🚨❌ ...
//               </Callout>
//             ) : (
//               <div>
//                 {savedArticles.length > 0 ? (
//                   <DataTable
//                     columns={savedArticlesColumns}
//                     data={savedArticles}
//                   />
//                 ) : (
//                   <Callout title="No saved articles" color="yellow">
//                     You haven't saved any articles. Browse and save one 😁 ...
//                   </Callout>
//                 )}
//               </div>
//             )}
//           </TabPanel>

//           <TabPanel>
//             {createdArticlesLoading ? (
//               <CreatedArticlesSkeleton />
//             ) : createdArticlesError ? (
//               <Callout title="Error Fetching Created Articles 🚨❌" color="red">
//                 {createdArticlesError} 🚨❌ ...
//               </Callout>
//             ) : (
//               <div>
//                 {createdArticles.length > 0 ? (
//                   <DataTable
//                     columns={createdArticlesColumns}
//                     data={createdArticles}
//                   />
//                 ) : (
//                   <Callout title="No created articles 🧐" color="yellow">
//                     Wow such empty, Create your first article 😁 ...
//                   </Callout>
//                 )}
//               </div>
//             )}
//           </TabPanel>
//         </TabPanels>
//       </TabGroup>
//     </div>
//   );
// };

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
    // border-gray-200 dark:border-gray-200
    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-stroke overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          My Content
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles section takes up more space */}
          <div className="lg:col-span-2 space-y-6">
            <Articles
              savedArticles={savedArticles}
              savedArticlesLoading={savedArticlesLoading}
              savedArticlesError={savedArticlesError}
              createdArticles={createdArticles}
              createdArticlesLoading={loading}
              createdArticlesError={error}
            />
          </div>

          {/* Learning Goals section */}
          <div className="lg:col-span-1">
            <LearningGoals />
          </div>
        </div>
      </div>
    </div>
  );
};

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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Articles
        </h3>

        <button className="text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors">
          New Article
        </button>
      </div>

      <TabGroup
      // onChange={(event: any) =>
      //   setIsSelected(Number(event.target.value))
      // }
      >
        <TabList
          defaultValue="1"
          color="blue"
          className="mb-6 bg-gray-50 dark:bg-zinc-800 p-1 rounded-lg flex border border-stroke"
        >
          <Tab
            value="1"
            className={`flex-1 cursor-pointer text-center hover:bg-blue-500 hover:text-white py-2 px-4 text-sm font-medium rounded-sm transition-colors  ${
              isSelected
                ? "data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                : ""
            }`}
          >
            Saved Articles
          </Tab>
          <Tab
            value="2"
            className="flex-1 cursor-pointer text-center hover:bg-blue-500 hover:text-white py-2 px-4 text-sm font-medium rounded-sm transition-colors data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Created Articles
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
                {savedArticles.length > 0 ? (
                  <DataTable
                    columns={savedArticlesColumns}
                    data={savedArticles}
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
                {createdArticles.length > 0 ? (
                  <DataTable
                    columns={createdArticlesColumns}
                    data={createdArticles}
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

// Reusable Empty State Component
interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.FC<any>;
  action?: {
    label: string;
    href: string;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-lg bg-gray-50 dark:bg-zinc-800/50">
      <div className="bg-white dark:bg-zinc-700 p-3 rounded-full mb-4">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <a
          href={action.href}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {action.label}
        </a>
      )}
    </div>
  );
};

// Error Message Component
interface ErrorMessageProps {
  title: string;
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message }) => {
  return (
    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
            {title}
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-400">
            <p>{message}</p>
          </div>
        </div>
      </div>
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
