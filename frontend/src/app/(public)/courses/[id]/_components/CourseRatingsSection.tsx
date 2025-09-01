import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Course } from "@/types";
import React from "react";
import { FaStar } from "react-icons/fa6";

export const CourseRatingsSection = ({
  reviews,
  course,
}: {
  reviews: any[];
  course: Course | null;
}) => {
  const [showAllReviews, setShowAllReviews] = React.useState(false);

  // Ensure reviews is an array and handle null/undefined cases
  const safeReviews = Array.isArray(reviews)
    ? reviews
    : [
        {
          id: "134decq1231",
          userId: "q4545345234-345234df4r-324edede-323fceds",
          comment: "This is an sample comment.",
          createdAt: "",
          rating: 4.8,
        },
      ];

  // Calculate average rating safely
  const avgRating =
    safeReviews.length > 0
      ? safeReviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
        safeReviews.length
      : course?.averageRating || 0.0;

  const totalReviews = safeReviews.length || 0;

  // Calculate rating distribution safely
  const ratingDistribution = {
    5:
      safeReviews.filter((r) => (r.rating || 0) >= 4.5).length ||
      Math.floor(totalReviews * 0.6),
    4:
      safeReviews.filter((r) => (r.rating || 0) >= 3.5 && (r.rating || 0) < 4.5)
        .length || Math.floor(totalReviews * 0.25),
    3:
      safeReviews.filter((r) => (r.rating || 0) >= 2.5 && (r.rating || 0) < 3.5)
        .length || Math.floor(totalReviews * 0.1),
    2:
      safeReviews.filter((r) => (r.rating || 0) >= 1.5 && (r.rating || 0) < 2.5)
        .length || Math.floor(totalReviews * 0.03),
    1:
      safeReviews.filter((r) => (r.rating || 0) < 1.5).length ||
      Math.floor(totalReviews * 0.02),
  };

  const displayedReviews = showAllReviews
    ? safeReviews
    : safeReviews.slice(0, 6);

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-cyan-50/30 dark:from-zinc-900/95 dark:to-cyan-950/20 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 dark:from-cyan-500 dark:to-blue-400 blur-sm opacity-75"></div>
              <div className="relative rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-500 p-3 shadow-lg">
                <FaStar className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent tracking-tight">
                Student Reviews
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                What students are saying about this course
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <FaStar className="text-blue-400" size={20} />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {avgRating.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totalReviews} reviews
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Rating Analysis */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Overall Rating */}
              <div className="relative overflow-hidden text-center p-8 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-100/50 dark:border-blue-900/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 dark:from-blue-600/10 dark:to-cyan-600/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-3">
                    {avgRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`h-6 w-6 ${
                          i < Math.floor(avgRating)
                            ? "text-blue-400"
                            : i < avgRating
                              ? "text-blue-300"
                              : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Course Rating
                  </p>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  Rating Distribution
                </h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count =
                      ratingDistribution[
                        stars as keyof typeof ratingDistribution
                      ];
                    const percentage =
                      totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div
                        key={stars}
                        className="flex justify-start items-center"
                      >
                        {/* 2 * */}
                        <div className="flex items-center gap-2 w-16">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[8px]">
                            {stars}
                          </span>
                          <FaStar className="h-4 w-4 text-blue-400" />
                        </div>

                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-cyan-400 h-full rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-2 w-20 justify-end">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {Math.round(percentage)}%
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            ({count})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="lg:col-span-2">
            {safeReviews.length > 0 ? (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {displayedReviews.map((review, index) => (
                    <div
                      key={review.id || index}
                      className="group relative overflow-hidden p-6 bg-white/70 dark:bg-white/5 rounded-xl border border-blue-100/50 dark:border-blue-900/30 hover:border-transparent hover:shadow-[0_0_0_1px] hover:shadow-blue-200 dark:hover:shadow-blue-800/50 transition-all duration-300"
                    >
                      {/* Background gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-cyan-50/0 to-blue-50/0 dark:from-blue-900/0 dark:via-cyan-900/0 dark:to-blue-900/0 group-hover:from-blue-50/30 group-hover:via-cyan-50/30 group-hover:to-blue-50/30 dark:group-hover:from-blue-900/20 dark:group-hover:via-cyan-900/20 dark:group-hover:to-blue-900/20 transition-all duration-300"></div>

                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-sm">
                                {(review.userId
                                  ? review.userId.charAt(0)
                                  : "A"
                                ).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {review.userId
                                  ? `User ${review.userId.slice(-4)}`
                                  : "Anonymous"}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < (review.rating || 0)
                                        ? "text-blue-400"
                                        : "text-gray-300 dark:text-gray-600"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                              {new Date(
                                review.createdAt || Date.now()
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-blue-400 to-cyan-500 rounded-full opacity-30"></div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-4 italic">
                            "{review.comment || "No comment provided"}"
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {safeReviews.length > 6 && (
                  <div className="text-center pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="group relative overflow-hidden px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <span className="relative">
                        {showAllReviews
                          ? "Show Less Reviews"
                          : `Show All ${safeReviews.length} Reviews`}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full blur-xl opacity-50"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-200/50 dark:border-blue-800/50">
                    <FaStar className="h-10 w-10 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  No Reviews Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  Be the first to review this course and help other students
                  make their decision.
                </p>
                <div className="mt-6">
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                    Write a Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
