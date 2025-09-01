// app/(course)/courses/[courseId]/courseContent/_components/CourseVideo.tsx

import React from "react";
import { Chapter } from "@/types/course-details-api-response";

interface CourseVideoProps {
  chapter: Chapter | null;
}

const CourseVideo: React.FC<CourseVideoProps> = ({ chapter }) => {
  if (!chapter || chapter.contentType !== "VIDEO") {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-800">
        <span className="text-gray-500 dark:text-gray-400">
          No video available for this chapter.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg bg-black shadow-lg">
      <video
        key={chapter.id}
        src={chapter.content.videoUrl}
        controls
        className="h-full w-full"
        poster={chapter.content.thumbnailUrl || undefined}
        onEnded={() => {
          // You can handle marking as complete or progress update here
        }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default CourseVideo;
