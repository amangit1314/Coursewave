"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { ThemeModeToggle } from "@/app/(shared)/Header/theme-mode-toggle";
// import { Notifications } from "@/app/(shared)/Header/notifications";
// import { UserAvatar } from "@/app/(shared)/Header/user-avatar";
import { IoMdArrowRoundBack } from "react-icons/io";
import { SquarePen, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { BlogArticle } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeModeToggle } from "@/app/(shared)/theme-mode-toggle";
import Notifications from "@/app/(shared)/notification-button";
import UserAvatar from "@/app/(shared)/user-avatar";

interface ArticleHeaderProps {
  article: BlogArticle;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section - Back Navigation */}
          <div className="flex items-center space-x-4">
            <Link href="/articles">
              <Button
                variant="ghost"
                size="sm"
                className="group relative h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <IoMdArrowRoundBack className="h-5 w-5 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors" />
                <span className="sr-only">Back to articles</span>
              </Button>
            </Link>
            
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Reading</span>
              <span>•</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
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
                className="h-9 px-3 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <Bookmark className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <Share2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>Report article</DropdownMenuItem>
                  <DropdownMenuItem>Follow author</DropdownMenuItem>
                  <DropdownMenuItem>Show more from author</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Global Actions */}
            <div className="flex items-center space-x-2">
              <Link href="/writeArticle">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-slate-800 dark:to-slate-700 dark:hover:from-slate-700 dark:hover:to-slate-600 border-blue-200 dark:border-slate-600"
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