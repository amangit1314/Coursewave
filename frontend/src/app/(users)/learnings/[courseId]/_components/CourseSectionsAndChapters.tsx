"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { courseChapters, sampleText } from "@/lib/mock/mockData";
import { Chapter, Instructor } from "@/types/course-details-api-response";
import ChapterItem from "./ChapterItem";

type CourseSectionsAndChaptersProps = {
  chapters: any;
  activeChapterIndex: Number;
  // setActiveChapter: any;
  setActiveChapterIndex: any;
  chaptersError: any;
};

const CourseSectionsAndChapters = ({
  chapters,
  activeChapterIndex,
  setActiveChapterIndex,
  chaptersError,
}: CourseSectionsAndChaptersProps) => {
  if (chaptersError) {
    return <div>Error in loading chapters: {chaptersError.message}</div>;
  }

  return (
    <div>
      {chapters && chapters.length > 0 ? (
        <div className="h-full w-full max-w-xl md:mt-2 md:h-[360px]">
          <ScrollArea className="border-stroke h-full max-h-[512px] w-full max-w-xl rounded-xl border p-4">
            <div>
              {/* course chapters text & total chapters count */}
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                  Course Chapters
                </p>

                {/* totoal no of chapters */}
                <p className="text-sm dark:text-gray-300">
                  <span className="text-blue-500">
                    {chapters ? chapters.length : courseChapters.length}
                  </span>{" "}
                  chapters
                </p>
              </div>

              <p className="mb-4 text-sm">
                These are all the chapters in this course{" "}
              </p>

              {/* chapters list */}
              {chapters && chapters?.length > 0 ? (
                <ul className="space-y-2">
                  {chapters?.map((chapter: Chapter, index: any) => {
                    return (
                      <li
                        onClick={() => setActiveChapterIndex(index)}
                        key={chapter.position}
                      >
                        <ChapterItem
                          title={chapter?.title}
                          duration={"0"}
                          // duration={chapter?.createdAt.toLocaleDateString.toString()} /// TODO: use chapter duration here
                          isChapterFree={chapter?.isFree}
                          activeChapterIndex={activeChapterIndex}
                          index={index}
                        />
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul className="space-y-2">
                  {courseChapters?.map((chapter: any, index: any) => {
                    return (
                      <li
                        onClick={() => setActiveChapterIndex(index)}
                        key={chapter.position}
                      >
                        <ChapterItem
                          title={chapter?.title}
                          // duration={chapter?.chapterDuration}
                          duration={"0"}
                          isChapterFree={chapter?.isFree}
                          activeChapterIndex={activeChapterIndex}
                          index={index}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div>
          {/* course chapters text & total chapters count */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              Course Chapters
            </p>

            {/* <CoursesCollapsible
              chapters={chapters}
              activeChapterIndex={activeChapterIndex}
              setActiveChapterIndex={setActiveChapterIndex}
            /> */}
            <p className="text-sm dark:text-gray-300">
              <span className="text-blue-500">
                {chapters && chapters.length > 0
                  ? chapters.length
                  : courseChapters.length}
              </span>{" "}
              chapters
            </p>
          </div>
          <p className="mb-4 text-sm">
            These are all the chapters in this course{" "}
          </p>

          <ul className="space-y-2">
            {courseChapters?.map((chapter: any, index: any) => {
              return (
                <li
                  onClick={() => setActiveChapterIndex(index)}
                  key={chapter.position}
                >
                  <ChapterItem
                    title={chapter?.title}
                    duration={chapter?.chapterDuration}
                    isChapterFree={chapter?.isFree}
                    activeChapterIndex={activeChapterIndex}
                    index={index}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseSectionsAndChapters;
