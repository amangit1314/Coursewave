"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useGetUserByAuthorId } from "@/hooks/useGetUserById";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@tremor/react";

type ArticleAuthorInfoProps = {
  authorId: string;
  authorProfileImageUrl: string | null;
  authorName: string | null;

  estimatedReadingTime: string;
  articleCreatedAtDate: string;
};

const ArticleAuthorInfo = ({
  authorId,
  authorProfileImageUrl,
  authorName,
  estimatedReadingTime,
  articleCreatedAtDate,
}: ArticleAuthorInfoProps) => {
  // const authorData = useGetUserByAuthorId(authorId);
  // const author = authorData.user;

  // if (authorData.isLoading) {
  //   return <ArticleAuthorInfoLoadingSkeleton />;
  // }

  // if (authorData.error) {
  //   return (
  //     <div className="max-w-7xl w-full mx-auto flex items-center justify-center align-middle">
  //       <Callout
  //         className=""
  //         title="Failed to Fetch Article Author Info 🚨❌"
  //         // color="red"
  //       >
  //         <span>{authorData.error.message} 🚨❌ ...</span>
  //       </Callout>
  //     </div>
  //   );
  // }

  const date = new Date(articleCreatedAtDate);

  // Options for formatting
  // const options = { day: "numeric", month: "long", year: "numeric" };

  // Format the date
  const formattedArticleDate = date.toLocaleDateString("en-GB");

  return (
    <div className="flex space-x-4">
      <Image
        // src={
        //   author && author?.profileImageUrl
        //     ? author?.profileImageUrl
        //     : "https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg"
        // }
        src={authorProfileImageUrl ?? "https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg"}
        alt=""
        height={40}
        width={40}
        className="h-[40px] w-[40px] rounded-full"
      />

      <div className="ml-2">
        <div className="flex items-center justify-start space-x-2 text-sm">
          <p className="text-base font-semibold text-zinc-800 dark:text-white">
            {/* {author?.name ?? "Author Name"}
             */}
            {authorName ?? "Author Name"}
          </p>
          <p className="cursor-pointer text-xs text-green-500">Follow</p>
        </div>
        <div className="flex items-center justify-start space-x-2 text-xs dark:text-gray-400">
          <p>{estimatedReadingTime ?? 5} min read, </p>
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
    <div className="flex items-center justify-start space-x-4">
      <Skeleton className="h-[40px] w-[40px] rounded-full" />

      <div className="space-y-2">
        <div className="flex items-center justify-start space-x-2">
          <div className="flex items-center justify-start space-x-2">
            <Skeleton className="h-6 w-[195px]" />
            <Skeleton className="h-6 w-[50px]" />
          </div>

          {/* <p className="text-xs text-green-500 cursor-pointer">Follow</p> */}
        </div>

        <div className="flex items-center justify-start space-x-2">
          <Skeleton className="h-4 w-[40px]" />
          <Skeleton className="h-4 w-[195px]" />
        </div>
      </div>
    </div>
  );
};