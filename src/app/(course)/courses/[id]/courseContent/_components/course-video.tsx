"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import useUserInfo from "@/hooks/use-user-info";
import { absoluteUrl, cn } from "@/utils/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Chapter, MuxData } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

type CourseVideoProps = {
  // playbackId?: string | null;
  // videoId?: string;
  // videoTitle?: string;
  viewerUserId?: string;
  activeChapter: Chapter;
  // course: Course;
  // userId: string;
  // muxData: MuxData;
  // nextChapter: Chapter;
  // courseProgress: CourseProgress;
  // purchase: Purchase;
};

const CourseVideo = ({
  // playbackId,
  // videoId,
  // videoTitle,
  viewerUserId,
  activeChapter,
  // course,
  // userId,
  // muxData,
  // nextChapter,
  // courseProgress,
  // purchase,
}: CourseVideoProps) => {
  const fetchChapterMuxData = async () => {
    const response = await fetch(
      absoluteUrl(
        `/api/courses/${activeChapter?.courseId!}/chapters/${activeChapter?.id!}/muxData`
      )
    );

    if (!response.ok) {
      console.log("Failed to fetch chapter muxData ...");
    }

    const data = await response.json();

    console.log("Active Chapter MuxData: ", data);

    return data;
  };

  const {
    data: chapterMuxData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chapterMuxData"],
    queryFn: fetchChapterMuxData,
    staleTime: 4,
  });

  if (isLoading) {
    return <div>Loading video data...</div>;
  }

  if (error) {
    return <div>Error fetching video data</div>;
  }

  const muxData: MuxData = chapterMuxData?.data;
  console.log("MuxData response: ", muxData);

  // const chapter = activeChapter;

  // const {
  //   chapter,
  //   course,
  //   muxData,
  //   attachments,
  //   nextChapter,
  //   courseProgress,
  //   purchase,
  // } = await getChapter({
  //   userId,
  //   chapterId: activeChapter.id,
  //   courseId: activeChapter.courseId,
  // });

  // const chapter = await getChapter({
  //   userId,
  //   courseId: activeChapter.courseId,
  //   chapterId: activeChapter.id,
  // });
  // const muxData = chapter.muxData;
  // const purchase = chapter.purchase;
  // const courseProgress = chapter.courseProgress;

  // const muxData = await getMuxData(activeChapter.courseId);
  // const purchase = await getCoursePurchase(activeChapter.courseId, userId);
  // const courseProgress = await getCourseProgress(
  //   activeChapter.courseId,
  //   userId
  // );
  // const courseProgress = await getProgress(activeChapter.courseId, userId);

  // if (!activeChapter || !course) {
  //   return redirect("/browseCourses");
  // }

  // const isLocked = !activeChapter.isFree && !purchase;
  // const completeOnEnd = !!purchase && !(courseProgress?.progress! === 100);

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
    <MuxPlayer
      title={activeChapter.title}
      playbackId={
        muxData?.playbackId! ?? "EcHgOK9coz5K4rjSwOkoE7Y7O01201YMIC200RI6lNxnhs"
      }
      accentColor="blue"
      autoPlay
      className="smooth-content w-xl h-xl md:h-[360px] overflow-hidden rounded-lg object-cover md:w-[45rem] bg-blue-200"
      // metadata={{
      //   video_id: muxData?.id,
      //   asset_id: muxData?.assetId,
      //   // video_id: videoId ? videoId : "video-id-54321",
      //   // video_title: videoTitle ? videoTitle : "Test video title",
      //   viewer_user_id: viewerUserId ? viewerUserId : "user-id-007",
      // }}
    />

    // *** version 3
    // <VideoPlayer
    //   chapterId={muxData?.chapterId}
    //   title={activeChapter.title}
    //   courseId={activeChapter.courseId}
    //   // nextChapterId={nextChapter?.id}
    //   playbackId={muxData?.playbackId!}
    //   isLocked={false}
    //   completeOnEnd={true}
    // />
  );
};

export default CourseVideo;

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
          }
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
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
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
