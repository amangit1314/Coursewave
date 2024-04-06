"use client";

import React, { Suspense, useEffect } from "react";
import { FaStar } from "react-icons/fa6";

import Reviewcard from "../reviews/review-card";
import { ProgressBar } from "@tremor/react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Review } from "@prisma/client";
import getUserInfoById from "@/helpers/getUserInfoById";

type CourseRatingsProps = {
  courseId: string;
  avgStarRatings: number;
};
export default function CourseRatings({
  courseId,
  avgStarRatings,
}: CourseRatingsProps) {
  const [showAllItems, setShowAllItems] = React.useState(false);

  const toggleItemsVisibility = () => {
    setShowAllItems(!showAllItems);
  };

  return (
    <div className="group md:mt-4 p-6 md:p-0 max-w-7xl w-full items-center justify-start">
      <div className="flex items-center justify-start mb-4 text-xl tracking-tight font-semibold">
        <FaStar className="text-gray-800 dark:text-white" />
        <p className="pl-2 text-gray-800 dark:text-white">
          {avgStarRatings.toFixed(1)} Star Ratings
        </p>
      </div>

      <div className="flex flex-col  justify-start items-start w-full">
        <ReviewAnalysis avgStarRatings={avgStarRatings} courseId={courseId} />

        <div className="max-h-md h-full overflow-y-hidden ">
          <ReviewsMassionaryGrid courseId={courseId} />
        </div>
      </div>
    </div>
  );
}

//* --------------------------------------------------------------
type ReviewsAnalysisProps = {
  avgStarRatings: number;
  courseId: string;
};
const ReviewAnalysis = ({ avgStarRatings, courseId }: ReviewsAnalysisProps) => {
  const [totalReviews, setTotalReviews] = React.useState(0);

  useEffect(() => {
    const getToatalReviewsCount = async () => {
      try {
        const response = await fetch(``);
      } catch (error: any) {}
    };
  }, []);

  return (
    <div className="bg-zinc-800 rounded-xl px-6 pt-4 pb-6 md:py-4 grid grid-cols-1 items-start space-y-4 max-w-md w-full mb-4 mr-4">
      <div>
        <p className="text-white text-xl font-bold">
          <strong className="text-2xl">{avgStarRatings.toFixed(1)}</strong>/5
        </p>
        <p className="text-gray-400 text-sm">Based on {totalReviews} reviews</p>
        <RatingStarsWithoutText courseStarRatings={4.4} />
      </div>

      <div>
        <ul className="space-y-2">
          {[
            { stars: "5 star", percentage: 80 },
            { stars: "4 star", percentage: 19 },
            { stars: "3 star", percentage: 1 },
            { stars: "2 star", percentage: 0 },
            { stars: "1 star", percentage: 0 },
          ].map((rating, index) => {
            return (
              <li
                key={index}
                className="w-auto md:flex justify-start md:space-x-4 md:items-center"
              >
                <p className="text-[14px] text-gray-400">{rating.stars}</p>
                <div className="md:max-w-xs w-full">
                  <ProgressBar value={rating.percentage} color="yellow" />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

//? --------------------------------------------------------------
type ReviewsGridProps = {
  courseId: string;
};
const ReviewsMassionaryGrid = ({ courseId }: ReviewsGridProps) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<String | null>(null);
  const [reviews, setReviews] = React.useState<Review[]>([]);

  console.log("Course id in course ratings: ", courseId);

  useEffect(() => {
    const fetchCourseReviews = async (courseId: string) => {
      try {
        setLoading(true);
        const response = await fetch(
          // https://localhost:3000
          `/api/courses/${courseId}/reviews`
        );

        if (!response.ok) {
          console.log("Failed to fetch course reviews from api ...");
          setError("Failed to fetch course reviews from api ...");
        }

        const data = await response.json();
        console.log("Course reviews: ", JSON.stringify(data));
        setReviews(data.data);
      } catch (error: any) {
        console.log(
          "Failed to fetch course reviews from api, ERROR: ",
          error.message
        );
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseReviews(courseId);
  }, [courseId]);

  // if (loading) {
  //   return (
  //     <ScrollArea className="w-full md:w-[1080px] whitespace-nowrap">
  //       <div className="grid grid-cols-3 w-max space-x-4 pb-4">
  //         <ReviewSkeleton />
  //       </div>

  //       <ScrollBar orientation="horizontal" />
  //     </ScrollArea>
  //   );
  // }

  if (error) {
    return <div>ERROR: ${error}</div>;
  }

  return (
    <Suspense fallback={<ReviewLoadingWidget />}>
      <div>
        {reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
            {reviews.map(async (review: Review) => {
              const user = await getUserInfoById(review.userId);
              return (
                <Reviewcard
                  key={review.id}
                  authorName={user.user?.name ?? "Guest"}
                  date={`Reviewed on ${
                    review.createdAt?.toString().split("T")[0] ?? "5 March 2024"
                  } `}
                  authorImgUrl={
                    user.user?.profileImageUrl ??
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsdFvyaADX8a3uk59a3k94LeX8WRJEqVy6BQ&usqp=CAU"
                  }
                  review={review.comment}
                  starRating={review.rating}
                />
              );
            })}
          </div>
        ) : (
          <div>
            <p>There are no review till now on this course.</p>
          </div>
        )}
      </div>
    </Suspense>
  );
};

//* --------------------------------------------------------------
type RatingStarsWithoutTextProps = {
  courseStarRatings: number;
};
export function RatingStarsWithoutText({
  courseStarRatings,
}: RatingStarsWithoutTextProps) {
  return (
    <div className="flex justify-start items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 me-1 mb-1 ${
            i < Math.floor(courseStarRatings)
              ? "text-yellow-400"
              : "text-gray-300"
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      ))}
    </div>
  );
}

// Reviews Loading WIdget
function ReviewLoadingWidget() {
  return (
    <ScrollArea className="w-full md:w-[1080px] whitespace-nowrap">
      <div className="grid grid-cols-3 w-max space-x-4 pb-4">
        <ReviewSkeleton />
        <ReviewSkeleton />
        <ReviewSkeleton />
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

//? --------------------------------------------------------------
function ReviewSkeleton() {
  return (
    <div className="flex flex-col space-y-3 mb-6">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
