
"use client";

import React from "react";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";

type ChapterItemProps = {
  title: string;
  duration: string;
  isChapterFree: boolean;
  activeChapterIndex: Number;
  // setActiveChapterIndex: any;
  index: Number;
};

const ChapterItem = ({
  title,
  duration,
  isChapterFree,
  activeChapterIndex,
  index,
}: ChapterItemProps) => {
  const [videoPlaying, setVideoPlaying] = React.useState(false);

  var today = new Date();
  var time =
    today.getHours() + " : " + today.getMinutes() + " : " + today.getSeconds();

  return (
    <div
      className={`text-md flex cursor-pointer group items-center justify-between rounded-xl border p-4 text-base tracking-tight transition-all duration-300 hover:border-blue-500 dark:hover:text-white ${
        activeChapterIndex === index
          ? "border-neutral-400 dark:border-gray-400 group-hover:bg-blue-100 duration-100 transition-all group-hover:border-blue-600 text-zinc-700 dark:text-white"
          : ""
      } `}
      onClick={() => setVideoPlaying(!videoPlaying)}
    >
      <div className="flex items-center justify-start space-x-2">
        <div>
          {videoPlaying ? (
            <FaPauseCircle
              className="cursor-pointer rounded-full group-hover::text-blue-600 transition-all p-1 duration-75"
              size={24}
            />
          ) : (
            <FaPlayCircle
              className="cursor-pointer rounded-full group-hover:text-blue-600 transition-all p-1 duration-75"
              size={24}
            />
          )}
        </div>

        <div>
          <div className="link-clamp-1 max-lines-1 line-clamp-1 overflow-clip text-xs">
            Chapter {index.toString()}
          </div>
          <div className="link-clamp-2 text-md max-lines-1 line-clamp-1 overflow-hidden text-base group-hover:text-blue-600 dark:text-white">
            {title}
          </div>
        </div>
      </div>

      {/* <div className="flex items-center justify-start space-x-2">
        <p className="mr-1 rounded-badge bg-white px-2 py-1 text-center text-xs font-normal text-black">
          {duration ? duration : time}
        </p>
      </div> */}
    </div>
  );
};

export default ChapterItem;