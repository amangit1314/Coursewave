"use client";

import React from "react";
import Image from "next/image";
import { FaHandsClapping } from "react-icons/fa6";
import { AiOutlineComment } from "react-icons/ai";
import { Divider } from "@tremor/react";
import { CiBookmarkPlus } from "react-icons/ci";
import { IoMdArrowRoundBack, IoMdBookmark } from "react-icons/io";
import { FaShareFromSquare } from "react-icons/fa6";
import { MdMoreHoriz, MdReport } from "react-icons/md";
import Notifications from "@/components/notification-button";
import { ThemeModeToggle } from "@/components/themeModeToggle";
import UserAvatar from "@/components/user-avatar";
import { Blog } from "@prisma/client";
import MoreFromAuthor from "../_components/more-from-author";
import RecommendedFromCoursewave from "../_components/recommended-from-coursewave";
import ArticleAuthorCard from "../_components/article-author-card";
import useArticleInfo from "@/hooks/use-article-info";
import ArticleAuthorInfo from "../_components/article-author-info";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, EyeOff, SquarePen, UserMinus, UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

const ArticleContentPage = ({ params }: { params: { articleId: string } }) => {
  const articleId = params?.articleId!;
  const articleData = useArticleInfo(articleId);
  const [isBookmarked, setIsBookmarked] = React.useState<boolean>(false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (!articleData) {
    return <div>Loading the article information ...</div>;
  }

  const article: BlogWithComments = articleData.data?.data! as BlogWithComments;
  console.log("Article info: ", article);

  if (articleData.isLoading) {
    return <ArticleContentLoadingSkeleton article={article!} />;
  }

  return (
    <div className="min-h-screen h-full justify-center overflow-x-hidden">
      {/* article header */}
      <div className="flex justify-between items-center px-16 py-2 border border-b-[1px] border-stroke">
        {/* back button */}
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
          {/* write article button */}
          <Link href={`/writeArticle`}>
            <Button
              variant="outline"
              size="icon"
              className="flex justify-center items-center h-10 w-20 rounded-md dark:bg-transparent dark:hover:bg-zinc-800 transition-all duration-200 space-x-2"
            >
              <SquarePen className="h-[1.2rem] w-[1.2rem] ml-1 rotate-0 scale-100 transition-all " />
              <span className="">Write</span>
            </Button>
          </Link>

          {/* theme toggle */}
          <ThemeModeToggle />

          {/* notifications */}
          <Notifications />

          {/* user profile */}
          {<UserAvatar />}
        </div>
      </div>

      <div className="md:max-w-3xl w-full my-16 mx-8 md:mx-auto space-y-8 overflow-x-hidden">
        {/* article title */}
        <p className="text-[42px] leading-10 my-[24px] text-zinc-800 dark:text-white font-bold tracking-tighter">
          {article?.title ? article?.title : "Serverless Video Backend"}
        </p>

        {/* author info */}
        <ArticleAuthorInfo
          authorId={article?.authorId}
          estimatedReadingTime={article?.estimatedReadingTime}
          articleCreatedAtDate={article?.createdAt?.toString()!}
        />

        <Divider />

        {/* claps and comments, bookmark and more menu */}
        <div className="flex justify-between items-center">
          {/* clap and comments icons */}
          <div className="flex px-1 space-x-4">
            {/* claps count */}
            <div className="flex justify-start items-center space-x-2 cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-all duration-300">
              <FaHandsClapping size={18} />
              <div className="text-xs mt-1">
                {article?.clapsCount ? article?.clapsCount : 0}
              </div>
            </div>

            {/* comments */}
            <div className="flex justify-start items-center space-x-2 cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-all duration-300">
              <AiOutlineComment size={18} />
              <div className="text-xs mt-1">
                {article?.comments ? article?.comments.toString() : 0}
              </div>
            </div>
          </div>

          {/* bookmark and more menu icon */}
          <div className="flex px-1 space-x-4 dark:text-gray-200 transition-all duration-300">
            {/* bookmark icons */}
            <div
              onClick={toggleBookmark}
              className="flex justify-start items-center space-x-2 cursor-pointer hover:text-zinc-900  transition-all duration-300 dark:hover:text-white"
            >
              {isBookmarked ? (
                <IoMdBookmark size={18} />
              ) : (
                <CiBookmarkPlus size={18} />
              )}
            </div>

            {/* share */}
            <div className="flex justify-start items-center space-x-2 cursor-pointer hover:text-zinc-900  transition-all duration-300 dark:hover:text-white">
              <FaShareFromSquare size={18} />
            </div>

            {/* more */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex justify-start items-center space-x-2 cursor-pointer hover:text-zinc-900 dark:hover:text-white">
                  <MdMoreHoriz size={18} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 rounded-xl">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer hover:text-green-500 dark:hover:text-green-400 ">
                    <Eye className="mr-2 h-4 w-4" />
                    <span>Show more from author</span>
                    <DropdownMenuShortcut>⇧⌘M</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:text-red-500 dark:hover:text-red-400 cursor-pointer">
                    <EyeOff className="mr-2 h-4 w-4" />
                    <span>Show less from author</span>
                    <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:text-green-500 dark:hover:text-green-400 cursor-pointer">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Follow Author</span>
                    <DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:text-red-500 dark:hover:text-red-400 cursor-pointer">
                    <UserMinus className="mr-2 h-4 w-4" />
                    <span>Mute Author</span>
                    <DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuItem className="text-red-500 dark:text-red-400 cursor-pointer">
                  <MdReport className="mr-2 h-4 w-4" />
                  <span>Report article</span>
                  <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        <MoreFromAuthor authorId={article?.authorId!} />

        <Divider />

        {/* recommend   */}
        <RecommendedFromCoursewave />
      </div>
    </div>
  );
};

export default ArticleContentPage;

const ArticleContentLoadingSkeleton = ({ article }: { article: Blog }) => {
  return (
    <div className="min-h-screen h-full justify-center overflow-x-hidden">
      {/* article header */}
      <div className="flex justify-between items-center px-16 py-2 border border-b-[1px] border-stroke">
        {/* back button */}
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
          {/* write article button */}
          <Link href={`/writeArticle`}>
            <Button
              variant="outline"
              size="icon"
              className="flex justify-center items-center h-10 w-20 rounded-md dark:bg-transparent dark:hover:bg-zinc-800 transition-all duration-200 space-x-2"
            >
              <SquarePen className="h-[1.2rem] w-[1.2rem] ml-1 rotate-0 scale-100 transition-all " />
              <span className="">Write</span>
            </Button>
          </Link>

          {/* theme toggle */}
          <ThemeModeToggle />

          {/* notifications */}
          <Notifications />

          {/* user profile */}
          {<UserAvatar />}
        </div>
      </div>

      <div className="md:max-w-3xl w-full my-16 mx-8 md:mx-auto space-y-8 overflow-x-hidden">
        {/* article title */}
        <Skeleton className="h-[42px] my-[24px]" />

        {/* author info */}
        <ArticleAuthorInfo
          authorId={article?.authorId}
          estimatedReadingTime={article?.estimatedReadingTime}
          articleCreatedAtDate={article?.createdAt?.toString()!}
        />

        {/* content */}
        <div className="space-y-6">
          <Skeleton className="h-[22rem] object-cover" />

          <div className="space-y-4">
            <Skeleton className="h-8 w-[150px] object-cover" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full object-cover" />
              <Skeleton className="h-4 w-full object-cover" />
              <Skeleton className="h-4 w-full object-cover" />
              <Skeleton className="h-4 w-[120px] object-cover" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-8 w-[150px]  object-cover" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full object-cover" />
              <Skeleton className="h-4 w-full object-cover" />
              <Skeleton className="h-4 w-full object-cover" />
              <Skeleton className="h-4 w-[120px] object-cover" />
            </div>
          </div>

          <Skeleton className="h-[22rem] object-cover" />

          <div className="space-y-4">
            <Skeleton className="h-8 w-[150px]  object-cover" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full object-cover" />
              <Skeleton className="h-4 w-full object-cover" />
              <Skeleton className="h-4 w-full object-cover" />
              <Skeleton className="h-4 w-[120px] object-cover" />
            </div>
          </div>

          {/* <div className="space-y-4">
            <Skeleton className="h-6 w-[260px] rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 mt-2 w-full rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-[320px] rounded-full" />
            </div>
          </div> */}

          <div className="space-y-4 ">
            <div>
              <Skeleton className="h-6 w-40  rounded-md" />
            </div>

            <div className="space-y-2">
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* author Card */}
        <ArticleAuthorCard authorId={article?.authorId!} />

        {/* more from  */}
        {/* <MoreFromAuthor authorId={article?.authorId!} /> */}

        <Divider />

        {/* recommend   */}
        <RecommendedFromCoursewave />
      </div>
    </div>
  );
};
