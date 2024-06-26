"use client";

import { ArticleCard } from "@/app/(browseArticles)/articles/_components/article-card";
import { Skeleton } from "@/components/ui/skeleton";
import useArticles from "@/hooks/use-articles";
import useGetUserByAuthorId from "@/hooks/use-get-user-by-authorId";
import { AiOutlineComment } from "react-icons/ai";
import { FaHandsClapping, FaShareFromSquare } from "react-icons/fa6";
import { MdMoreHoriz } from "react-icons/md";
// import { Blog } from "@prisma/client";

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

const MoreFromAuthor = ({ authorId }: { authorId: string }) => {
  const authorData = useGetUserByAuthorId(authorId);
  const author = authorData.user;

  const articlesData = useArticles();
  const loading = authorData.isLoading && articlesData.isLoading;

  if (loading) {
    return <div>Loading ...</div>;
  }

  if (loading) {
    return <MoreFromAuthorLoadingSkeleton />;
  }

  if (articlesData.error) {
    return (
      <p className="text-red-600 dark:text-red-500">
        Error: {articlesData.error.message}
      </p>
    );
  }

  const articles = articlesData.articles.filter(
    (article: BlogWithComments) => article.authorId === authorId
  );

  return (
    <div className="space-y-8">
      <p className="text-base text-zinc-800 dark:text-white font-semibold tracking-tight">
        More from{" "}
        <span className="font-bold text-blue-500">
          {author ? author.name : "(Failed to load author name)"}
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

            <div className="flex justify-start items-center">
              <div className="flex justify-center items-center bg-transparent text-xs px-4 py-2 max-w-20 w-full rounded-full bg-blue-500 text-blue-500 border border-blue-500 border-stroke hover:border-transparent hover:text-white transition-all duration-300 cursor-pointer hover:bg-blue-700">
                {" "}
                See All
              </div>
            </div>
          </div>
        ) : (
          <div className="grid my-8 grid-cols-3 gap-8">No Articles yet</div>
        )}
      </div>
    </div>
  );
};

export default MoreFromAuthor;

const MoreFromAuthorLoadingSkeleton = () => {
  return (
    <div className="space-y-8">
      <p className="text-base text-zinc-800 dark:text-white font-semibold tracking-tight">
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
