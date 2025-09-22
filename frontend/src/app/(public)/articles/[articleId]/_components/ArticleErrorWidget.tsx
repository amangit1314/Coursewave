import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, SquarePen } from 'lucide-react';
import React from 'react'
import Link from 'next/link'
import { IoMdArrowRoundBack } from 'react-icons/io';
import { ThemeModeToggle } from '@/components/common/ThemeModeToggle';
import Notifications from '@/components/common/NotificationButton';
import UserAvatar from '@/components/common/UserAvatar';

type Props = {
    error: any
}

const ArticleErrorWidget = (props: Props) => {
  return (
        <div className="h-full flex flex-col">
          {/*  header */}
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
                {props.error?.message}
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

export default ArticleErrorWidget