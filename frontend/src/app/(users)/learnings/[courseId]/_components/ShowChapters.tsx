"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

//* -------------------- Custom Hooks ------------------------------
import { courseChapters, sampleText } from "@/lib/mock/mockData";
import { Chapter, Instructor } from "@/types/course-details-api-response";
import ChapterItem from "./ChapterItem";

type ShowChaptersProps = {
  chapters: Chapter[];
  activeChapterIndex: Number;
  setActiveChapterIndex: any;
};

const ShowChapters = ({
  chapters,
  activeChapterIndex,
  setActiveChapterIndex,
}: ShowChaptersProps) => {
  return (
    <Sheet key={"left"}>
      <SheetTrigger asChild>
        <p className="w-auto cursor-pointer text-sm font-medium text-blue-500 transition-all duration-300">
          Show Chapters
        </p>
      </SheetTrigger>
      <ScrollArea>
        <SheetContent side={"right"} className="h-full w-auto text-left">
          <SheetHeader>
            <SheetTitle>Chapters</SheetTitle>
            <SheetDescription>
              These are all the chapters in this course. click on anyone to view
              its content.
            </SheetDescription>
          </SheetHeader>

          {/* chapters list */}
          <div className="mt-6 space-y-4">
            {chapters && chapters.length > 0 ? (
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
                        // duration={chapter?.createdAt.toLocaleDateString.toString()} // TODO: use chapter duration here
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
                {courseChapters?.map(
                  (
                    chapter: {
                      title: string;
                      chapterDuration: string;
                      isFree: boolean;
                      position: number;
                    },
                    index: number
                  ) => {
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
                  }
                )}
              </ul>
            )}
          </div>
        </SheetContent>
      </ScrollArea>
    </Sheet>
  );
};

export default ShowChapters;
