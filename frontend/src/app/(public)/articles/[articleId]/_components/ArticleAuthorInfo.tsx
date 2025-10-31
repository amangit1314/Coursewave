
"use client";

import React from "react";
import Image from "next/image";

import { IMAGES } from "@/constants/images";
import {
  useFollowUnfollowAuthor,
  useCheckFollowingStatus,
} from "@/hooks/useArticles";
import toast from "react-hot-toast";
import Link from "next/link";

type ArticleAuthorInfoProps = {
  authorId: string;
  authorProfileImageUrl: string | null;
  authorName: string | null;
  estimatedReadingTime: string;
  articleCreatedAtDate: string;
  blogId: string; // Add blogId for follow functionality
};

const ArticleAuthorInfo = ({
  authorId,
  authorProfileImageUrl,
  authorName,
  estimatedReadingTime,
  articleCreatedAtDate,
  blogId, // Add blogId prop
}: ArticleAuthorInfoProps) => {
  const { mutate: followUnfollow, isPending: isFollowingLoading } =
    useFollowUnfollowAuthor();
  const { data: followStatus } = useCheckFollowingStatus(blogId);

  const isFollowing = followStatus?.isFollowing || false;

  const handleFollowClick = () => {
    if (!isFollowingLoading) {
      followUnfollow(blogId, {
        onSuccess: (response) => {
          const action = response.data.action;
          const authorName = response.data.author.name;

          if (action === "followed") {
            toast.success(`You are now following ${authorName}`, {
              duration: 4000,
              position: "bottom-right",
              icon: "👋",
            });
          } else {
            toast.success(`You unfollowed ${authorName}`, {
              duration: 4000,
              position: "bottom-right",
              icon: "👋",
            });
          }
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong";

          if (errorMessage.includes("cannot follow/unfollow yourself")) {
            toast.error("You cannot follow yourself", {
              duration: 4000,
              position: "bottom-right",
              icon: "❌",
            });
          } else if (
            errorMessage.includes("Blog not found") ||
            errorMessage.includes("Author not found")
          ) {
            toast.error("Author not found", {
              duration: 4000,
              position: "bottom-right",
              icon: "❌",
            });
          } else {
            toast.error(errorMessage, {
              duration: 4000,
              position: "bottom-right",
              icon: "❌",
            });
          }
        },
      });
    }
  };

  const getFollowButtonText = () => {
    if (isFollowingLoading) {
      return "Loading...";
    }
    return isFollowing ? "Following" : "Follow";
  };

  const getFollowButtonClass = () => {
    const baseClass = "cursor-pointer text-xs transition-all duration-200";

    if (isFollowingLoading) {
      return `${baseClass} text-gray-400 cursor-not-allowed`;
    }

    if (isFollowing) {
      return `${baseClass} text-green-600 hover:text-green-700 font-medium`;
    }

    return `${baseClass} text-green-500 hover:text-green-600`;
  };

  const date = new Date(articleCreatedAtDate);
  const formattedArticleDate = date.toLocaleDateString("en-GB");

  return (
    <div className="flex space-x-4">
      <Link href={`/authors/${authorId}`}  className="block" >
        <Image
          src={authorProfileImageUrl ?? IMAGES.SAMPLE_PERSON_1}
          alt={`${authorName}'s profile`}
          height={40}
          width={40}
          className="h-[40px] w-[40px] rounded-full object-cover"
        />
      </Link>

      <div className="">
        <div className="flex items-center justify-start space-x-2 text-sm">
          <p className="text-base font-semibold text-zinc-800 dark:text-white">
            {authorName ?? "Author Name"}
          </p>
          <button
            onClick={handleFollowClick}
            disabled={isFollowingLoading}
            className={getFollowButtonClass()}
          >
            {getFollowButtonText()}
          </button>
        </div>
        <div className="flex items-center justify-start space-x-2 text-xs dark:text-gray-400">
          <p>{estimatedReadingTime ?? 5} min read, </p>
          <p className="font-medium">
            {formattedArticleDate ?? "Nov 18, 2023"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArticleAuthorInfo;
