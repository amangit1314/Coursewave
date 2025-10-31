// "use client";

// import React from "react";
// import Image from "next/image";
// import { Separator } from "@/components/ui/separator";
// import { useGetUserById } from "@/hooks/useGetUserById";
// import { IMAGES } from "@/constants/images";
// import { STATIC_DATA } from "@/constants/staticData";

// const ArticleAuthorCard = ({
//   authorId,
//   authorImage,
//   authorName,
//   authorBio,
//   authorFollowers,
//   haveAlreadyFollowed,
// }: {
//   authorId: string;
//   authorImage: string;
//   authorName: string;
//   authorBio: string;
//   authorFollowers: number;
//   haveAlreadyFollowed: boolean;
// }) => {

//   return (
//     <div className="my-8 flex flex-col space-y-4">
//       <Image
//         src={authorImage ? authorImage : IMAGES.DEFAULT_AVATAR}
//         alt="Author image"
//         height={60}
//         width={60}
//         className="h-[60px] w-[60px] cursor-pointer rounded-full transition-all duration-200 hover:shadow-xl"
//       />

//       <div className="md:ml-2">
//         <div className="flex flex-col items-start justify-start space-y-2 text-sm">
//           <div className="flex w-full items-center justify-between">
//             <p className="text-base font-medium tracking-tight text-zinc-800 dark:text-gray-200">
//               Written by{" "}
//               <span className="cursor-pointer font-bold transition-all duration-200 hover:underline dark:text-white">
//                 {authorName ? authorName : "Author Name"}
//               </span>
//             </p>

//             <p className="border-stroke ml-auto cursor-pointer rounded-badge border px-4 py-2 text-center text-xs text-green-700 transition-all duration-200 hover:bg-green-700 hover:text-white">
//               {haveAlreadyFollowed ? "Followed" : "Follow"}
//             </p>
//           </div>

//           <p className="text-sm font-medium text-zinc-700 dark:text-gray-200">
//             <span className="font-bold tracking-tight text-zinc-950 dark:text-white">
//               {authorFollowers ?? 100}
//             </span>{" "}
//             Followers
//           </p>

//           <blockquote className="line-clamp-4 text-sm font-medium text-zinc-700 dark:text-gray-200">
//             {authorBio ? authorBio : STATIC_DATA.sampleBio}
//           </blockquote>
//         </div>

//         <Separator className="my-4" />
//       </div>
//     </div>
//   );
// };

// export default ArticleAuthorCard;

"use client";

import React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useGetUserById } from "@/hooks/useGetUserById";
import { IMAGES } from "@/constants/images";
import { STATIC_DATA } from "@/constants/staticData";
import {
  useFollowUnfollowAuthor,
  useCheckFollowingStatus,
  useAuthorFollowerCount,
} from "@/hooks/useArticles";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ArticleAuthorCard = ({
  blogId,
  authorId,
  authorImage,
  authorName,
  authorBio,
}: {
  blogId: string;
  authorId: string;
  authorImage: string;
  authorName: string;
  authorBio: string;
}) => {
  const { mutate: followUnfollow, isPending: isFollowingLoading } =
    useFollowUnfollowAuthor();
  const { data: followStatus } = useCheckFollowingStatus(blogId);
  const { data: followerCountData } = useAuthorFollowerCount(blogId);

  const isFollowing = followStatus?.isFollowing || false;
  const followerCount = followerCountData?.followerCount || 0;

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
    const baseClass =
      "border-stroke ml-auto cursor-pointer rounded-badge border px-4 py-2 text-center text-xs transition-all duration-200";

    if (isFollowingLoading) {
      return `${baseClass} bg-gray-300 text-gray-600 cursor-not-allowed`;
    }

    if (isFollowing) {
      return `${baseClass} bg-green-700 text-white hover:bg-green-800`;
    }

    return `${baseClass} text-green-700 hover:bg-green-700 hover:text-white`;
  };

  return (
    <div className="my-8 flex flex-col space-y-4">
      <Image
        src={authorImage ? authorImage : IMAGES.DEFAULT_AVATAR}
        alt="Author image"
        height={60}
        width={60}
        className="h-[60px] w-[60px] cursor-pointer rounded-full transition-all duration-200 hover:shadow-xl"
      />

      <div className="md:ml-2">
        <div className="flex flex-col items-start justify-start space-y-2 text-sm">
          <div className="flex w-full items-center justify-between">
            <p className="text-base font-medium tracking-tight text-zinc-800 dark:text-gray-200">
              Written by{" "}
              <span className="cursor-pointer font-bold transition-all duration-200 hover:underline dark:text-white">
                {authorName ? authorName : "Author Name"}
              </span>
            </p>
            {isFollowingLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <button
                onClick={handleFollowClick}
                disabled={isFollowingLoading}
                className={getFollowButtonClass()}
              >
                {getFollowButtonText()}
              </button>
            )}
          </div>

          <p className="text-sm font-medium text-zinc-700 dark:text-gray-200">
            <span className="font-bold tracking-tight text-zinc-950 dark:text-white">
              {followerCount}
            </span>{" "}
            Followers
          </p>

          <blockquote className="line-clamp-4 text-sm font-medium text-zinc-700 dark:text-gray-200">
            {authorBio ? authorBio : STATIC_DATA.sampleBio}
          </blockquote>
        </div>

        <Separator className="my-4" />
      </div>
    </div>
  );
};

export default ArticleAuthorCard;
