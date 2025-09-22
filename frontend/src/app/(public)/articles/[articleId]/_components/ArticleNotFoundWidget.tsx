import Notifications from "@/components/common/NotificationButton";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw, SquarePen } from "lucide-react";
import React from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

type Props = {};

const ArticleNotFoundWidget = (props: Props) => {
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
};

export default ArticleNotFoundWidget;
