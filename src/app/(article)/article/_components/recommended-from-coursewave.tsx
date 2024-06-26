"use client";

import { ArticleCard } from "@/app/(browseArticles)/articles/_components/article-card";
import { Skeleton } from "@/components/ui/skeleton";
import useArticles from "@/hooks/use-articles";
import { AiOutlineComment } from "react-icons/ai";
import { FaHandsClapping, FaShareFromSquare } from "react-icons/fa6";
import { MdMoreHoriz } from "react-icons/md";

type BlogComment = {
  id: string;
  blogId: string;
  content: string;
  authorId: string;
  writtenOn: Date | null;
  editedOn: Date | null;
};

type BlogWithComments = {
  id: string;
  title: string;
  shortDescription: string | null;
  content: string;
  estimatedReadingTime: string;
  clapsCount: number;
  authorId: string;
  categoryName: string | null;
  comments: BlogComment[];
  thumbnailUrl: string | null;
  isRecommended: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

const RecommendedFromCoursewave = () => {
  const articlesData = useArticles();

  if (articlesData.isLoading) {
    return <RecommendedFromCoursewaveLoadingSkeleton />;
  }

  if (articlesData.error) {
    return <p className="text-red-600 dark:text-red-500">Error: {articlesData.error.message}</p>;
  }

  console.log('Articles in the recommended from coursewave before filtering: ', articlesData.articles); 

  const articles = articlesData.articles.filter(
    (article: BlogWithComments) => article.isRecommended === true
  );

  return (
    <div className="space-y-8">
      <p className="text-base text-zinc-800 dark:text-white font-semibold tracking-tight">
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
          <div className="grid my-8 grid-cols-3 gap-8">
            No Recommended Articles yet
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedFromCoursewave;

const RecommendedFromCoursewaveLoadingSkeleton = () => {
  return (
    <div className="space-y-8">
      <p className="text-base text-zinc-800 dark:text-white font-semibold tracking-tight">
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
      <Skeleton className="rounded-md h-[210px] w-full" />

      {/* getting started, 10 min read text */}
      <div className="flex justify-start items-center space-x-2">
        <Skeleton className="rounded-md h-4 w-25" />
        <Skeleton className="rounded-md h-4 w-95" />
      </div>

      {/* title */}
      <div className="space-y-2">
        <Skeleton className="rounded-md h-8 w-full" />
        <Skeleton className="rounded-md h-8 w-[90px]" />
      </div>

      {/* description */}
      <div className="space-y-2">
        <Skeleton className="rounded-md h-4 w-full" />
        {/* <Skeleton className="rounded-md h-4 w-full" /> */}
        <Skeleton className="rounded-md h-4 w-[120px]" />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex px-1 space-x-4">
          <div className="flex justify-start items-center space-x-2  hover:text-zinc-900 dark:hover:text-blue-600">
            <FaHandsClapping size={18} />
            <Skeleton className="rounded-md h-4 w-[50px]" />
          </div>

          <div className="flex justify-start items-center space-x-2 hover:text-zinc-900 dark:hover:text-blue-600">
            <AiOutlineComment size={18} />
            <Skeleton className="rounded-md h-4 w-[50px]" />
          </div>
        </div>

        <div className="flex px-1 space-x-4">
          {/* share */}
          <div className="flex justify-start items-center space-x-2 cursor-pointer hover:text-blue-500">
            <FaShareFromSquare size={18} />
          </div>

          {/* more */}
          <div className="flex justify-start items-center space-x-2 cursor-pointer hover:text-blue-500 dark:hover:text-blue-500">
            <MdMoreHoriz size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};
