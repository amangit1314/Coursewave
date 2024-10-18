"use client";

import React from "react";
import Image from "next/image";
import { FaHandsClapping } from "react-icons/fa6";
import { AiOutlineComment } from "react-icons/ai";
import { Callout, Divider } from "@tremor/react";
import { CiBookmarkPlus } from "react-icons/ci";
import { IoMdArrowRoundBack, IoMdBookmark } from "react-icons/io";
import { FaShareFromSquare } from "react-icons/fa6";
import { MdMoreHoriz, MdReport } from "react-icons/md";
import Notifications from "@/components/notification-button";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import UserAvatar from "@/components/user-avatar";
import { Blog } from "@prisma/client";
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
import { BlogWithComments } from "@/types/blog-with-comments";
import { useUserStore } from "@/zustand/userStore";
import { useArticlesStore } from "@/zustand/articlesStore";
import ArticleAuthorInfo from "./_components/article-author-info";
import ArticleAuthorCard from "./_components/article-author-card";
import MoreFromAuthor from "./_components/more-from-author";
import RecommendedFromCoursewave from "./_components/recommended-from-coursewave";

const ArticleContentPage = ({ params }: { params: { articleId: string } }) => {
  const articleId = params?.articleId!;
  const [isBookmarked, setIsBookmarked] = React.useState<boolean>(false);

  const { fetchSelectedArticle, selectedArticle } = useArticlesStore();

  React.useEffect(() => {
    fetchSelectedArticle(articleId);
  }, [fetchSelectedArticle, articleId]);

  const { saveArticle, unsaveArticle, loadingState } = useUserStore();

  const article: BlogWithComments = selectedArticle!;
  console.log("Article info: ", article);

  if (loadingState.loading) {
    return <ArticleContentLoadingSkeleton article={article!} />;
  }

  if (loadingState.error && !article) {
    // return (
    //   <div className="text-red-500">
    //     Error in getting the article information ...
    //   </div>
    // );

    return (
      <div className="w-7xl mx-auto flex items-center justify-center align-middle">
        <Callout
          className=""
          title="Failed to fetch Article Info 🚨❌"
          color="red"
        >
          <span>ERROR: {loadingState.error} 🚨❌ ...</span>
        </Callout>
      </div>
    );
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (isBookmarked) {
      unsaveArticle(article.id);
    } else {
      saveArticle(article);
    }
  };

  return (
    <div className="h-full min-h-screen justify-center overflow-x-hidden">
      {/* article header */}
      <div className="border-stroke flex items-center justify-between border border-b-[1px] px-16 py-2">
        {/* back button */}
        <div>
          <Link href={`/articles`}>
            <Button
              variant="outline"
              size="icon"
              className="flex h-10 w-20 items-center justify-center space-x-[6px] rounded-md transition-all duration-200 dark:bg-transparent dark:hover:bg-zinc-800"
            >
              <IoMdArrowRoundBack className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />

              {/* sr-only */}
              <span className="">Back</span>
            </Button>
          </Link>
        </div>

        {/* buttons (write article, theme, notifications, user avatar) */}
        <div className="flex items-center justify-end space-x-2">
          {/* write article button */}
          <Link href={`/writeArticle`}>
            <Button
              variant="outline"
              size="icon"
              className="flex h-10 w-20 items-center justify-center space-x-2 rounded-md transition-all duration-200 dark:bg-transparent dark:hover:bg-zinc-800"
            >
              <SquarePen className="ml-1 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
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

      {/* content */}
      <div className="mx-8 my-16 w-full space-y-8 overflow-x-hidden md:mx-auto md:max-w-3xl">
        {/* article title */}
        <p className="my-[24px] text-[42px] font-bold leading-10 tracking-tighter text-zinc-800 dark:text-white">
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
        <div className="flex items-center justify-between">
          {/* clap and comments icons */}
          <div className="flex space-x-4 px-1">
            {/* claps count */}
            <div className="flex cursor-pointer items-center justify-start space-x-2 transition-all duration-300 hover:text-zinc-900 dark:hover:text-white">
              <FaHandsClapping size={18} />
              <div className="mt-1 text-xs">
                {article?.clapsCount ? article?.clapsCount : 0}
              </div>
            </div>

            {/* comments */}
            <div className="flex cursor-pointer items-center justify-start space-x-2 transition-all duration-300 hover:text-zinc-900 dark:hover:text-white">
              <AiOutlineComment size={18} />
              <div className="mt-1 text-xs">
                {article?.comments ? article?.comments.toString() : 0}
              </div>
            </div>
          </div>

          {/* bookmark and more menu icon */}
          <div className="flex space-x-4 px-1 transition-all duration-300 dark:text-gray-200">
            {/* bookmark icons */}
            <div
              onClick={toggleBookmark}
              className="flex cursor-pointer items-center justify-start space-x-2 transition-all duration-300 hover:text-zinc-900 dark:hover:text-white"
            >
              {isBookmarked ? (
                <IoMdBookmark size={18} />
              ) : (
                <CiBookmarkPlus size={18} />
              )}
            </div>

            {/* share */}
            <div className="flex cursor-pointer items-center justify-start space-x-2 transition-all duration-300 hover:text-zinc-900 dark:hover:text-white">
              <FaShareFromSquare size={18} />
            </div>

            {/* more */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex cursor-pointer items-center justify-start space-x-2 hover:text-zinc-900 dark:hover:text-white">
                  <MdMoreHoriz size={18} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 rounded-xl">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer hover:text-green-500 dark:hover:text-green-400">
                    <Eye className="mr-2 h-4 w-4" />
                    <span>Show more from author</span>
                    <DropdownMenuShortcut>⇧⌘M</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:text-red-500 dark:hover:text-red-400">
                    <EyeOff className="mr-2 h-4 w-4" />
                    <span>Show less from author</span>
                    <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:text-green-500 dark:hover:text-green-400">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Follow Author</span>
                    <DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:text-red-500 dark:hover:text-red-400">
                    <UserMinus className="mr-2 h-4 w-4" />
                    <span>Mute Author</span>
                    <DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer text-red-500 dark:text-red-400">
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
          {/* article main image */}
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

          {/* article content */}
          <div>
            {article?.content ? (
              <div
                className="text-md text-base tracking-tight text-zinc-700 dark:text-gray-100"
                dangerouslySetInnerHTML={{ __html: article?.content }}
              />
            ) : (
              <blockquote className="text-base font-bold tracking-tight text-zinc-700 dark:text-gray-100">
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
    <div className="h-full min-h-screen justify-center overflow-x-hidden">
      {/* article header */}
      <div className="border-stroke flex items-center justify-between border border-b-[1px] px-16 py-2">
        {/* back button */}
        <div>
          <Link href={`/articles`}>
            <Button
              variant="outline"
              size="icon"
              className="flex h-10 w-20 items-center justify-center space-x-[6px] rounded-md transition-all duration-200 dark:bg-transparent dark:hover:bg-zinc-800"
            >
              <IoMdArrowRoundBack className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />

              {/* sr-only */}
              <span className="">Back</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-end space-x-2">
          {/* write article button */}
          <Link href={`/writeArticle`}>
            <Button
              variant="outline"
              size="icon"
              className="flex h-10 w-20 items-center justify-center space-x-2 rounded-md transition-all duration-200 dark:bg-transparent dark:hover:bg-zinc-800"
            >
              <SquarePen className="ml-1 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
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

      <div className="mx-8 my-16 w-full space-y-8 overflow-x-hidden md:mx-auto md:max-w-3xl">
        {/* article title */}
        <Skeleton className="my-[24px] h-[42px]" />

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
            <Skeleton className="h-8 w-[150px] object-cover" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full object-cover" />
              <Skeleton className="h-4 w-full object-cover" />
              <Skeleton className="h-4 w-full object-cover" />
              <Skeleton className="h-4 w-[120px] object-cover" />
            </div>
          </div>

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

          {/* <div className="space-y-4">
            <Skeleton className="h-6 w-[260px] rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 mt-2 w-full rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-[320px] rounded-full" />
            </div>
          </div> */}

          <div className="space-y-4">
            <div>
              <Skeleton className="h-6 w-40 rounded-md" />
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
