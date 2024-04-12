import { Chapter, Course, CourseProgress, Purchase } from "@prisma/client";
import { VideoPlayer } from "./video-player";
import { redirect } from "next/navigation";

const CourseVideo = ({
  activeChapter,
  course,
  muxData,
  nextChapter,
  courseProgress,
  purchase,
}: {
  activeChapter: Chapter;
  course: Course;
  muxData: any;
  nextChapter: Chapter;
  courseProgress: CourseProgress;
  purchase: Purchase;
}) => {
  const chapter = activeChapter;

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

  if (!chapter || !course) {
    return redirect("/browseCourses");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !courseProgress?.isCompleted;

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
    //   playbackId="EcHgOK9coz5K4rjSwOkoE7Y7O01201YMIC200RI6lNxnhs"
    //   accentColor="blue"
    //   className="smooth-content w-xl h-xl md:h-[360px] overflow-hidden rounded-lg object-cover md:w-[45rem] bg-blue-200"
    //   metadata={{
    //     video_id: "video-id-54321",
    //     video_title: "Test video title",
    //     viewer_user_id: "user-id-007",
    //   }}
    // />

    // *** version 3
    <VideoPlayer
      chapterId={activeChapter.id}
      title={activeChapter.title}
      courseId={activeChapter.courseId}
      nextChapterId={nextChapter?.id}
      playbackId={muxData?.playbackId!}
      isLocked={isLocked}
      completeOnEnd={completeOnEnd}
    />
  );
};

export default CourseVideo;
