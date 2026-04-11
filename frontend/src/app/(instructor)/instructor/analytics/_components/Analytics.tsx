"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import AnalyticsStatsSelect from "./AnalyticsStatsSelect";
import { BestSellingCourses } from "./BestSellingCourses";
import { EarningReportAreaChart, EarningChartData } from "./EarningReportChart";
import { LineChartForStudents } from "./LineChatForStudents";
import { TotalRevenueCard } from "./TotalRevenueCard";
import { Course } from "@/types/course";
import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoursePerformanceDetails } from "./CourseMetrics";
import { ReviewsRatingsDashboard } from "./ReviewsRatingsDashboard";
import { StudentEngagementDashboard } from "./StudentEngagementProps";
import { StudentDemographicsChart } from "./StudentDemographicsChart";
import { RevenueBreakdownChart } from "./RevenueBreakdownChart";
import { ProjectsSubmissionsDashboard } from "./ProjectSubmissionsDashboard";
import { BlogAnalyticsComponent } from "./BlogAnalyticsComponent";
import AnalyticsStats from "./AnalyticsStats";
import { cn } from "@/lib/utils/utils";
import React from "react";

type AnalyticsProps = {
  totalEarning: string;
  totalStudents: number;
  totalCourses: number;
  createdCourses?: Course[];
};

const Analytics = ({
  totalEarning,
  totalStudents,
  totalCourses,
  createdCourses,
}: AnalyticsProps) => {
  const earningChartData = useMemo((): EarningChartData[] => {
    if (!createdCourses) return [];

    const monthlyEarnings: { [key: string]: number } = {};

    createdCourses.forEach((course) => {
      const month = new Date(course.createdAt).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (!monthlyEarnings[month]) {
        monthlyEarnings[month] = 0;
      }
      monthlyEarnings[month] += parseFloat(course.price.toString()) || 0;
    });

    return Object.entries(monthlyEarnings)
      .map(([date, earnings]) => ({
        date,
        Courses: earnings,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [createdCourses]);

  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Students", value: "students" },
    { label: "Revenue", value: "revenue" },
    { label: "Content", value: "content" },
  ];

  const [selectedTab, setSelectedTab] = React.useState("overview");

  return (
    <div className="container mx-auto  py-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Comprehensive insights into your teaching performance
        </p>
      </div>

      {/* Overview Stats - Always Visible */}
      <AnalyticsStats
        totalEarning={totalEarning}
        totalStudents={totalStudents}
        totalCourses={totalCourses}
      />

      {/* Tabbed Analytics Sections */}
      <Tabs
        defaultValue="overview"
        className="space-y-8"
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList className="grid w-full grid-cols-4 gap-2 bg-gray-50 dark:bg-zinc-900 rounded-lg overflow-hidden pb-10">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              className={cn(
                "relative py-2 px-4 font-medium text-sm transition-all duration-200 focus:outline-none z-10",
                selectedTab === tab.value
                  ? `
                bg-gradient-to-tr from-blue-600 to-cyan-500 text-white
                shadow-lg
                font-bold
                rounded-full
                -translate-y-1
                ring-2 ring-blue-500/70
                border-0
                scale-105
              `
                  : `
                text-gray-600 dark:text-gray-300 
                bg-transparent
                hover:bg-blue-50 dark:hover:bg-zinc-800
                opacity-85
                rounded-full
              `
              )}
              style={
                selectedTab === tab.value
                  ? { boxShadow: "0 6px 18px -6px #3b82f6cc" }
                  : undefined
              }
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="overflow-x-hidden flex space-x-5 h-auto justify-center dark:bg-zinc-900">
            {/* first column */}
            <div className="space-y-8 flex-1">
              {/* <div className="space-y-3">
                <div className="flex items-center justify-start md:flex-row md:justify-between">
                  <div className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-white">
                    Analytics Stats
                  </div>
                  <AnalyticsStatsSelect />
                </div>
                <ScrollArea>
                  <div className="min-w-[600px]">
                    
                  </div>
                </ScrollArea>
              </div> */}

              <div className="space-y-3">
                <div className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-white">
                  Earning Report
                </div>
                <EarningReportAreaChart data={earningChartData} />
              </div>

              {/* <div className="space-y-3">
                <div className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-white">
                  Students
                </div>
                <LineChartForStudents courses={createdCourses ?? []} />
              </div> */}
            </div>

            {/* second column */}
            <div className="mr-8 w-[22rem]">
              <TotalRevenueCard
                totalEarning={totalEarning}
                courses={createdCourses ?? []}
              />
              <div className="space-y-3 mt-8">
                <BestSellingCourses courses={createdCourses ?? []} />
              </div>
            </div>
          </div>

          <CoursePerformanceDetails courses={createdCourses ?? []} />
          <ReviewsRatingsDashboard
            averageRating={0}
            totalReviews={0}
            ratingDistribution={{ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }}
            recentReviews={[]}
            ratingTrend={0}
          />
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-8">
          <StudentEngagementDashboard
            totalStudents={totalStudents}
            activeStudents={0}
            completedStudents={0}
            droppedStudents={0}
          />
          <StudentDemographicsChart
            totalStudents={totalStudents}
            geographicData={[]}
            studentSegments={[]}
            enrollmentTiming={[]}
            topCountries={[]}
            newStudentsThisMonth={0}
            returningStudents={0}
          />
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-8">
          <RevenueBreakdownChart
            totalRevenue={parseFloat(totalEarning) || 0}
            revenueTrend={0}
            revenueByPaymentMethod={[]}
            revenueByMonth={[]}
            revenueByCourse={[]}
            averageTransactionValue={0}
            totalTransactions={0}
          />
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-8">
          <ProjectsSubmissionsDashboard
            totalProjects={0}
            publishedProjects={0}
            draftProjects={0}
            totalSubmissions={0}
            pendingReviews={0}
            recentSubmissions={[]}
          />
          <BlogAnalyticsComponent
            totalBlogs={0}
            publishedBlogs={0}
            draftBlogs={0}
            totalViews={0}
            totalLikes={0}
            totalComments={0}
            totalSaved={0}
            blogs={[]}
            viewsTrend={0}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Analytics;
