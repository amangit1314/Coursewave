"use client";

import React from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChart } from "@tremor/react";
import { BsCircleFill } from "react-icons/bs";

interface ProjectSubmission {
  id: string;
  projectTitle: string;
  studentName: string;
  submittedAt: string;
  status: "pending" | "reviewed" | "approved";
  rating?: number;
}

interface ProjectsSubmissionsDashboardProps {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalSubmissions: number;
  pendingReviews: number;
  recentSubmissions: ProjectSubmission[];
}

export const ProjectsSubmissionsDashboard: React.FC<
  ProjectsSubmissionsDashboardProps
> = ({
  totalProjects,
  publishedProjects,
  draftProjects,
  totalSubmissions,
  pendingReviews,
  recentSubmissions,
}) => {
  // Mock submission trend data
  const submissionTrendData = [
    { week: "Week 1", submissions: 12 },
    { week: "Week 2", submissions: 18 },
    { week: "Week 3", submissions: 15 },
    { week: "Week 4", submissions: 22 },
    { week: "Week 5", submissions: 28 },
    { week: "Week 6", submissions: 25 },
  ];

  const avgFeedbackTime = "2.3 days";
  const submissionRate = (
    (totalSubmissions / (totalProjects * 50)) *
    100
  ).toFixed(0); // assuming 50 students per project

  return (
    <div className="w-full max-w-6xl space-y-6 mt-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <Badge className="text-xs">Total</Badge>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {totalProjects}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            All projects
          </p>
        </div>

        {/* Published Projects */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Published
            </Badge>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {publishedProjects}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Live projects
          </p>
        </div>

        {/* Total Submissions */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <Badge className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
              {submissionRate}%
            </Badge>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {totalSubmissions}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Total submissions
          </p>
        </div>

        {/* Pending Reviews */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <Badge className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
              Needs Review
            </Badge>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {pendingReviews}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Awaiting feedback
          </p>
        </div>
      </div>

      {/* Submission Trend Chart */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
            Submission Trends
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Weekly submission volume over the last 6 weeks
          </p>
        </div>
        <AreaChart
          className="h-64"
          data={submissionTrendData}
          index="week"
          categories={["submissions"]}
          colors={["purple"]}
          valueFormatter={(value) => `${value} submissions`}
          showAnimation={true}
          showLegend={false}
          showGridLines={true}
          yAxisWidth={40}
          customTooltip={({ payload, label }) =>
            payload && payload.length > 0 ? (
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg p-4 text-zinc-900 dark:text-white min-w-[200px]">
                <div className="font-semibold mb-1">{label}</div>
                <div className="space-y-1">
                  {payload.map((item) => (
                    <div
                      key={item.dataKey}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <BsCircleFill
                          className="w-3 h-3"
                          style={{ color: item.color }}
                        />
                        {item.name}
                      </span>
                      <span>
                        {item.value?.toLocaleString?.() ?? item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          }
        />
      </div>

      {/* Recent Submissions & Performance Metrics */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
                Recent Submissions
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Latest project submissions requiring review
              </p>
            </div>
            {pendingReviews > 0 && (
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {pendingReviews} pending
              </Badge>
            )}
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {submission.projectTitle}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Submitted by {submission.studentName}
                    </p>
                  </div>
                  <Badge
                    className={
                      submission.status === "pending"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        : submission.status === "reviewed"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }
                  >
                    {submission.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </span>
                  {submission.rating && (
                    <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                      ⭐ {submission.rating}/5
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-6">
          {/* Average Feedback Time */}
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-zinc-900">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h4 className="font-semibold text-zinc-800 dark:text-white">
                Avg Feedback Time
              </h4>
            </div>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              {avgFeedbackTime}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Industry average: 3-5 days
            </p>
            <div className="mt-4">
              <Progress value={67} className="h-2" />
            </div>
          </div>

          {/* Project Status Breakdown */}
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <h4 className="font-semibold text-zinc-800 dark:text-white mb-4">
              Project Status
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Published
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {publishedProjects}
                  </span>
                </div>
                <Progress
                  value={(publishedProjects / totalProjects) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Draft
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {draftProjects}
                  </span>
                </div>
                <Progress
                  value={(draftProjects / totalProjects) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <button className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
            Review Pending Submissions
          </button>
        </div>
      </div>
    </div>
  );
};
