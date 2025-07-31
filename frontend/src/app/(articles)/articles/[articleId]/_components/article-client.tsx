"use client";

import { Callout, Divider } from "@tremor/react";
import RecommendedFromCoursewave from "./recommended-from-coursewave";
import ArticleAuthorCard from "./article-author-card";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleAuthorInfo from "./article-author-info";
import UserAvatar from "@/app/(shared)/user-avatar";
import Notifications from "@/app/(shared)/notification-button";
import { ThemeModeToggle } from "@/app/(shared)/theme-mode-toggle";
import {
  Eye,
  EyeOff,
  SquarePen,
  UserMinus,
  UserPlus,
  RefreshCw,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoMdArrowRoundBack, IoMdBookmark } from "react-icons/io";
import { BlogArticle } from "@/types/blog-api-response";
import MoreFromAuthor from "./more-from-author";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdMoreHoriz, MdReport } from "react-icons/md";
import { FaHandsClapping, FaShareFromSquare } from "react-icons/fa6";
import { CiBookmarkPlus } from "react-icons/ci";
import { AiOutlineComment, AiOutlineEye } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useUserStore } from "@/zustand/userStore";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { articleService } from "@/lib/api/articles";

const ArticleClient = ({ articleId }: { articleId: string }) => {
  const [isBookmarked, setIsBookmarked] = React.useState<boolean>(false);
  const { saveArticle, unsaveArticle, loadingState } = useUserStore();

  // Use React Query instead of Zustand for better caching
  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const response = await articleService.getArticleById(articleId);
      // Handle case where API returns an array instead of single object
      return Array.isArray(response.data) ? response.data[0] : response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!articleId,
  });

  // Loading skeleton
  if (isLoading) {
    return <ArticleContentLoadingSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="h-full flex flex-col">
        {/*  header */}
        {/* <div className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-16 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm">
          <div>
            <Link href={`/articles`}>
              <Button
                variant="outline"
                size="icon"
                className="flex h-10 w-20 items-center justify-center rounded-md transition-all duration-200 dark:bg-transparent dark:hover:bg-zinc-800"
              >
                <IoMdArrowRoundBack className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Link href={`/writeArticle`}>
              <Button
                variant="outline"
                size="icon"
                className="flex h-10 w-20 items-center justify-center rounded-md transition-all duration-200 dark:bg-transparent dark:hover:bg-zinc-800"
              >
                <SquarePen className="ml-1 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                <span className="sr-only">Write</span>
              </Button>
            </Link>
            <ThemeModeToggle />
            <Notifications />
            <UserAvatar />
          </div>
        </div> */}
        <div className="sticky top-0 z-50  bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-sm dark:shadow-zinc-800/20 transition-all duration-300">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
            <div className="flex h-14 sm:h-16 items-center justify-between">
              {/* Back Button Section */}
              <div className="flex items-center">
                <Link href={`/articles`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group relative h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 transition-all duration-300 ease-out hover:scale-105 active:scale-95 shadow-sm hover:shadow-md dark:shadow-zinc-800/30"
                  >
                    <IoMdArrowRoundBack className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors duration-200" />
                    <span className="sr-only">Back to articles</span>

                    {/* Subtle hover effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                  </Button>
                </Link>

                {/* Optional breadcrumb text for larger screens */}
                <div className="hidden md:flex items-center ml-3">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    Back to
                  </span>
                  <span className="ml-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Articles
                  </span>
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Write Article Button */}
                <Link href={`/writeArticle`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="group relative h-9 sm:h-10 px-3 sm:px-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-zinc-800/50 dark:to-zinc-700/50 dark:hover:from-zinc-700/80 dark:hover:to-zinc-600/80 border-blue-200/60 dark:border-zinc-600/60 hover:border-blue-300/80 dark:hover:border-zinc-500/80 transition-all duration-300 ease-out hover:scale-105 active:scale-95 shadow-sm hover:shadow-md dark:shadow-zinc-800/30"
                  >
                    <SquarePen className="h-4 w-4 sm:mr-2 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200" />
                    <span className="hidden sm:inline text-sm font-medium text-blue-700 dark:text-blue-300">
                      Write
                    </span>
                    <span className="sr-only">Write new article</span>

                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                  </Button>
                </Link>

                {/* Divider for larger screens */}
                <div className="hidden sm:block w-px h-6 bg-zinc-200 dark:bg-zinc-700" />

                {/* Action Buttons Group */}
                <div className="flex items-center space-x-1">
                  {/* Theme Toggle */}
                  <div className="relative">
                    <ThemeModeToggle />
                  </div>

                  {/* Notifications */}
                  <div className="relative">
                    <Notifications />
                  </div>

                  {/* User Avatar */}
                  <div className="relative ml-1 sm:ml-2">
                    <UserAvatar />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
        </div>

        {/* Centered error content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="mx-4 md:mx-8 w-full max-w-md flex flex-col items-center justify-center text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400 animate-bounce" />
            <p className="text-2xl font-bold text-zinc-800 dark:text-white">
              Failed to load article
            </p>
            <p className="text-base text-red-500 dark:text-red-400">
              {error?.message}
            </p>
            <Button
              onClick={() => {
                // Implement retry logic
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!article) {
    return (
      <div className="h-full flex flex-col">
        {/* Glassmorphism header */}
        <div className="sticky top-0 z-20 border-stroke flex items-center justify-between border border-b-[1px] px-4 md:px-16 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm">
          <div>
            <Link href={`/articles`}>
              <Button
                variant="outline"
                size="icon"
                className="flex h-10 w-20 items-center justify-center rounded-md transition-all duration-200 dark:bg-transparent dark:hover:bg-zinc-800"
              >
                <IoMdArrowRoundBack className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Link href={`/writeArticle`}>
              <Button
                variant="outline"
                size="icon"
                className="flex h-10 w-20 items-center justify-center rounded-md transition-all duration-200 dark:bg-transparent dark:hover:bg-zinc-800"
              >
                <SquarePen className="ml-1 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                <span className="sr-only">Write</span>
              </Button>
            </Link>
            <ThemeModeToggle />
            <Notifications />
            <UserAvatar />
          </div>
        </div>

        {/* Centered not found content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="mx-4 md:mx-8 w-full max-w-md flex flex-col items-center justify-center text-center space-y-4">
            <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-xl font-semibold text-zinc-700 dark:text-gray-200 mb-2">
              Article not found
            </p>
            <Button
              onClick={() => {
                // Implement reload logic
              }}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Reload
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const articleData: BlogArticle = article;

  console.log("Article on screen:", articleData);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (isBookmarked) {
      unsaveArticle(articleData.id);
    } else {
      saveArticle(articleData.id);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-x-hidden">
      {/*  header */}
      {/* border-b border-zinc-200/50 dark:border-zinc-800/50 */}
      <div className="sticky top-0 z-50  bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-sm dark:shadow-zinc-800/20 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Back Button Section */}
            <div className="flex items-center">
              <Link href={`/articles`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="group relative h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 transition-all duration-300 ease-out hover:scale-105 active:scale-95 shadow-sm hover:shadow-md dark:shadow-zinc-800/30"
                >
                  <IoMdArrowRoundBack className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors duration-200" />
                  <span className="sr-only">Back to articles</span>

                  {/* Subtle hover effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                </Button>
              </Link>

              {/* Optional breadcrumb text for larger screens */}
              <div className="hidden md:flex items-center ml-3">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Back to
                </span>
                <span className="ml-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Articles
                </span>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Write Article Button */}
              <Link href={`/writeArticle`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="group relative h-9 sm:h-10 px-3 sm:px-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-zinc-800/50 dark:to-zinc-700/50 dark:hover:from-zinc-700/80 dark:hover:to-zinc-600/80 border-blue-200/60 dark:border-zinc-600/60 hover:border-blue-300/80 dark:hover:border-zinc-500/80 transition-all duration-300 ease-out hover:scale-105 active:scale-95 shadow-sm hover:shadow-md dark:shadow-zinc-800/30"
                >
                  <SquarePen className="h-4 w-4 sm:mr-2 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200" />
                  <span className="hidden sm:inline text-sm font-medium text-blue-700 dark:text-blue-300">
                    Write
                  </span>
                  <span className="sr-only">Write new article</span>

                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                </Button>
              </Link>

              {/* Divider for larger screens */}
              <div className="hidden sm:block w-px h-6 bg-zinc-200 dark:bg-zinc-700" />

              {/* Action Buttons Group */}
              <div className="flex items-center space-x-1">
                {/* Theme Toggle */}
                <div className="relative">
                  <ThemeModeToggle />
                </div>

                {/* Notifications */}
                <div className="relative">
                  <Notifications />
                </div>

                {/* User Avatar */}
                <div className="relative ml-1 sm:ml-2">
                  <UserAvatar />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
      </div>

      {/* Scrollable content */}
      {/* flex-1 overflow-y-auto */}
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-4 md:mx-8 my-8 md:my-16 w-full space-y-8 overflow-x-hidden md:mx-auto md:max-w-3xl"
        >
          {/* article title */}
          <h1 className="my-[24px] text-[2.5rem] md:text-[42px] font-bold leading-tight tracking-tighter text-zinc-800 dark:text-white">
            {articleData?.title || "Untitled Article"}
          </h1>

          {/* author info */}
          <ArticleAuthorInfo
            authorId={articleData?.authorId ?? ""}
            authorProfileImageUrl={
              articleData?.author?.profileImageUrl ??
              "https://www.shutterstock.com/image-vector/young"
            }
            authorName={articleData?.author?.name ?? "Unknown"}
            estimatedReadingTime={articleData?.readTime?.toString() ?? "N/A"}
            articleCreatedAtDate={
              articleData?.createdAt?.toString() ?? "Unknown"
            }
          />

          <Divider />

          {/* meta/interactions */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-4 px-1">
              <div
                className="flex cursor-pointer items-center justify-start space-x-2 transition-all duration-300 group"
                title="Views"
              >
                <AiOutlineEye size={18} className="group-hover:text-blue-500" />
                <div className="mt-1 text-xs">
                  {articleData?._count?.views?.toString() ?? 0}
                </div>
              </div>
              <div
                className="flex cursor-pointer items-center justify-start space-x-2 transition-all duration-300 group"
                title="Claps"
              >
                <FaHandsClapping
                  size={18}
                  className="group-hover:text-green-500"
                />
                <div className="mt-1 text-xs">
                  {articleData?._count?.likes?.toString() ?? 0}
                </div>
              </div>
              <div
                className="flex cursor-pointer items-center justify-start space-x-2 transition-all duration-300 group"
                title="Comments"
              >
                <AiOutlineComment
                  size={18}
                  className="group-hover:text-purple-500"
                />
                <div className="mt-1 text-xs">
                  {articleData?._count?.comments?.toString() ?? 0}
                </div>
              </div>
            </div>
            <div className="flex space-x-4 px-1 transition-all duration-300 dark:text-gray-200">
              <button
                onClick={toggleBookmark}
                className="flex cursor-pointer items-center justify-start space-x-2 transition-all duration-300 group hover:text-blue-600 dark:hover:text-blue-400"
                title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
              >
                {isBookmarked ? (
                  <IoMdBookmark size={18} />
                ) : (
                  <CiBookmarkPlus size={18} />
                )}
              </button>
              <button
                className="flex cursor-pointer items-center justify-start space-x-2 transition-all duration-300 group hover:text-blue-600 dark:hover:text-blue-400"
                title="Share"
              >
                <FaShareFromSquare size={18} />
              </button>
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
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            {/* article main image */}
            <div>
              <Image
                src={
                  articleData?.coverImage ||
                  "https://wcgwzdehnxpexussrkni.supabase.co/storage/v1/object/public/assets//article.avif"
                }
                alt={articleData?.title || "Article Thumbnail"}
                className="h-[22rem] w-full object-cover rounded-xl shadow-md"
                height={320}
                width={768}
              />
            </div>
            {/* article content */}
            <div>
              {articleData?.content ? (
                <div className="prose prose-lg max-w-none dark:prose-invert text-md text-base tracking-tight text-zinc-700 dark:text-gray-100">
                  {articleData.content.split('\\n').map((paragraph, index) => {
                    // Handle markdown headers
                    if (paragraph.startsWith('# ')) {
                      return (
                        <h1 key={index} className="text-3xl font-bold mb-4 text-zinc-800 dark:text-white">
                          {paragraph.substring(2)}
                        </h1>
                      );
                    }
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h2 key={index} className="text-2xl font-bold mb-3 text-zinc-800 dark:text-white">
                          {paragraph.substring(3)}
                        </h2>
                      );
                    }
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={index} className="text-xl font-bold mb-2 text-zinc-800 dark:text-white">
                          {paragraph.substring(4)}
                        </h3>
                      );
                    }
                    // Handle regular paragraphs
                    if (paragraph.trim()) {
                      return (
                        <p key={index} className="mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    }
                    // Handle empty lines as spacing
                    return <div key={index} className="mb-2" />;
                  })}
                </div>
              ) : (
                <blockquote className="text-base font-bold tracking-tight text-zinc-700 dark:text-gray-100">
                  "No content available for this article."
                </blockquote>
              )}
            </div>
          </motion.div>

          <Divider />

          {/* author Card */}
          <ArticleAuthorCard
            authorId={articleData?.authorId!}
            authorImage={
              articleData?.author?.profileImageUrl ??
              "https://www.shutterstock.com/image-vector/young"
            }
            authorName={articleData?.author?.name ?? "Unknown"}
            authorBio={articleData?.author?.shortSummary ?? ""}
            authorFollowers={0}
            haveAlreadyFollowed={false}
          />

          {/* more from  */}
          <MoreFromAuthor authorId={articleData?.authorId!} />

          <Divider />

          {/* recommend   */}
          <RecommendedFromCoursewave />
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleClient;

// ------------------------------------------------------------
const ArticleContentLoadingSkeleton = () => {
  return (
    <div className="h-full min-h-screen justify-center overflow-x-hidden">
      {/* glassy header skeleton */}
      <div className="sticky top-0 z-20 border-stroke flex items-center justify-between border border-b-[1px] px-4 md:px-16 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm">
        <Skeleton className="h-10 w-20 rounded-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
      <div className="mx-4 md:mx-8 my-8 md:my-16 w-full space-y-8 overflow-x-hidden md:mx-auto md:max-w-3xl">
        <Skeleton className="my-[24px] h-[42px] w-2/3" />
        <Skeleton className="h-8 w-1/3 rounded" />
        <Skeleton className="h-4 w-1/4 rounded" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-12 rounded" />
          <Skeleton className="h-6 w-12 rounded" />
          <Skeleton className="h-6 w-12 rounded" />
        </div>
        <Skeleton className="h-[22rem] w-full rounded-xl" />
        <Skeleton className="h-8 w-1/2 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
        <Skeleton className="h-4 w-1/3 rounded" />
        <Skeleton className="h-8 w-1/2 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
        <Skeleton className="h-4 w-1/3 rounded" />
      </div>
    </div>
  );
};
