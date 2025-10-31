"use client";

import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import Link from "next/link";
import { FaHandsClapping, FaShareFromSquare } from "react-icons/fa6";
import { AiOutlineComment } from "react-icons/ai";
import { MdMoreHoriz } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserMinus,
  UserPlus,
  Bookmark,
  TrendingUp,
  Share2,
} from "lucide-react";
import { BlogArticle } from "@/types/blog-api-response";
import { ReportArticleDialog } from "../[articleId]/_components/ReportArticleDialog";
import classNames from "classnames";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useArticleLikeStatus,
  useLikeUnlikeArticle,
  useCheckArticleSaved,
  useSaveArticle,
  useUnsaveArticle,
  useFollowUnfollowAuthor,
  useCheckFollowingStatus,
} from "@/hooks/useArticles";
import { IMAGES } from "@/constants/images";

/** Util for category badge */
const formatCategory = (cat?: string) =>
  cat
    ? cat.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "General";

type ArticleCardProps = {
  article: BlogArticle;
};

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const [imgError, setImgError] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Like/Unlike hook
  const { data: isLiked = false, isLoading: isLikeStatusLoading } =
    useArticleLikeStatus(article.id);
  const { mutate: likeUnlike, isPending: isLiking } = useLikeUnlikeArticle();

  // Local state for instant count display (optional, pure react query alone is fine)
  const [likeCount, setLikeCount] = useState(article._count?.BlogLike ?? 0);

  useEffect(() => {
    setLikeCount(article._count?.BlogLike ?? 0);
  }, [article._count?.BlogLike]);

  // Like/unlike handler
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLiking || isLikeStatusLoading) return;
    // Optimistically update count
    setLikeCount((prev) => prev + (isLiked ? -1 : 1));
    likeUnlike(article.id, {
      onError: () => {
        // Rollback
        setLikeCount((prev) => prev + (isLiked ? 1 : -1));
        toast.error("Failed to update like");
      },
    });
  };

  // Save/unsave logic
  const { data: isSaved = false, isLoading: isSavedLoading } =
    useCheckArticleSaved(article.id);
  const { mutate: saveArticle, isPending: isSaving } = useSaveArticle();
  const { mutate: unsaveArticle, isPending: isUnsaving } = useUnsaveArticle();

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSaving || isUnsaving || isSavedLoading) return;
    if (isSaved) {
      unsaveArticle(article.id, {
        onSuccess: () => toast.success("Article removed from Saved"),
        onError: () => toast.error("Failed to unsave"),
      });
    } else {
      saveArticle(article.id, {
        onSuccess: () => toast.success("Article saved"),
        onError: () => toast.error("Failed to save"),
      });
    }
  };

  // Following logic
  const { mutate: followUnfollow, isPending: isFollowingLoading } =
    useFollowUnfollowAuthor();
  const { data: followStatus, isLoading: isFollowingStatusLoading } =
    useCheckFollowingStatus(article.authorId); // or article.author.id if that's your shape

  const isFollowing = !!followStatus?.isFollowing;

  const handleFollowUnfollow = () => {
    if (isFollowingLoading || isFollowingStatusLoading) return;
    followUnfollow(article.authorId, {
      onSuccess: (response) => {
        const action = response.data.action;
        const authorName = response.data.author.name || "the author";
        if (action === "followed") {
          toast.success(`You are now following ${authorName}`, { icon: "👋" });
        } else {
          toast.success(`You unfollowed ${authorName}`, { icon: "👋" });
        }
      },
      onError: (error) => {
        const msg = error?.message || "Something went wrong";
        toast.error(msg, { icon: "❌" });
      },
    });
  };

  const followText =
    isFollowingLoading || isFollowingStatusLoading
      ? "Loading..."
      : isFollowing
        ? "Unfollow Author"
        : "Follow Author";

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

  // Tag color classes
  const tagColor =
    "bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 text-foreground";

  // Calculate read time (in minutes)
  const readMins = Math.max(1, Math.ceil(article.readTime ?? 1));

  return (
    <div className="group relative">
      {/* Hover Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 pointer-events-none" />

      <Link
        href={`/articles/${article.slug}`}
        className={classNames(
          "relative block bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg overflow-hidden transition-all duration-400 ease-in hover:shadow-2xl hover:-translate-y-2 outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        )}
        tabIndex={0}
      >
        {/* Cover image */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30">
          <Image
            src={
              imgError
                ? IMAGES.FALLBACK_IMAGE
                : article.coverImage || IMAGES.FALLBACK_IMAGE
            }
            onError={() => setImgError(true)}
            alt={article.title || "Article cover"}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            height={224}
            width={420}
            priority
            sizes="(min-width: 1024px) 420px, 100vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent z-10 pointer-events-none" />
          {/* Trending Badge */}
          {article._count?.BlogLike > 50 && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold shadow-lg backdrop-blur-sm">
              <TrendingUp className="h-3 w-3" />
              Trending
            </div>
          )}
          {/* Category Badge */}
          <div className="absolute bottom-4 left-4 z-20">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/90 backdrop-blur-md text-white text-xs font-bold tracking-wide shadow-lg border border-white/20">
              {formatCategory(article.Category?.name || article.categoryId)}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="relative p-6 space-y-3 z-20">
          {/* Meta row */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <GoDotFill className="text-primary animate-pulse" size={10} />
            <span>{readMins} min read</span>
          </div>

          {/* Title & description */}
          <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
            {article.title || "Untitled Article"}
          </h3>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {article.excerpt ||
              article.slug?.toString() ||
              "Discover the latest trends and insights that will transform your creative journey and inspire innovation."}
          </p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {article.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={tag + idx}
                  className={`px-3 py-1 rounded-full border text-xs font-medium ${tagColor} hover:bg-primary/20 transition-colors`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Engagement and Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {/* Like / Unlike, Article Comments Count */}
            <div className="flex items-center gap-4">
              {/* Like / Unlike Article */}
              <button
                type="button"
                aria-label={isLiked ? "Unlike Article" : "Like Article"}
                onClick={handleLike}
                disabled={isLiking || isLikeStatusLoading}
                className={classNames(
                  "flex items-center gap-1.5 group transition p-2 rounded-xl",
                  isLiked
                    ? "bg-pink-500/10 text-pink-600 shadow border border-pink-200 dark:border-pink-400"
                    : "hover:bg-pink-500/10 hover:text-pink-600 text-muted-foreground",
                  (isLiking || isLikeStatusLoading) && "opacity-60"
                )}
              >
                <FaHandsClapping
                  className={classNames(
                    "h-4 w-4 transition",
                    isLiked && "fill-pink-600 scale-110 animate-bounce"
                  )}
                />
                <span className="font-bold">
                  {isLiking || isLikeStatusLoading ? "…" : likeCount}
                </span>
              </button>

              {/* Article Comments Count */}
              <span className="flex items-center gap-1.5 text-blue-600">
                <AiOutlineComment className="h-4 w-4" />
                <span className="font-bold">
                  {article._count?.comments ?? 0}
                </span>
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2">
              {/* Bookmark - pass callback/controlled state if you like */}
              <button
                type="button"
                aria-label={isSaved ? "Unsave Article" : "Save Article"}
                onClick={handleBookmark}
                disabled={isSaving || isUnsaving || isSavedLoading}
                className={classNames(
                  "group p-2.5 rounded-xl border border-white/10 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:border-primary/40",
                  isSaved
                    ? "text-primary fill-primary bg-primary/20 border-primary/30 shadow"
                    : "text-muted-foreground group-hover:text-primary",
                  (isSaving || isUnsaving || isSavedLoading) && "opacity-60"
                )}
                tabIndex={0}
              >
                {(isSaving || isUnsaving || isSavedLoading) && (
                  <span className="absolute right-2 top-2 loader" />
                )}

                <Bookmark
                  className={isSaved ? "fill-blue-500 h-4 w-4" : "h-4 w-4"}
                />
              </button>

              {/* Share button */}
              <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    aria-label="Share Article"
                    className="group p-2.5 rounded-xl border border-white/10 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm hover:bg-green-500/10 hover:border-green-300 transition-all duration-300 hover:scale-110"
                    tabIndex={0}
                  >
                    <FaShareFromSquare className="h-4 w-4 text-muted-foreground group-hover:text-green-500" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-2xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-2xl border border-white/10">
                  <DialogTitle className="sr-only" />
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

              {/* More */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label="More options"
                    onClick={(e) => e.preventDefault()}
                    className="p-2.5 rounded-xl border border-white/10 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 hover:scale-110"
                  >
                    <MdMoreHoriz className="h-4 w-4 text-muted-foreground group-hover:text-purple-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 rounded-2xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-2xl border border-white/10 shadow-2xl p-2">
                  <DropdownMenuGroup className="space-y-1">
                    {/* <DropdownMenuItem className="rounded-xl cursor-pointer px-4 py-3 hover:bg-green-500/10 focus:bg-green-500/10 group/item">
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2 rounded-lg bg-green-500/10 group-hover/item:bg-green-500/20 transition-colors">
                          <Eye className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="font-medium flex-1">
                          Show more from author
                        </span>
                        <DropdownMenuShortcut className="text-xs opacity-60">
                          ⇧⌘M
                        </DropdownMenuShortcut>
                      </div>
                    </DropdownMenuItem> */}
                    {/* <DropdownMenuItem className="rounded-xl cursor-pointer px-4 py-3 hover:bg-red-500/10 focus:bg-red-500/10 group/item">
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2 rounded-lg bg-red-500/10 group-hover/item:bg-red-500/20 transition-colors">
                          <EyeOff className="h-4 w-4 text-red-500" />
                        </div>
                        <span className="font-medium flex-1">
                          Show less from author
                        </span>
                        <DropdownMenuShortcut className="text-xs opacity-60">
                          ⌘L
                        </DropdownMenuShortcut>
                      </div>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem
                      className={classNames(
                        "rounded-xl cursor-pointer px-4 py-3 focus:bg-blue-500/10 transition-all group/item",
                        isFollowing
                          ? "hover:bg-red-500/10"
                          : "hover:bg-blue-500/10"
                      )}
                      onClick={handleFollowUnfollow}
                      disabled={isFollowingLoading || isFollowingStatusLoading}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={
                            "p-2 rounded-lg " +
                            (isFollowing
                              ? "bg-red-500/10 group-hover/item:bg-red-500/20"
                              : "bg-blue-500/10 group-hover/item:bg-blue-500/20")
                          }
                        >
                          {isFollowing ? (
                            <UserMinus className="h-4 w-4 text-red-500" />
                          ) : (
                            <UserPlus className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <span className="font-medium flex-1">{followText}</span>
                        <DropdownMenuShortcut className="text-xs opacity-60">
                          ⌘F
                        </DropdownMenuShortcut>
                      </div>
                    </DropdownMenuItem>

                    {/* <DropdownMenuItem className="rounded-xl cursor-pointer px-4 py-3 hover:bg-orange-500/10 focus:bg-orange-500/10 group/item">
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2 rounded-lg bg-orange-500/10 group-hover/item:bg-orange-500/20 transition-colors">
                          <UserMinus className="h-4 w-4 text-orange-500" />
                        </div>
                        <span className="font-medium flex-1">Mute Author</span>
                        <DropdownMenuShortcut className="text-xs opacity-60">
                          ⌘M
                        </DropdownMenuShortcut>
                      </div>
                    </DropdownMenuItem> */}
                  </DropdownMenuGroup>
                  <div className="h-px bg-white/5 my-2" />
                  <DropdownMenuItem asChild>
                    <ReportArticleDialog articleId={article.id} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
