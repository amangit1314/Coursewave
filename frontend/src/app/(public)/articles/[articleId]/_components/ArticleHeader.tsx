"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { IoMdArrowRoundBack } from "react-icons/io";
import { SquarePen, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { BlogArticle } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import UserAvatar from "@/components/common/UserAvatar";
import Notifications from "@/components/common/NotificationButton";

interface ArticleHeaderProps {
  article: BlogArticle;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section - Back Navigation */}
          <div className="flex items-center space-x-4">
            <Link href="/articles">
              <Button
                variant="ghost"
                size="sm"
                className="group relative h-10 w-10 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all duration-200"
              >
                <IoMdArrowRoundBack className="h-5 w-5 text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                <span className="sr-only">Back to articles</span>
              </Button>
            </Link>
            
            <div className="hidden md:flex items-center space-x-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span>Reading</span>
              <span>•</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {article.title.length > 30 ? `${article.title.substring(0, 30)}...` : article.title}
              </span>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2">
            {/* Article Actions */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <Bookmark className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <Share2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-zinc-800">
                  <DropdownMenuItem>Report article</DropdownMenuItem>
                  <DropdownMenuItem>Follow author</DropdownMenuItem>
                  <DropdownMenuItem>Show more from author</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700" />

            {/* Global Actions */}
            <div className="flex items-center space-x-2">
              <Link href="/writeArticle">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-zinc-800 dark:to-zinc-700 dark:hover:from-zinc-700 dark:hover:to-zinc-600 border-blue-200 dark:border-zinc-600"
                >
                  <SquarePen className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="hidden sm:inline">Write</span>
                </Button>
              </Link>
              
              <ThemeModeToggle />
              <Notifications />
              <UserAvatar />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 