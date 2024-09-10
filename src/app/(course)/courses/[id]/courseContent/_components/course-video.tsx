"use client";

import React from "react";
import axios from "axios";
import { cn } from "@/utils/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Chapter, CloudinaryData } from "@prisma/client";
import { useConfettiStore } from "@/hooks/useConfettiStore";

type CourseVideoProps = {
  // viewerUserId?: string;
  // videoPublicId: string;
  activeChapter: Chapter;
};

const CourseVideo = ({ activeChapter }: CourseVideoProps) => {
  const cloudName = "df2g8tcxq";

  const fetchChapterCloudinaryData = async () => {
    const url =
      process.env.ENVIRONMENT! === "DEVELOPMENT"
        ? `/api/courses/${activeChapter?.courseId!}/chapters/${activeChapter?.id!}/cloudinaryData`
        : `api/courses/${activeChapter?.courseId!}/chapters/${activeChapter?.id!}/cloudinaryData`;

    const response = await fetch(url);

    if (!response.ok) {
      console.log("Failed to fetch chapter cloudinaryData ...");
    }

    const data = await response.json();
    console.log("Active Chapter CloudinaryData: ", data);
    return data;
  };

  const {
    data: chapterCloudinaryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chapterCloudinaryData"],
    queryFn: fetchChapterCloudinaryData,
    staleTime: 4,
  });

  // const fetchChapterMuxData = async () => {
  //   const response = await fetch(
  //     `/api/courses/${activeChapter?.courseId!}/chapters/${activeChapter?.id!}/muxData`
  //   );
  //   if (!response.ok) {
  //     console.log("Failed to fetch chapter muxData ...");
  //   }
  //   const data = await response.json();
  //   console.log("Active Chapter MuxData: ", data);
  //   return data;
  // };

  // const {
  //   data: chapterMuxData,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["chapterMuxData"],
  //   queryFn: fetchChapterMuxData,
  //   staleTime: 4,
  // });

  // const muxData: MuxData = chapterMuxData?.data;
  // console.log("MuxData response: ", muxData);

  if (isLoading) return <VideoPlayerLoadingSkeleton />;
  if (error) return <div>Error fetching video data</div>;

  const cloudinaryData = chapterCloudinaryData?.data! as CloudinaryData;
  console.log("Cloudinary Data response: ", cloudinaryData);

  const videoPublicId = cloudinaryData.publicId;

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
    <iframe
      src={`https://player.cloudinary.com/embed/?cloud_name=${cloudName}&public_id=${videoPublicId}`}
      // src={"https://static.vecteezy.com/system/resources/previews/011/365/806/mp4/sweet-mammal-pet-cat-video.mp4"}
      allow="fullscreen"
      height={360}
      width={720}
      allowFullScreen
      className="smooth-content w-xl h-xl overflow-hidden rounded-xl bg-blue-200 object-cover dark:bg-slate-700 md:h-[360px] md:w-[45rem]"
    />
  );
};

export default CourseVideo;

const VideoPlayerLoadingSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-[360px] w-[720px] rounded-xl" />
    </div>
  );
};

// <--------------------------------------------------------------------------------->
type VideoPlayerProps = {
  playbackId: string;
  courseId: string;
  chapterId: string;
  // nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
};

export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  // nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = React.useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();
  const user = useUserInfo();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/profile/${user.user.id}/enrolledCourses/${courseId}/sections/sectionId/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          },
        );

        // if (!nextChapterId) {
        //   confetti.onOpen();
        // }

        toast.success("Progress updated");
        router.refresh();

        // if (nextChapterId) {
        //   router.push(
        //     `/api/profile/${user.user.id}/enrolledCourses/${courseId}/sections/sectionId/chapters/${nextChapterId}`
        //   );
        // }
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
};
