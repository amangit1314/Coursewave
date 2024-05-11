"use client";

import React from "react";
import {
  Callout,
  Divider,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import {
  Enrollment as enrollment,
  enrollmentColumns,
} from "./_components/enrolled-courses-tables/columns";
import { useQuery } from "@tanstack/react-query";
import { Course, Enrollment, User } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "./_components/enrolled-courses-tables/data-table";
import { BarChartExampleWithCustomTooltip } from "./_components/bar-chart";
import UserDashboardStats from "./_components/user-dashboard-stats";
import DashboardHeader from "./_components/dashboard-header";
import LearningActivityLineChart from "./_components/user-learning-activity/learning-activity-line-chart";
import ScheduledSessions from "./_components/scheduled-sessions/scheduled-sessions";
import { createdArticlesColumns } from "./_components/created-articles-table/created-articles-columns";
import { cn } from "@/utils/utils";
import LearningGoals from "./_components/learning-goals/learning-goals";
import { savedArticlesColumns } from "./_components/saved-articles-table/saved-articles-columns";

const DashboardPage = ({ params }: { params: { userId: string } }) => {
  const userId = params?.userId!;

  const fetchUserEnrolledCourses = async () => {
    const response = await fetch(`/api/profile/${userId}/enrolledCourses`);

    if (!response.ok) {
      console.log("Failed to fetch user enrolled courses ...");
    }

    return await response.json();
  };

  const {
    data: enrolledCourses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: fetchUserEnrolledCourses,
    staleTime: 4,
  });

  const enrolledCoursesTableData = React.useMemo(() => {
    const toEnrollmentProps = (enrollment: Enrollment): enrollment => {
      return {
        // id: enrollment.enrollment.enrollmentId,
        // courseId: enrollment.enrollment.courseId,
        // courseName: enrollment.course.courseTitle,
        // enrollmentDate: enrollment.enrollment.enrollmentDate.substring(0, 16),
        id: enrollment.enrollmentId,
        courseId: enrollment.courseId,
        courseName: enrollment?.courseTitle
          ? enrollment?.courseTitle
          : "No Title Available",
        enrollmentDate: enrollment.enrollmentDate.substring(0, 16),
        progress: 0,
        certificate: "Certificate",
        status: "active",
        // validity: "Life time",
      };
    };
    return enrolledCourses?.data?.map(toEnrollmentProps);
  }, [enrolledCourses]);

  const fetchCreatedArticles = async () => {
    const response = await fetch(`/api/profile/${userId}/createdArticles`);

    if (!response.ok) {
      console.log("Failed to fetch user created articles ...");
    }

    return await response.json();
  };

  const {
    data: createdArticles,
    isLoading: isCreatedArticlesLoading,
    error: createdArticlesError,
  } = useQuery({
    queryKey: ["createdArticles"],
    queryFn: fetchCreatedArticles,
    staleTime: 4,
  });

  const fetchSavedArticles = async () => {
    const response = await fetch(`/api/profile/${userId}/savedArticles`);

    if (!response.ok) {
      console.log("Failed to fetch user created articles ...");
    }

    return await response.json();
  };

  const {
    data: savedArticles,
    isLoading: isSavedArticlesLoading,
    error: savedArticlesError,
  } = useQuery({
    queryKey: ["createdArticles"],
    queryFn: fetchSavedArticles,
    staleTime: 4,
  });
  // const createdArticlesTableData = React.useMemo(() => { }, [createdArticles]);

  return (
    <div className="py-4 overflow-x-hidden">
      {/* header */}
      <DashboardHeader />

      {/* <div className="flex justify-between items-center h-full">
        <DashboardHeader />
      </div> */}

      {/* other content */}
      <div className="space-y-4 md:space-y-12">
        <p className="text-xl pt-8 font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong tracking-tight">
          User Dashboard
        </p>

        {/* user dashboard stats */}
        <UserDashboardStats
          totalEnrolledCourses={3}
          totalCompletedCourses={2}
          totalOngoingCourses={1}
        />

        {/* line chart for learning activity */}
        {/* <LearningActivityLineChart /> */}

        {/* Sessions */}
        <ScheduledSessions />

        {/* Activity Bar Chart */}
        {/* <BarChartExampleWithCustomTooltip /> */}

        {/* enrolled Courses  */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong tracking-tight">
            Enrolled Courses
          </h3>

          {/* enrolled courses table */}
          <>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full rounded-md" />
                <Skeleton className="h-16 w-full rounded-md" />
                <Skeleton className="h-16 w-full rounded-md" />
                <Skeleton className="h-16 w-full rounded-md" />
              </div>
            ) : error ? (
              <div>Error fetching enrolled courses</div>
            ) : (
              <div>
                {enrolledCourses?.data?.length > 0 ? (
                  <DataTable
                    columns={enrollmentColumns}
                    data={enrolledCoursesTableData}
                  />
                ) : (
                  <div>You haven't enrolled in any courses yet.</div>
                )}
              </div>
            )}
          </>
        </div>

        <div className="grid grid-cols-3 justify-between gap-6 items-start mb-8 p-4 rounded-md border border-stroke ">
          <div className="space-y-4 col-span-2">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong tracking-tight">
              Articles
            </h3>
            {/* Articles (Tab) */}
            <TabGroup>
              <TabList
                variant="line"
                defaultValue="1"
                color={"blue"}
                className=" mb-4"
              >
                <Tab
                  value="1"
                  className={cn(
                    "flex justify-center items-center rounded-md bg-transparent border border-stroke border-blue-500 text-blue-500 px-4 py-2 font-medium tracking-tight hover:text-white hover:bg-blue-500 hover:border-transparent active:text-white active:border-transparent active:bg-blue-500"
                  )}
                >
                  Saved Articles
                </Tab>
                <Tab
                  value="2"
                  className={cn(
                    "flex justify-center items-center rounded-md  bg-transparent border border-stroke border-blue-500 text-blue-500 px-4 py-2 font-medium tracking-tight hover:text-white hover:bg-blue-500 hover:border-transparent active:text-white active:border-transparent active:bg-blue-500"
                  )}
                >
                  Created Articles
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <>
                    {isSavedArticlesLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-16 w-full rounded-md" />
                        <Skeleton className="h-16 w-full rounded-md" />
                        <Skeleton className="h-16 w-full rounded-md" />
                        <Skeleton className="h-16 w-full rounded-md" />
                      </div>
                    ) : savedArticlesError ? (
                      <div>Error fetching enrolled courses</div>
                    ) : (
                      <div>
                        {savedArticles?.data?.length > 0 ? (
                          <DataTable
                            columns={savedArticlesColumns}
                            data={savedArticles}
                          />
                        ) : (
                          <Callout
                            className=""
                            title="No saved articles"
                            color="yellow"
                          >
                            You doesn't saved any article, Browse and save one
                            😁 ...
                          </Callout>
                        )}
                      </div>
                    )}
                  </>
                </TabPanel>
                <TabPanel>
                  <>
                    {isCreatedArticlesLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-16 w-full rounded-md" />
                        <Skeleton className="h-16 w-full rounded-md" />
                        <Skeleton className="h-16 w-full rounded-md" />
                        <Skeleton className="h-16 w-full rounded-md" />
                      </div>
                    ) : createdArticlesError ? (
                      <div>Error fetching enrolled courses</div>
                    ) : (
                      <div>
                        {createdArticles?.data?.length > 0 ? (
                          <DataTable
                            columns={createdArticlesColumns}
                            data={createdArticles}
                          />
                        ) : (
                          <Callout
                            className=""
                            title="No created articles"
                            color="yellow"
                          >
                            Wow such empty, Create your first article 😁 ...
                          </Callout>
                        )}
                      </div>
                    )}
                  </>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>

          {/* Learning Goals (TODO) */}
          <div className="h-full w-full">
            <LearningGoals />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
