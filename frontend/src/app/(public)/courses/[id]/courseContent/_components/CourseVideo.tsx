/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { cn } from "@/lib/utils/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
// import { Chapter, CloudinaryData } from "@prisma/client";
import { useConfettiStore } from "@/hooks/useConfettiStore";
import { useCoursesStore } from "@/zustand/coursesStore";
import { Chapter } from "@/types/course-details-api-response";

type CourseVideoProps = {
  // courseId: string;
  // viewerUserId?: string;
  // videoPublicId: string;
  // activeChapter: Chapter;
  url: string;
};

const CourseVideo = ({
  // activeChapter,
  url,
}: CourseVideoProps) => {
  const cloudName = "df2g8tcxq";

  // const { fetchCourseCloudinaryData, cloudinaryDatas } = useCoursesStore();

  // useEffect(() => {
  //   if (activeChapter) {
  //     fetchCourseCloudinaryData(activeChapter.courseId);
  //   }
  // }, [fetchCourseCloudinaryData, activeChapter]);

  // // Find the cloudinary data for the active chapter
  // const videoData = cloudinaryDatas.find(
  //   (data) => data.chapterId === activeChapter.id,
  // );

  // Extract the videoPublicId from the matched cloudinary data
  // const videoPublicId = videoData?.publicId;
  return (
    // * version 1
    // <Video
    //   accentColor="blue"
    //   className="smooth-content w-xl h-xl md:h-[360px] overflow-hidden rounded-lg object-cover md:w-[45rem] bg-blue-200"
    //   src={
    //     activeChapter
    //       ? activeChapter.videoUrl ?? "/assets/videos/4k.mp4"
    //       : "/assets/videos/4k.mp4"
    //   }
    // />

    // ** version 2
    // <MuxPlayer
    //   title={activeChapter.title}
    //   playbackId={
    //     muxData?.playbackId! ?? "EcHgOK9coz5K4rjSwOkoE7Y7O01201YMIC200RI6lNxnhs"
    //   }
    //   accentColor="blue"
    //   autoPlay
    //   className="smooth-content w-xl h-xl md:h-[360px] overflow-hidden rounded-lg object-cover md:w-[45rem] bg-blue-200"
    // />

    // *** version 3
    // <VideoPlayer
    //   chapterId={muxData?.chapterId}
    //   title={activeChapter.title}
    //   courseId={activeChapter.courseId}
    //   playbackId={muxData?.playbackId!}
    //   isLocked={false}
    //   completeOnEnd={true}
    // />

    // *** version 4
    // videoPublicId ? (
    //   <iframe
    //     src={`https://player.cloudinary.com/embed/?cloud_name=${cloudName}&public_id=${videoPublicId}`}
    //     allow="fullscreen"
    //     height={360}
    //     width={720}
    //     allowFullScreen
    //     className="smooth-content w-xl h-xl overflow-hidden rounded-xl bg-blue-200 object-cover dark:bg-slate-700 md:h-[360px] md:w-[45rem]"
    //   />
    // ) : (
    //   <VideoPlayerLoadingSkeleton />
    // )

    // *** version 5
    <iframe
      src={url}
      allow="fullscreen"
      height={360}
      width={720}
      allowFullScreen
      className="smooth-content w-xl h-xl object-cover my-4 overflow-hidden rounded-xl bg-blue-200 object-cover dark:bg-slate-700 md:h-[360px] md:w-[45rem]"
    />
  );
};

// export default CourseVideo;

const VideoPlayerLoadingSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-[360px] w-[720px] rounded-xl" />
    </div>
  );
};

// <--------------------------------------------------------------------------------->
// type VideoPlayerProps = {
//   playbackId: string;
//   courseId: string;
//   chapterId: string;
//   // nextChapterId?: string;
//   isLocked: boolean;
//   completeOnEnd: boolean;
//   title: string;
// };

// export const VideoPlayer = ({
//   playbackId,
//   courseId,
//   chapterId,
//   // nextChapterId,
//   isLocked,
//   completeOnEnd,
//   title,
// }: VideoPlayerProps) => {
//   const [isReady, setIsReady] = React.useState(false);
//   const router = useRouter();
//   const confetti = useConfettiStore();
//   const user = useUserInfo();

//   const onEnd = async () => {
//     try {
//       if (completeOnEnd) {
//         await axios.put(
//           `/api/profile/${user.user.id}/enrolledCourses/${courseId}/sections/sectionId/chapters/${chapterId}/progress`,
//           {
//             isCompleted: true,
//           },
//         );

//         // if (!nextChapterId) {
//         //   confetti.onOpen();
//         // }

//         toast.success("Progress updated");
//         router.refresh();

//         // if (nextChapterId) {
//         //   router.push(
//         //     `/api/profile/${user.user.id}/enrolledCourses/${courseId}/sections/sectionId/chapters/${nextChapterId}`
//         //   );
//         // }
//       }
//     } catch {
//       toast.error("Something went wrong");
//     }
//   };

//   return (
//     <div className="relative aspect-video">
//       {!isReady && !isLocked && (
//         <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
//           <Loader2 className="h-8 w-8 animate-spin text-secondary" />
//         </div>
//       )}
//       {isLocked && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary">
//           <Lock className="h-8 w-8" />
//           <p className="text-sm">This chapter is locked</p>
//         </div>
//       )}
//       {!isLocked && (
//         <MuxPlayer
//           title={title}
//           className={cn(!isReady && "hidden")}
//           onCanPlay={() => setIsReady(true)}
//           onEnded={onEnd}
//           autoPlay
//           playbackId={playbackId}
//         />
//       )}
//     </div>
//   );
// };
