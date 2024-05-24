"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { FaHandsClapping } from "react-icons/fa6";
import { AiOutlineComment } from "react-icons/ai";
import { Divider } from "@tremor/react";
import { CiBookmarkPlus } from "react-icons/ci";
import { IoMdArrowRoundBack, IoMdBookmark } from "react-icons/io";
import { FaShareFromSquare } from "react-icons/fa6";
import { MdMoreHoriz } from "react-icons/md";
import ArticlesSearchButton from "@/app/(browseArticles)/articles/_components/articles-search-button";
import Notifications from "@/components/notification-button";
import { ThemeModeToggle } from "@/components/themeModeToggle";
import UserAvatar from "@/components/user-avatar";
import { Blog } from "@prisma/client";
import MoreFromAuthor from "../_components/more-from-author";
import RecommendedFromCoursewave from "../_components/recommended-from-coursewave";
import ArticleAuthorCard from "../_components/article-author-card";
import useArticleInfo from "@/hooks/use-article-info";
import { absoluteUrl } from "@/utils/utils";
import ArticleAuthorInfo from "../_components/article-author-info";
import { Button } from "@/components/ui/button";
import { CgAdd } from "react-icons/cg";
import { BsBack } from "react-icons/bs";
import Link from "next/link";

export default function ArticleContentPage({
  params,
}: {
  params: {
    articleId: string;
  };
}) {
  const articleId = params?.articleId!;
  const articleData = useArticleInfo(articleId);

  if (!articleData) return <div>Loading the article information ...</div>;

  const article: Blog = articleData.data?.data! as Blog;
  console.log("Article info: ", article);

  return (
    <div className="min-h-screen h-full justify-center">
      <div className="flex justify-between items-center px-16 py-2 border border-b-[1px] border-stroke">
        <div>
          <Link href={`/articles`}>
            <Button
              variant="outline"
              size="icon"
              className="flex justify-center items-center h-10 w-20 rounded-md dark:bg-transparent dark:hover:bg-zinc-800 transition-all duration-200 space-x-[6px]"
            >
              <IoMdArrowRoundBack className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all " />

              {/* sr-only */}
              <span className="">Back</span>
            </Button>
          </Link>
        </div>

        <div className="flex justify-end space-x-2 items-center">
          <Link href={`/writeArticle`}>
            <Button
              variant="outline"
              size="icon"
              className="flex justify-center items-center h-10 w-20 rounded-md dark:bg-transparent dark:hover:bg-zinc-800 transition-all duration-200 space-x-2"
            >
              Write
              <CgAdd className="h-[1.2rem] w-[1.2rem] ml-1 rotate-0 scale-100 transition-all " />
              <span className="sr-only">Write Post</span>
            </Button>
          </Link>

          <ThemeModeToggle />

          {/* notifications */}
          <Notifications />

          {/* user profile */}
          {<UserAvatar />}
        </div>
      </div>

      <div className="max-w-3xl w-full mx-auto my-16 space-y-8">
        <p className="text-[42px] leading-10 my-[24px] text-zinc-800 dark:text-white font-bold tracking-tighter">
          {article?.title ? article?.title : "Serverless Video Backend"}
        </p>

        {/* author info */}
        <ArticleAuthorInfo authorId={article?.authorId} />

        <Divider />

        {/* claps and comments, bookmark and more menu */}
        <div className="flex justify-between items-center">
          {/* clap and comments icons */}
          <div className="flex px-1 space-x-4">
            <div className="flex justify-start items-center space-x-2 cursor-pointer hover:text-zinc-900">
              <FaHandsClapping size={18} />
              <p className="text-xs mt-1">
                {" "}
                {article?.clapsCount ? article?.clapsCount : 0}
              </p>
            </div>

            <div className="flex justify-start items-center space-x-2 cursor-pointer hover:text-zinc-900">
              <AiOutlineComment size={18} />
            </div>
          </div>

          {/* bookmark and more menu icon */}
          <div className="flex px-1 space-x-4">
            {/* bookmark icons */}
            <div className="flex justify-start items-center space-x-2 cursor-pointer hover:text-zinc-900">
              <CiBookmarkPlus size={18} />
              <IoMdBookmark size={18} />
            </div>

            {/* share */}
            <div className="flex justify-start items-center space-x-2 cursor-pointer hover:text-zinc-900">
              <FaShareFromSquare size={18} />
            </div>

            {/* more */}
            <div className="flex justify-start items-center space-x-2 cursor-pointer hover:text-zinc-900">
              <MdMoreHoriz size={18} />
            </div>
          </div>
        </div>

        <Divider />

        {/* content */}
        <div className="space-y-4">
          <div>
            <Image
              src={
                article?.thumbnailUrl
                  ? article?.thumbnailUrl
                   : "/women-with-laptop.png"
              }
              alt={"Article Thumbnail"}
              className="h-[22rem] object-cover"
              height={80}
              width={768}
            />
          </div>

          <div>
            {article?.content ? (
              <div
                className="text-base text-md text-zinc-700 dark:text-gray-100 tracking-tight"
                dangerouslySetInnerHTML={{ __html: article?.content }}
              />
            ) : (
              <blockquote className="text-base font-bold text-zinc-700 dark:text-gray-100 tracking-tight">
                "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam,
                unde dolor ratione tempore in nihil culpa commodi labore non
                accusamus sequi quos eos aspernatur iste, fuga earum obcaecati
                laborum aliquid nemo maiores animi quasi repellat? Ex."
              </blockquote>
            )}
          </div>
        </div>

        <Divider />

        {/* author Card */}
        <ArticleAuthorCard authorId={article?.authorId!} />

        {/* more from  */}
        {/* <MoreFromAuthor authorId={article?.authorId!} /> */}

        <Divider />

        {/* recommend   */}
        {/* <RecommendedFromCoursewave /> */}
      </div>
    </div>
  );
}
