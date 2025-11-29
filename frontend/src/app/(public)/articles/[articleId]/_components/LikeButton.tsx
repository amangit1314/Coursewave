"use client";

import { useArticleLikeStatus, useLikeUnlikeArticle } from "@/hooks/useArticles";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";


type Props = {
  likes: number;
  articleId: string;
};

const LikeButton = (props: Props) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(props.likes);

  const { data: likeStatus, isLoading: isCheckingStatus } = useArticleLikeStatus(props.articleId);
  const { mutate: toggleLike, isPending: isToggling } = useLikeUnlikeArticle();

  // Set initial state when like status is loaded
  useEffect(() => {
    if (likeStatus) {
      setIsLiked(likeStatus);
    }
  }, [likeStatus]);

  // Sync likes count with props
  useEffect(() => {
    setLikesCount(props.likes);
  }, [props.likes]);

  const handleLike = () => {
    if (isToggling || isCheckingStatus) return;

    // Optimistic update
    const previousLiked = isLiked;
    const previousLikesCount = likesCount;

    setIsLiked(!previousLiked);
    setLikesCount(previousLiked ? previousLikesCount - 1 : previousLikesCount + 1);

    // Call the mutation
    toggleLike(props.articleId, {
      onSuccess: () => {
        // Show success toast (optional)
        // if (!previousLiked) {
        //   toast.success("Article liked! 👏");
        // }
      },
      onError: (error: unknown) => {
        // Revert optimistic update on error
        setIsLiked(previousLiked);
        setLikesCount(previousLikesCount);
        console.error("Failed to toggle like:", error);
        // toast.error("Failed to update like. Please try again.");
      }
    });
  };

  // Show loading state while checking initial status
  if (isCheckingStatus) {
    return (
      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 opacity-50">
        <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <Heart className="h-3.5 w-3.5" />
        </div>
        <span className="text-sm font-medium min-w-[20px]">
          {likesCount}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={handleLike}
      disabled={isToggling}
      className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className={`p-1.5 rounded-lg transition-all duration-200 ${isLiked
          ? 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400'
          : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/20'
        }`}>
        <Heart
          className={`h-3.5 w-3.5 transition-all duration-200 ${isLiked ? 'fill-current' : ''
            }`}
        />
      </div>
      <span className="text-sm font-medium min-w-[20px]">
        {likesCount}
      </span>
    </button>
  );
};

export default LikeButton;