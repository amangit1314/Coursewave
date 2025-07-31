"use client";

import React from "react";
import Image from "next/image";
import { Callout } from "@tremor/react";
import { Separator } from "@/components/ui/separator";
import { useGetUserByAuthorId } from "@/hooks/useGetUserById";
import { Skeleton } from "@/components/ui/skeleton";

const ArticleAuthorCard = ({
  authorId,
  authorImage,
  authorName,
  authorBio,
  authorFollowers,
  haveAlreadyFollowed,
}: {
  authorId: string;
  authorImage: string;
  authorName: string;
  authorBio: string;
  authorFollowers: number;
  haveAlreadyFollowed: boolean;
}) => {
  const authorData = useGetUserByAuthorId(authorId);
  const author = authorData.user;

  // if (authorData.isLoading) {
  //   return <ArticleAuthorCardLoadingSkeleton />;
  // }

  // if (authorData.error) {
  //   return (
  //     <div className="w-7xl mx-auto flex items-center justify-center align-middle">
  //       <Callout
  //         className=""
  //         title="Failed to Fetch Author Info in aricle-author-card.tsx 🚨❌"
  //         color="red"
  //       >
  //         <span>{authorData.error.message} 🚨❌ ...</span>
  //       </Callout>
  //     </div>
  //   );
  // }

  return (
    <div className="my-8 flex flex-col space-y-4">
      <Image
        // src={
        //   author && author.profileImageUrl
        //     ? author.profileImageUrl
        //     : "https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg"
        // }
        src={
          authorImage
            ? authorImage
            : "https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg"
        }
        alt=""
        height={60}
        width={60}
        className="h-[60px] w-[60px] cursor-pointer rounded-full transition-all duration-200 hover:shadow-xl"
      />

      <div className="md:ml-2">
        <div className="flex flex-col items-start justify-start space-y-2 text-sm">
          <div className="flex w-full items-center justify-between">
            <p className="text-base font-medium tracking-tight text-zinc-800 dark:text-gray-200">
              Written by{" "}
              <span className="cursor-pointer font-bold transition-all duration-200 hover:underline dark:text-white">
                {/* {author ? author.name : "Author Name"} */}
                {authorName ? authorName : "Author Name"}
              </span>
            </p>
            {/* todo: make this clickable button */}
            <p className="border-stroke ml-auto cursor-pointer rounded-badge border px-4 py-2 text-center text-xs text-green-700 transition-all duration-200 hover:bg-green-700 hover:text-white">
              {haveAlreadyFollowed ? "Followed" : "Follow"}
            </p>
          </div>
          <p className="text-sm font-medium text-zinc-700 dark:text-gray-200">
            <span className="font-bold tracking-tight text-zinc-950 dark:text-white">
              {authorFollowers ?? 100}
            </span>{" "}
            Followers
          </p>

          <blockquote className="line-clamp-4 text-sm font-medium text-zinc-700 dark:text-gray-200">
            {/* {author
              ? author.about
              : `Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
            modi deserunt esse eaque quibusdam itaque aliquid orem ipsum dolor
            sit amet co orem ipsum dolor sit amet co orem ipsum dolor sit amet
            co orem ipsum dolor sit amet co orem ipsum dolor sit amet co`} */}
            {authorBio
              ? authorBio
              : `Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
            modi deserunt esse eaque quibusdam itaque aliquid orem ipsum dolor
            sit amet co orem ipsum dolor sit amet co orem ipsum dolor sit amet
            co orem ipsum dolor sit amet co orem ipsum dolor sit amet co`}
          </blockquote>
        </div>

        <Separator className="my-4" />
      </div>
    </div>
  );
};

export default ArticleAuthorCard;

const ArticleAuthorCardLoadingSkeleton = () => {
  return (
    <div className="my-8 space-y-6">
      <Skeleton className="h-[60px] w-[60px] rounded-full" />

      <div className="space-y-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center justify-start space-x-2">
            <Skeleton className="h-8 w-[45px]" />
            <Skeleton className="h-8 w-[150px]" />
          </div>

          <p className="border-stroke cursor-pointer rounded-badge border px-4 py-2 text-center text-xs text-green-700 transition-all duration-200 hover:bg-green-700 hover:text-white">
            Follow
          </p>
        </div>

        <div className="flex items-center justify-start space-x-2">
          <Skeleton className="h-4 w-[40px]" />
          <Skeleton className="h-4 w-[95px]" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[75px]" />
        </div>
      </div>
    </div>
  );
};
