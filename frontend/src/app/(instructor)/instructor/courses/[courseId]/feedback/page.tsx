"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Star, ArrowLeft } from "lucide-react";
import { useMyReviews, type MyReviewsResponse } from "@/hooks/useInstructor";
import { useUserStore } from "@/zustand/userStore";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  PageContainer,
  PageHeader,
  StatCard,
  EmptyState,
  LoadingPage,
  UnauthorizedState,
  UserAvatar,
} from "@/components/shared";
import { staggerContainer, staggerItem } from "@/lib/config/motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type SortOption = "date-desc" | "date-asc" | "rating-desc" | "rating-asc";

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700"
          }
        />
      ))}
    </div>
  );
}

function RatingDistribution({
  distribution,
  totalReviews,
}: {
  distribution: Record<number, number>;
  totalReviews: number;
}) {
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((stars) => {
        const count = distribution[stars] || 0;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        return (
          <div key={stars} className="flex items-center gap-3">
            <span className="w-8 text-right text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {stars} <Star size={12} className="mb-0.5 inline fill-amber-400 text-amber-400" />
            </span>
            <Progress value={percentage} className="h-2.5 flex-1" />
            <span className="w-8 text-right text-xs text-zinc-500 dark:text-zinc-400">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ReviewCard({
  review,
}: {
  review: MyReviewsResponse["reviews"][number];
}) {
  return (
    <motion.div variants={staggerItem}>
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <UserAvatar
              name={review.user.name}
              imageUrl={review.user.profileImageUrl}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                  {review.user.name}
                </h4>
                <time className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <StarRating rating={review.rating} size={14} />
                <Badge variant="secondary" className="text-xs">
                  {review.course.title}
                </Badge>
              </div>
              {review.comment && (
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function FeedbackPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const { user } = useUserStore();
  const isInstructor = user?.roles?.includes("INSTRUCTOR");

  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const { data, isLoading, error } = useMyReviews();

  React.useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error
          ? `Failed to load reviews: ${error.message}`
          : "Failed to load reviews"
      );
    }
  }, [error]);

  // Derive list of unique courses for the filter dropdown
  const courses = useMemo(() => {
    if (!data?.reviews) return [];
    const map = new Map<string, string>();
    for (const r of data.reviews) {
      map.set(r.course.id, r.course.title);
    }
    return Array.from(map, ([id, title]) => ({ id, title }));
  }, [data?.reviews]);

  // Determine effective filter: if we have a courseId param, prefer it
  const effectiveFilter = courseId !== "all" && courseId ? courseId : courseFilter;

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    if (!data?.reviews) return [];

    let reviews = [...data.reviews];

    // Filter by course
    if (effectiveFilter && effectiveFilter !== "all") {
      reviews = reviews.filter((r) => r.course.id === effectiveFilter);
    }

    // Sort
    switch (sortBy) {
      case "date-desc":
        reviews.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "date-asc":
        reviews.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "rating-desc":
        reviews.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-asc":
        reviews.sort((a, b) => a.rating - b.rating);
        break;
    }

    return reviews;
  }, [data?.reviews, effectiveFilter, sortBy]);

  if (!isInstructor) {
    return (
      <UnauthorizedState description="You need to be an instructor to view course feedback." />
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingPage variant="stats" />
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer>
        <EmptyState
          icon={MessageSquare}
          title="No Reviews Yet"
          description="Your courses haven't received any reviews yet. Reviews will appear here once students leave feedback."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title="Course Feedback"
        description="Reviews and ratings across your courses"
      />

      {/* Overview Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-6 grid gap-4 sm:grid-cols-3"
      >
        <motion.div variants={staggerItem}>
          <StatCard
            label="Total Reviews"
            value={data.totalReviews}
            icon={MessageSquare}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {data.averageRating.toFixed(1)}
                </span>
                <StarRating rating={Math.round(data.averageRating)} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Rating Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RatingDistribution
                distribution={data.ratingDistribution}
                totalReviews={data.totalReviews}
              />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Select
          value={effectiveFilter || "all"}
          onValueChange={(v) => setCourseFilter(v)}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="All courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All courses</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as SortOption)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest first</SelectItem>
            <SelectItem value="date-asc">Oldest first</SelectItem>
            <SelectItem value="rating-desc">Highest rated</SelectItem>
            <SelectItem value="rating-asc">Lowest rated</SelectItem>
          </SelectContent>
        </Select>

        {filteredReviews.length > 0 && (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {filteredReviews.length}{" "}
            {filteredReviews.length === 1 ? "review" : "reviews"}
          </span>
        )}
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={MessageSquare}
            title="No Reviews Found"
            description="No reviews match the current filter. Try selecting a different course."
          />
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mt-6 space-y-3"
        >
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </motion.div>
      )}
    </PageContainer>
  );
}
