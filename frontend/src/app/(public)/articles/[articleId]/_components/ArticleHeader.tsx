"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  SquarePen,
  Bookmark,
  Share2,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { BlogArticle } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import UserAvatar from "@/components/common/UserAvatar";
import Notifications from "@/components/common/NotificationButton";
import toast from "react-hot-toast";
import { ReportArticleDialog } from "./ReportArticleDialog";
import SaveArticleButton from "./SaveArticleButton";

interface ArticleHeaderProps {
  article: BlogArticle;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Get complete article URL
  const articleUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_APP_URL}/articles/${article.slug || article.id}`;

  // Handle sharing
  const handleShare = async (
    method: "copy" | "twitter" | "linkedin" | "facebook"
  ) => {
    const shareText = `Check out this article: ${article.title}`;

    try {
      switch (method) {
        case "copy":
          await navigator.clipboard.writeText(articleUrl);
          toast.success("Article link copied to clipboard");
          break;

        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(articleUrl)}`,
            "_blank"
          );
          break;

        case "linkedin":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
            "_blank"
          );
          break;

        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}&quote=${encodeURIComponent(shareText)}`,
            "_blank"
          );
          break;
      }

      setIsShareOpen(false);
    } catch (error) {
      toast.error("Failed to share article");
    }
  };

  // Native share (for mobile devices)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `Check out this article: ${article.title}`,
          url: articleUrl,
        });
        setIsShareOpen(false);
      } catch (error) {
        // User cancelled the share
        console.log("Share cancelled");
      }
    } else {
      // Fallback to copy link
      handleShare("copy");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-br from-background/98 via-background/95 to-primary/5 backdrop-blur-2xl border-b border-white/10 shadow-lg">
      {/* Animated gradient line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-blue-500 to-cyan-500 animate-gradient" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section - Back Navigation */}
          <div className="flex items-center space-x-4">
            <Link href="/articles">
              <Button
                variant="ghost"
                size="sm"
                className="group relative h-11 w-11 rounded-2xl bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border border-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <IoMdArrowRoundBack className="relative h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="sr-only">Back to articles</span>
              </Button>
            </Link>

            <div className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-xl border border-white/5">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">
                  Reading
                </span>
              </div>
              <span className="text-muted-foreground/50">•</span>
              <span className="text-sm font-semibold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-black dark:text-white">
                {article?.title?.length > 30
                  ? `${article?.title?.substring(0, 30)}...`
                  : article?.title}
              </span>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            {/* Article Actions */}
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-2xl bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-xl border border-white/5">
              <SaveArticleButton articleId={article.id} />

              {/* Share Dialog */}
              <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group relative h-10 px-4 rounded-xl hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 transition-all duration-300"
                  >
                    <Share2 className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-green-500 group-hover:rotate-12 transition-all" />
                    <span className="hidden sm:inline text-sm font-medium text-muted-foreground group-hover:text-green-500 transition-colors">
                      Share
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-2xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-2xl border border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-center bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                      Share this article
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col space-y-4 p-4">
                    {/* URL Preview */}
                    <div className="text-xs text-muted-foreground bg-white/5 rounded-lg p-3 break-all">
                      {articleUrl}
                    </div>

                    {/* Native share button (for mobile) */}
                    {typeof navigator !== "undefined" &&
                      typeof navigator.share === "function" && (
                        <Button
                          onClick={handleNativeShare}
                          className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share via...
                        </Button>
                      )}

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => handleShare("copy")}
                        variant="outline"
                        className="rounded-xl py-3 border-white/10 hover:bg-green-500/10 hover:border-green-500/30"
                      >
                        📋 Copy Link
                      </Button>
                      <Button
                        onClick={() => handleShare("twitter")}
                        variant="outline"
                        className="rounded-xl py-3 border-white/10 hover:bg-blue-500/10 hover:border-blue-500/30"
                      >
                        𝕏 Twitter
                      </Button>
                      <Button
                        onClick={() => handleShare("linkedin")}
                        variant="outline"
                        className="rounded-xl py-3 border-white/10 hover:bg-blue-600/10 hover:border-blue-600/30"
                      >
                        💼 LinkedIn
                      </Button>
                      <Button
                        onClick={() => handleShare("facebook")}
                        variant="outline"
                        className="rounded-xl py-3 border-white/10 hover:bg-blue-800/10 hover:border-blue-800/30"
                      >
                        📘 Facebook
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group h-10 w-10 p-0 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-blue-500/10 transition-all duration-300"
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 rounded-2xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-2xl border border-white/10 shadow-2xl p-2"
                >
                  <DropdownMenuItem asChild>
                    <ReportArticleDialog articleId={article.id} />
                  </DropdownMenuItem>

                  {/* <DropdownMenuItem className="rounded-xl px-4 py-3 cursor-pointer hover:bg-blue-500/10 focus:bg-blue-500/10 transition-all group/item">
                    <div className="flex items-center gap-3 w-full">
                      <div className="p-2 rounded-lg bg-blue-500/10 group-hover/item:bg-blue-500/20 transition-colors">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                      </div>
                      <span className="font-medium">Follow author</span>
                    </div>
                  </DropdownMenuItem> */}
                  {/* <DropdownMenuItem className="rounded-xl px-4 py-3 cursor-pointer hover:bg-blue-500/10 focus:bg-blue-500/10 transition-all group/item">
                    <div className="flex items-center gap-3 w-full">
                      <div className="p-2 rounded-lg bg-blue-500/10 group-hover/item:bg-blue-500/20 transition-colors">
                        <SquarePen className="h-4 w-4 text-blue-500" />
                      </div>
                      <span className="font-medium">Show more from author</span>
                    </div>
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Divider with gradient */}
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            {/* Global Actions */}
            <div className="flex items-center gap-2">
              <Link href="/writeArticle">
                <Button
                  variant="outline"
                  size="sm"
                  className="group relative h-10 px-5 rounded-2xl bg-gradient-to-r from-primary/10 via-blue-500/10 to-cyan-500/10 hover:from-primary/20 hover:via-blue-500/20 hover:to-cyan-500/20 border border-primary/30 hover:border-primary/50 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                  <SquarePen className="relative h-4 w-4  text-primary group-hover:rotate-12 transition-transform" />
                  <span className="relative hidden sm:inline font-semibold bg-gradient-to-r from-white to-blue-50 bg-clip-text text-transparent">
                    Write
                  </span>
                </Button>
              </Link>

              <div className="flex items-center gap-2 px-2 py-1.5 rounded-2xl bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-xl border border-white/5">
                <ThemeModeToggle />
                <Notifications />
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-500 to-cyan-500 rounded-full opacity-20 blur animate-pulse" />
                  <UserAvatar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </header>
  );
}
