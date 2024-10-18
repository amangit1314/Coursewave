"use client";

import React from "react";
import { FaStar } from "react-icons/fa6";
import Reviewcard from "../reviews/review-card";
import { Callout, ProgressBar } from "@tremor/react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Review } from "@prisma/client";
import getUserInfoById from "@/helpers/get_user_info_by_id";
import { absoluteUrl } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";

export const CourseRatings = ({
  // courseId,
  reviews,
}: {
  // courseId: string;
  reviews: Review[];
  avgStarRatings?: number;
}) => {
  // Ensure reviews exist and have valid ratings

  // Calculate average star rating
  const avgStarRatings =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="group w-full max-w-7xl items-center justify-start p-6 md:mt-4 md:p-0">
      <div className="mb-4 flex items-center justify-start text-xl font-semibold tracking-tight">
        <FaStar className="text-gray-800 dark:text-white" />
        <p className="pl-2 text-gray-800 dark:text-white">
          {avgStarRatings.toFixed(1)} Star Ratings
        </p>
      </div>

      <div className="flex w-full flex-col items-start justify-start">
        <ReviewAnalysis reviews={reviews} avgStarRatings={avgStarRatings} />

        <div className="max-h-md h-full overflow-y-hidden">
          <ReviewsMassionaryGrid reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

//* <--------------------------------- Components ------------------------------------->

const ReviewAnalysis = ({
  reviews,
  avgStarRatings,
}: {
  reviews: Review[];
  avgStarRatings: number;
}) => {
  const totalReviews = reviews.length;

  // Ensure reviews exist and have valid ratings
  const roundedRatings = Array.isArray(reviews)
    ? reviews.map((review) => {
        if (typeof review.rating !== "number") {
          return 0; // Default to 0 if rating is not a number
        }
        if (review.rating >= 4.5) return 5;
        if (review.rating >= 3.5) return 4;
        if (review.rating >= 2.5) return 3;
        if (review.rating >= 1.5) return 2;
        return 1;
      })
    : [];

  // Ensure roundedRatings is an array before calling filter
  const starRatingsCount = {
    5: roundedRatings.filter((rating) => rating === 5).length,
    4: roundedRatings.filter((rating) => rating === 4).length,
    3: roundedRatings.filter((rating) => rating === 3).length,
    2: roundedRatings.filter((rating) => rating === 2).length,
    1: roundedRatings.filter((rating) => rating === 1).length,
  };

  const starRatingsPercentage = {
    5: (starRatingsCount[5] / totalReviews) * 100 || 0,
    4: (starRatingsCount[4] / totalReviews) * 100 || 0,
    3: (starRatingsCount[3] / totalReviews) * 100 || 0,
    2: (starRatingsCount[2] / totalReviews) * 100 || 0,
    1: (starRatingsCount[1] / totalReviews) * 100 || 0,
  };

  return (
    <div className="mb-4 mr-4 grid w-full max-w-md grid-cols-1 items-start space-y-4 rounded-3xl bg-zinc-800 p-6 md:p-8">
      <div>
        <p className="text-xl font-bold text-white">
          <strong className="text-2xl">{avgStarRatings.toFixed(1)}</strong>/5.0
        </p>
        <p className="text-sm text-gray-400">Based on {totalReviews} reviews</p>
        <RatingStarsWithoutText
          courseStarRatings={parseFloat(avgStarRatings.toFixed(1))}
        />
      </div>

      <div>
        <ul className="w-full max-w-md space-y-2">
          {[
            { stars: "5 star", percentage: starRatingsPercentage[5] },
            { stars: "4 star", percentage: starRatingsPercentage[4] },
            { stars: "3 star", percentage: starRatingsPercentage[3] },
            { stars: "2 star", percentage: starRatingsPercentage[2] },
            { stars: "1 star", percentage: starRatingsPercentage[1] },
          ].map((rating, index) => (
            <li
              key={index}
              className="flex w-full flex-col space-y-1 md:flex-row md:items-center md:justify-start md:space-x-4 md:space-y-0"
            >
              <p className="text-[14px] text-gray-400">{rating.stars}</p>
              <div className="w-full md:max-w-xs">
                <ProgressBar value={rating.percentage} color="yellow" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ReviewsMassionaryGrid = ({ reviews }: { reviews: Review[] }) => {
  const [showAllItems, setShowAllItems] = React.useState(false);

  const toggleItemsVisibility = () => {
    setShowAllItems(!showAllItems);
  };

  return (
    <div>
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

          <div
            onClick={toggleItemsVisibility}
            className="cursor-pointer text-xs text-blue-500 transition-all duration-200 hover:text-blue-700"
          >
            {showAllItems ? "Show less" : "Show all"}
          </div>
        </div>
      ) : (
        <div>
          <p>There are no review till now on this course.</p>
        </div>
      )}
    </div>
  );
};

export const RatingStarsWithoutText = ({
  courseStarRatings,
}: {
  courseStarRatings: number;
}) => {
  const getStarPath = (fraction: number) => {
    if (fraction === 1) {
      return "M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z";
    } else if (fraction >= 0.75) {
      return "M20.724 7.548a1.523 1.523 0 0 0-1.236-1.041L12.62 6.6l-2.239-4.551a1.533 1.533 0 0 0-2.742 0L5.32 6.6 1.514 6.507A1.53 1.53 0 0 0 .273 7.548l3.61 3.518-.852 4.964a1.53 1.53 0 0 0 2.19 1.596l4.437-2.335 4.437 2.335a1.53 1.53 0 0 0 2.19-1.596l-.852-4.964 3.61-3.518Z"; // 3/4 star
    } else if (fraction >= 0.5) {
      return "M19.237 6.855a1.525 1.525 0 0 0-1.037-.92l-5.019-.73-2.241-4.542a1.531 1.531 0 0 0-2.714 0l-2.241 4.542-5.019.73a1.524 1.524 0 0 0-.86 2.59l3.63 3.506-.848 4.94a1.525 1.525 0 0 0 2.172 1.593L11 15.97l4.467 2.349a1.525 1.525 0 0 0 2.172-1.593l-.848-4.94 3.63-3.506a1.524 1.524 0 0 0-.184-2.59Z"; // 1/2 star
    } else if (fraction >= 0.25) {
      return "M17.453 5.906a1.517 1.517 0 0 0-1.015-.878l-5.011-.728-2.238-4.537a1.534 1.534 0 0 0-2.706 0L4.256 4.3l-5.011.728a1.515 1.515 0 0 0-.838 2.575L3.038 11.12l-.842 4.927a1.521 1.521 0 0 0 2.145 1.583L11 15.543l4.659 2.587a1.521 1.521 0 0 0 2.145-1.583l-.842-4.927 4.641-4.537a1.515 1.515 0 0 0-.19-2.575Z"; // 1/4 star
    } else {
      return "M16.245 5.498a1.504 1.504 0 0 0-1.19-.662l-5.008-.73L7.805.067a1.53 1.53 0 0 0-2.707 0L3.199 4.106l-5.008.73a1.505 1.505 0 0 0-.832 2.548L2.641 11.22l-.846 4.952a1.506 1.506 0 0 0 2.161 1.566L11 14.774l4.667 2.964a1.506 1.506 0 0 0 2.161-1.566l-.846-4.952 4.281-4.836a1.505 1.505 0 0 0-.018-2.548Z"; // empty star
    }
  };

  const starPaths = [];
  for (let i = 0; i < 5; i++) {
    const rating = courseStarRatings - i;
    const fraction = rating >= 1 ? 1 : rating > 0 ? rating : 0;
    starPaths.push(getStarPath(fraction));
  }

  return (
    <div className="flex items-center justify-start">
      {starPaths.map((path, i) => (
        <svg
          key={i}
          className={`mb-1 me-1 h-4 w-4 ${
            path !== getStarPath(0) ? "text-yellow-400" : "text-gray-300"
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d={path} />
        </svg>
      ))}
    </div>
  );
};

//? <------------------------------- Skeletons ----------------------------------------->
const ReviewsLoadingSkeleton = () => {
  return (
    <ScrollArea className="w-full whitespace-nowrap md:w-[1080px]">
      <div className="grid w-full grid-cols-3 gap-x-4 pb-4">
        <ReviewItemLoadingSkeleton />
        <ReviewItemLoadingSkeleton />
        <ReviewItemLoadingSkeleton />
        <ReviewItemLoadingSkeleton />
        <ReviewItemLoadingSkeleton />
      </div>
    </ScrollArea>
  );
};

const ReviewItemLoadingSkeleton = () => {
  return (
    <div className="mb-6 flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[130px]" />
      </div>
    </div>
  );
};
