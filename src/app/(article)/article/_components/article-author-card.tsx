"use client";

import React from "react";
import Image from "next/image";
import { Divider } from "@tremor/react";
import useGetUserByAuthorId from "@/hooks/use-get-user-by-authorId";
import { Skeleton } from "@/components/ui/skeleton";

const ArticleAuthorCard = ({ authorId }: { authorId: string }) => {
  const authorData = useGetUserByAuthorId(authorId);
  const author = authorData.user;

  if (authorData.isLoading) {
    return <ArticleAuthorCardLoadingSkeleton />;
  }

  return (
    <div className="flex flex-col space-y-4 my-8">
      <Image
        src={
          author && author.profileImageUrl
            ? author.profileImageUrl
            : "https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg"
        }
        alt=""
        height={60}
        width={60}
        className="rounded-full h-[60px] w-[60px] cursor-pointer  duration-200 transition-all hover:shadow-xl"
      />

      <div className="md:ml-2">
        <div className="text-sm flex flex-col space-y-2 justify-start items-start">
          <div className="flex justify-between items-center w-full">
            <p className="text-base text-zinc-800 dark:text-gray-200 font-medium tracking-tight">
              Written by{" "}
              <span className="cursor-pointer duration-200 transition-all font-bold hover:underline dark:text-white">
                {author ? author.name : "Author Name"}
              </span>
            </p>
            <p className="rounded-badge ml-auto border border-stroke text-center px-4 py-2 text-xs cursor-pointer text-green-700 hover:text-white hover:bg-green-700 transition-all duration-200">
              Follow
            </p>
          </div>
          <p className="text-sm font-medium text-zinc-700 dark:text-gray-200 ">
            <span className="text-zinc-950 dark:text-white font-bold tracking-tight">
              {100}
            </span>{" "}
            Followers
          </p>

          <blockquote className="text-sm font-medium text-zinc-700 dark:text-gray-200 line-clamp-4 ">
            {author
              ? author.about
              : `Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
            modi deserunt esse eaque quibusdam itaque aliquid orem ipsum dolor
            sit amet co orem ipsum dolor sit amet co orem ipsum dolor sit amet
            co orem ipsum dolor sit amet co orem ipsum dolor sit amet co`}
          </blockquote>
        </div>

        <Divider />
      </div>
    </div>
  );
};

export default ArticleAuthorCard;

const ArticleAuthorCardLoadingSkeleton = () => {
  return (
    <div className="space-y-6 my-8">
      <Skeleton className="rounded-full h-[60px] w-[60px]" />

      <div className="space-y-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-start items-center space-x-2">
            <Skeleton className="h-8 w-[45px]" />
            <Skeleton className="h-8 w-[150px]" />
          </div>

          <p className="rounded-badge border border-stroke text-center px-4 py-2 text-xs cursor-pointer text-green-700 hover:text-white hover:bg-green-700 transition-all duration-200">
            Follow
          </p>
        </div>

        <div className="flex justify-start items-center space-x-2">
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
