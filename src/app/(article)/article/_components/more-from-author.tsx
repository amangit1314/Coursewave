"use client";

import { ArticleCard } from "@/app/(browseArticles)/articles/_components/article-card";
import { Skeleton } from "@/components/ui/skeleton";
// import {useArticles} from "@/hooks/use-articles";
// import {useGetUserByAuthorId} from "@/hooks/use-get-user-by-authorId";
import { BlogWithComments } from "@/types/blog-with-comments";
import { useUserStore } from "@/zustand/userStore";
import { Callout } from "@tremor/react";
import React from "react";
import { AiOutlineComment } from "react-icons/ai";
import { FaHandsClapping, FaShareFromSquare } from "react-icons/fa6";
import { MdMoreHoriz } from "react-icons/md";

const MoreFromAuthor = ({ authorId }: { authorId: string }) => {
  // const authorData = useGetUserByAuthorId(authorId);
  // const author = authorData.user;

  const { createdArticles, fetchCreatedArticles, loadingState, user } =
    useUserStore();

  React.useEffect(() => {
    fetchCreatedArticles(authorId);
  }, [fetchCreatedArticles, authorId]);

  // const articlesData = useArticles();
  // const loading = authorData.isLoading && articlesData.isLoading;

  // if (loading) {
  //   return <div>Loading ...</div>;
  // }

  if (loadingState.loading) {
    return <MoreFromAuthorLoadingSkeleton />;
  }

  if (loadingState.error) {
    // return (
    //   <p className="text-red-600 dark:text-red-500">
    //      {/* Error: {articlesData.error.message} */}
    //      Error: {error}
    //   </p>
    // );
    return (
      <div className="w-7xl mx-auto flex items-center justify-center align-middle">
        <Callout
          className=""
          title="Failed to fetch more articles from Author in more-from-author.tsx 🚨❌"
          color="red"
        >
          <span>{loadingState.error} 🚨❌ ...</span>
        </Callout>
      </div>
    );
  }

  // const articles = articlesData.articles.filter(
  //   (article: BlogWithComments) => article.authorId === authorId,
  // );

  const articles = createdArticles.filter(
    (article: BlogWithComments) => article.authorId === authorId,
  );

  return (
    <div className="space-y-8">
      <p className="text-base font-semibold tracking-tight text-zinc-800 dark:text-white">
        More from{" "}
        <span className="font-bold text-blue-500">
          {user ? user.name : "(Failed to load author name)"}
        </span>
      </p>

      <div>
        {articles && articles.length ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-8">
              {articles.map((article: BlogWithComments) => {
                return (
                  <div key={article.id}>
                    <ArticleCard article={article} />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-start">
              <div className="border-stroke flex w-full max-w-20 cursor-pointer items-center justify-center rounded-full border border-blue-500 bg-blue-500 bg-transparent px-4 py-2 text-xs text-blue-500 transition-all duration-300 hover:border-transparent hover:bg-blue-700 hover:text-white">
                {" "}
                See All
              </div>
            </div>
          </div>
        ) : (
          <div className="my-8 grid grid-cols-3 gap-8">No Articles yet</div>
        )}
      </div>
    </div>
  );
};

export default MoreFromAuthor;

/// --------------------------------- SKELETONS ----------------------------------
const MoreFromAuthorLoadingSkeleton = () => {
  return (
    <div className="space-y-8">
      <p className="text-base font-semibold tracking-tight text-zinc-800 dark:text-white">
        Recommended from{" "}
        <span className="font-bold text-blue-500">CourseWave</span>
      </p>

      <div className="grid grid-cols-2 gap-8">
        <MoreFromAuthorLoadingSkeletonItem />
        <MoreFromAuthorLoadingSkeletonItem />
        <MoreFromAuthorLoadingSkeletonItem />
        <MoreFromAuthorLoadingSkeleton />
        {/* <MoreFromAuthorLoadingSkeletonItem />
        <MoreFromAuthorLoadingSkeletonItem />
        <MoreFromAuthorLoadingSkeletonItem />
        <MoreFromAuthorLoadingSkeletonItem />
        <MoreFromAuthorLoadingSkeletonItem /> */}
      </div>
    </div>
  );
};

const MoreFromAuthorLoadingSkeletonItem = () => {
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
