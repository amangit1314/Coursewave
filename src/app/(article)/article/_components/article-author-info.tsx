"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import useGetUserByAuthorId from "@/hooks/use-get-user-by-authorId";
import { Skeleton } from "@/components/ui/skeleton";

type ArticleAuthorInfoProps = {
  authorId: string;
  estimatedReadingTime: string;
  articleCreatedAtDate: string;
};

const ArticleAuthorInfo = ({
  authorId,
  estimatedReadingTime,
  articleCreatedAtDate,
}: ArticleAuthorInfoProps) => {
  const authorData = useGetUserByAuthorId(authorId);
  const author = authorData.user;

  if (authorData.isLoading) {
    return <ArticleAuthorInfoLoadingSkeleton />;
  }

  if (authorData.error) {
    return (
      <p className="text-red-600 dark:text-red-500">
        Error: ${authorData.error.message}
      </p>
    );
  }

  const date = new Date(articleCreatedAtDate);

  // Options for formatting
  const options = { day: "numeric", month: "long", year: "numeric" };

  // Format the date
  const formattedArticleDate = date.toLocaleDateString("en-GB");

  return (
    <div className="flex space-x-4">
      <Image
        src={
          author && author?.profileImageUrl
            ? author?.profileImageUrl
            : "https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg"
        }
        alt=""
        height={40}
        width={40}
        className="rounded-full h-[40px] w-[40px]"
      />

      <div className="ml-2">
        <div className="text-sm flex space-x-2 justify-start items-center">
          <p className="text-base text-zinc-800 dark:text-white font-semibold">
            {author?.name ?? "Author Name"}
          </p>
          <p className="text-xs text-green-500 cursor-pointer">Follow</p>
        </div>
        <div className="text-xs flex space-x-2 justify-start items-center dark:text-gray-400">
          <p>{estimatedReadingTime ?? "5 min read"}, </p>
          <p className="font-medium">
            {formattedArticleDate ?? "Nov 18, 2023"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArticleAuthorInfo;

const ArticleAuthorInfoLoadingSkeleton = () => {
  return (
    <div className="flex justify-start items-center space-x-4">
      <Skeleton className="rounded-full h-[40px] w-[40px]" />

      <div className="space-y-2">
        <div className="flex space-x-2 justify-start items-center">
          <div className="flex justify-start items-center space-x-2">
            <Skeleton className="h-6 w-[195px]" />
            <Skeleton className="h-6 w-[50px]" />
          </div>

          {/* <p className="text-xs text-green-500 cursor-pointer">Follow</p> */}
        </div>

        <div className="flex justify-start items-center space-x-2">
          <Skeleton className="h-4 w-[40px]" />
          <Skeleton className="h-4 w-[195px]" />
        </div>
      </div>
    </div>
  );
};
