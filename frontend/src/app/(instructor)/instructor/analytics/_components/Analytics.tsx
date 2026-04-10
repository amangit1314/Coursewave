"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import AnalyticsStatsSelect from "./AnalyticsStatsSelect";
import { BestSellingCourses } from "./BestSellingCourses";
import { EarningReportAreaChart, EarningChartData } from "./EarningReportChart";
import { LineChartForStudents } from "./LineChatForStudents";
import { TotalRevenueCard } from "./TotalRevenueCard";
import { Course } from "@/types/course";
import { useMemo } from "react";
import { sampleCourses } from "@/lib/mock/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoursePerformanceDetails } from "./CourseMetrics";
import { ReviewsRatingsDashboard } from "./ReviewsRatingsDashboard";
import { StudentEngagementDashboard } from "./StudentEngagementProps";
import { StudentDemographicsChart } from "./StudentDemographicsChart";
import { RevenueBreakdownChart } from "./RevenueBreakdownChart";
import { ProjectsSubmissionsDashboard } from "./ProjectSubmissionsDashboard";
import { BlogAnalyticsComponent } from "./BlogAnalyticsComponent";
import { CartAbandonmentFunnel } from "./CartAbandonmentConversion";
import { WishlistPurchaseConversion } from "./WihslistPurchaseConversion";
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
    { label: "Conversion", value: "conversion" },
  ];

  const [selectedTab, setSelectedTab] = React.useState("overview");

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Comprehensive insights into your teaching performance
        </p>
      </div>

      {/* Overview Stats - Always Visible */}
      <AnalyticsStats
        totalEarning={totalEarning}
        totalStudents={totalStudents}
        totalCourses={totalCourses}
        totalEnrollments={9}
        averageRating={3.9}
        totalReviews={90}
        pendingSubmissions={90}
        totalBlogs={2}
        activeStudents={2}
        earningsTrend={23}
        studentsTrend={34}
        coursesTrend={89}
      />

      {/* Tabbed Analytics Sections */}
      <Tabs
        defaultValue="overview"
        className="space-y-8"
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList className="grid w-full grid-cols-5 gap-1.5 bg-muted/50 rounded-xl p-1.5">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              className={cn(
                "rounded-lg py-2 px-4 text-sm font-medium transition-all duration-200",
                selectedTab === tab.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="overflow-x-hidden flex space-x-5 h-auto justify-center">
            {/* first column */}
            <div className="space-y-8 flex-1">
              {/* <div className="space-y-3">
                <div className="flex items-center justify-start md:flex-row md:justify-between">
                  <div className="text-lg font-semibold tracking-tight text-foreground">
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
                <div className="text-lg font-semibold tracking-tight text-foreground">
                  Earning Report
                </div>
                <EarningReportAreaChart data={earningChartData} />
              </div>

              {/* <div className="space-y-3">
                <div className="text-lg font-semibold tracking-tight text-foreground">
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
                <BestSellingCourses courses={createdCourses ?? sampleCourses} />
              </div>
            </div>
          </div>

          <CoursePerformanceDetails courses={createdCourses ?? []} />
          <ReviewsRatingsDashboard
            averageRating={1}
            totalReviews={2}
            ratingDistribution={{ 5: 1, 4: 0, 3: 0, 2: 1, 1: 0 }}
            recentReviews={[
              {
                id: "",
                studentName: "",
                courseName: "",
                rating: 4,
                comment: "sample comment",
                createdAt: "08-11-2025",
              },
            ]}
            ratingTrend={2}
          />
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-8">
          <StudentEngagementDashboard
            totalStudents={23}
            activeStudents={1}
            completedStudents={4}
            droppedStudents={1}
          />
          <StudentDemographicsChart
            totalStudents={2}
            geographicData={[
              {
                country: "",
                countryCode: "",
                students: 1,
                revenue: 2,
                growth: 3,
              },
            ]}
            studentSegments={[
              {
                segment: "",
                count: 2,
                percentage: 39,
              },
            ]}
            enrollmentTiming={[
              {
                timeRange: "",
                enrollments: 3,
              },
            ]}
            topCountries={[
              {
                country: "",
                countryCode: "",
                students: 1,
                revenue: 2,
                growth: 3,
              },
            ]}
            newStudentsThisMonth={3}
            returningStudents={4}
          />
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-8">
          <RevenueBreakdownChart
            totalRevenue={1}
            revenueTrend={2}
            revenueByPaymentMethod={[
              {
                method: "",
                amount: 1,
                count: 2,
              },
            ]}
            revenueByMonth={[
              {
                month: "",
                revenue: 1,
                transactions: 2,
              },
            ]}
            revenueByCourse={[
              {
                courseId: "",
                courseName: "",
                revenue: 234,
                enrollments: 10,
                price: 23.4,
              },
            ]}
            averageTransactionValue={3}
            totalTransactions={4}
          />
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-8">
          <ProjectsSubmissionsDashboard
            totalProjects={2}
            publishedProjects={3}
            draftProjects={4}
            totalSubmissions={5}
            pendingReviews={6}
            recentSubmissions={[
              {
                id: "",
                projectTitle: "",
                studentName: "",
                submittedAt: "",
                status: "pending",
                rating: 2,
              },
            ]}
          />
          <BlogAnalyticsComponent
            totalBlogs={2}
            publishedBlogs={4}
            draftBlogs={3}
            totalViews={2}
            totalLikes={1}
            totalComments={2}
            totalSaved={4}
            blogs={[
              {
                id: "",
                title: "",
                slug: "",
                views: 2,
                likes: 3,
                comments: 2,
                saved: 6,
                shares: 9,
                readTime: 2,
                publishedAt: "234",
                isPublished: true,
              },
            ]}
            viewsTrend={3}
          />
        </TabsContent>

        {/* Conversion Tab */}
        <TabsContent value="conversion" className="space-y-8">
          <CartAbandonmentFunnel
            totalViews={23}
            cartAdditions={24}
            checkoutInitiated={12}
            purchasesCompleted={36}
            abandonmentRate={56}
            averageCartValue={63}
            potentialRevenueLost={45}
            abandonmentReasons={[
              {
                reason: "",
                count: 3,
                percentage: 34,
              },
            ]}
            timeToConversion={[{ timeRange: "", conversions: 70 }]}
            conversionTrend={34}
          />
          <WishlistPurchaseConversion
            totalWishlistAdds={1}
            totalConversions={1}
            overallConversionRate={1}
            averageTimeToConvert={1}
            potentialRevenue={1}
            wishlistCourses={[
              {
                courseId: "",
                courseName: "",
                wishlistAdds: 2,
                purchases: 3,
                conversionRate: 4,
                averageDaysToConvert: 5,
                price: 234,
              },
            ]}
            wishlistTrends={[
              {
                month: "",
                additions: 1,
                conversions: 2,
                conversionRate: 3,
              },
            ]}
            activeWishlists={1}
            conversionTrend={1}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
