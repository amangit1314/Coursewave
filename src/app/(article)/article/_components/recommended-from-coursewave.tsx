"use client";

import { ArticleCard } from "@/app/(browseArticles)/articles/_components/article-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticles } from "@/hooks/useArticles";
import { BlogWithComments } from "@/types/blog-with-comments";
import { Callout } from "@tremor/react";
import { AiOutlineComment } from "react-icons/ai";
import { FaHandsClapping, FaShareFromSquare } from "react-icons/fa6";
import { MdMoreHoriz } from "react-icons/md";

const RecommendedFromCoursewave = () => {
  const articlesData = useArticles();

  if (articlesData.isLoading) {
    return <RecommendedFromCoursewaveLoadingSkeleton />;
  }

  if (articlesData.error) {
    return (
      <div className="w-7xl mx-auto flex items-center justify-center align-middle">
        <Callout
          className=""
          title="Failed to Fetch Author Info 🚨❌"
          color="red"
        >
          <span>ERROR: {articlesData.error.message} 🚨❌ ...</span>
        </Callout>
      </div>
    );
  }

  console.log(
    "Articles in the recommended from coursewave before filtering: ",
    articlesData.articles,
  );

  const articles = articlesData.articles.filter(
    (article: BlogWithComments) => article.isRecommended === true,
  );

  return (
    <div className="space-y-8">
      <p className="text-base font-semibold tracking-tight text-zinc-800 dark:text-white">
        Recommended from{" "}
        <span className="font-bold text-blue-500">CourseWave</span>
      </p>

      <div>
        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-2 gap-8">
            {articles.map((article: BlogWithComments) => {
              return (
                <div key={article.id}>
                  <ArticleCard article={article} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="my-8 grid grid-cols-3 gap-8">
            No Recommended Articles yet
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedFromCoursewave;

/// --------------------------------- SKELETONS ----------------------------------
const RecommendedFromCoursewaveLoadingSkeleton = () => {
  return (
    <div className="space-y-8">
      <p className="text-base font-semibold tracking-tight text-zinc-800 dark:text-white">
        Recommended from{" "}
        <span className="font-bold text-blue-500">CourseWave</span>
      </p>

      <div className="grid grid-cols-2 gap-8">
        <RecommendedFromCoursewaveLoadingSkeletonItem />
        <RecommendedFromCoursewaveLoadingSkeletonItem />
        <RecommendedFromCoursewaveLoadingSkeletonItem />
        <RecommendedFromCoursewaveLoadingSkeletonItem />
        {/* <RecommendedFromCoursewaveLoadingSkeletonItem />
        <RecommendedFromCoursewaveLoadingSkeletonItem />
        <RecommendedFromCoursewaveLoadingSkeletonItem />
        <RecommendedFromCoursewaveLoadingSkeletonItem />
        <RecommendedFromCoursewaveLoadingSkeletonItem /> */}
      </div>
    </div>
  );
};

const RecommendedFromCoursewaveLoadingSkeletonItem = () => {
  return (
    <div className="space-y-4">
      {/* image */}
      <Skeleton className="h-[210px] w-full rounded-md" />

      {/* getting started, 10 min read text */}
      <div className="flex items-center justify-start space-x-2">
        <Skeleton className="w-25 h-4 rounded-md" />
        <Skeleton className="w-95 h-4 rounded-md" />
      </div>

      {/* title */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-8 w-[90px] rounded-md" />
      </div>

      {/* description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-md" />
        {/* <Skeleton className="rounded-md h-4 w-full" /> */}
        <Skeleton className="h-4 w-[120px] rounded-md" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-4 px-1">
          <div className="flex items-center justify-start space-x-2 hover:text-zinc-900 dark:hover:text-blue-600">
            <FaHandsClapping size={18} />
            <Skeleton className="h-4 w-[50px] rounded-md" />
          </div>

          <div className="flex items-center justify-start space-x-2 hover:text-zinc-900 dark:hover:text-blue-600">
            <AiOutlineComment size={18} />
            <Skeleton className="h-4 w-[50px] rounded-md" />
          </div>
        </div>

        <div className="flex space-x-4 px-1">
          {/* share */}
          <div className="flex cursor-pointer items-center justify-start space-x-2 hover:text-blue-500">
            <FaShareFromSquare size={18} />
          </div>

          {/* more */}
          <div className="flex cursor-pointer items-center justify-start space-x-2 hover:text-blue-500 dark:hover:text-blue-500">
            <MdMoreHoriz size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};
