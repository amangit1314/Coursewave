"use client";

import React from "react";
import {
  EnrollementWithProgress as enrollment,
  enrollmentColumns,
} from "./_components/enrolled-courses-tables/columns";
import { useQuery } from "@tanstack/react-query";
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
import { useZustandStore } from "@/zustand/store";
import { DataTable } from "./_components/enrolled-courses-tables/data-table";
import { createdArticlesColumns } from "./_components/created-articles-table/created-articles-columns";
import { savedArticlesColumns } from "./_components/saved-articles-table/saved-articles-columns";
import DashboardHeader from "./_components/dashboard-header";
import UserDashboardStats from "./_components/user-dashboard-stats";
import LearningGoals from "./_components/learning-goals/learning-goals";


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
    console.log(
      "Enrolled courses in use memo for table data: ",
      enrolledCourses
    );
    const toEnrollmentProps = (enrolledCourse: any): enrollment => {
      return {
        enrollmentId: enrolledCourse.enrollmentId,
        userId: enrolledCourse.userId,
        courseId: enrolledCourse.courseId,
        courseTitle: enrolledCourse.course.courseTitle,
        courseProgressId: "enrollment.courseProgressId",
        enrollmentDate: enrolledCourse.enrollmentDate.substring(0, 16),
        progress: 0,
        certificate: "Certificate",
        enrollmentStatus: enrolledCourse.enrollmentStatus,
        validity: "Life time",
        createdAt: enrolledCourse.enrollmentDate,
        updatedAt: enrolledCourse.enrollmentDate,
      };
    };
    return enrolledCourses?.data?.map(toEnrollmentProps);
  }, [enrolledCourses]);

  // <--------------------------- Calculate totals ---------------------->
  const totalEnrolledCourses = enrolledCourses?.data?.length || 0;
  const totalCompletedCourses =
    enrolledCourses?.data?.filter(
      (course: any) => course.enrollmentStatus === "completed"
    ).length || 0;
  const totalOngoingCourses =
    enrolledCourses?.data?.filter(
      (course: any) => course.enrollmentStatus === "ongoing"
    ).length || totalEnrolledCourses;

  // <-------------------------- Main ----------------------------------->
  return (
    <div className="py-4 overflow-x-hidden">
      {/* header */}
      <DashboardHeader />

      {/* other content */}
      <div className="space-y-4 md:space-y-12">
        <p className="text-xl pt-8 font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong tracking-tight">
          User Dashboard
        </p>

        {/* user dashboard stats */}
        <UserDashboardStats
          totalEnrolledCourses={totalEnrolledCourses}
          totalCompletedCourses={totalCompletedCourses}
          totalOngoingCourses={totalOngoingCourses}
        />

        {/* <--------------------------- Line chart for learning activity -----------> */}
        {/* <LearningActivityLineChart /> */}

        {/* <--------------------------- Sessions -----------------------------------> */}
        {/* <ScheduledSessions /> */}

        {/* <--------------------------- Activity Bar Chart --------------------------> */}
        {/* <BarChartExampleWithCustomTooltip /> */}

        {/* <--------------------------- Enrolled Courses -----------------------------> */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong tracking-tight">
            Enrolled Courses
          </h3>

          {/* <------------------- enrolled courses table -------------------------> */}
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

        {/* <------------------------------ Articles & Learning Goals -------------------------> */}
        <SavedArticlesAndLearningGoals userId={userId} />
      </div>
    </div>
  );
};

export default DashboardPage;

const SavedArticlesAndLearningGoals = ({ userId }: { userId: string }) => {
  // <---------------------------------- Created Articles -------------------------------->
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

  // <--------------------------------- Saved Articles --------------------------------->
  const savedArticles = useZustandStore((state) => state.savedArticles);
  const isSavedArticlesLoading = useZustandStore((state) => state.loading);
  const savedArticlesError = useZustandStore((state) => state.error);

  return (
    <div className="grid grid-cols-3 justify-between gap-6 items-start mb-8 p-4 rounded-md border border-stroke ">
      {/* create articles and saved articles tabs */}
      <div className="space-y-4 col-span-2">
        <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong tracking-tight">
          Articles
        </h3>

        <TabGroup className="space-y-2">
          <TabList variant="line" defaultValue="1" color={"blue"} className="">
            <Tab
              value="1"
              className={cn(
                "flex justify-center items-center rounded-md bg-transparent border border-stroke border-transparent text-blue-500 px-4 py-2 font-medium tracking-tight hover:text-white hover:bg-blue-500 hover:border-transparent active:text-white active:border-transparent active:bg-blue-500"
              )}
            >
              Saved Articles
            </Tab>
            <Tab
              value="2"
              className={cn(
                "flex justify-center items-center rounded-md  bg-transparent border border-stroke border-transparent text-blue-500 px-4 py-2 font-medium tracking-tight hover:text-white hover:bg-blue-500 hover:border-transparent active:text-white active:border-transparent active:bg-blue-500"
              )}
            >
              Created Articles
            </Tab>
          </TabList>

          <TabPanels>
            {/* saved articles */}
            <TabPanel>
              <>
                {isSavedArticlesLoading ? (
                  <SavedArticlesSkeleton />
                ) : savedArticlesError ? (
                  <div>Error fetching enrolled courses</div>
                ) : (
                  <div>
                    {savedArticles?.length > 0 ? (
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
                        You doesn't saved any article, Browse and save one 😁
                        ...
                      </Callout>
                    )}
                  </div>
                )}
              </>
            </TabPanel>

            {/* created articles */}
            <TabPanel>
              <>
                {isCreatedArticlesLoading ? (
                  <CreatedArticlesSkeleton />
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

      {/* learning goals */}
      <div className="h-full w-full cols-span-1">
        <LearningGoals />
      </div>
    </div>
  );
};

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
