// "use client";

// import React from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";

// //* -------------------- Custom Hooks ------------------------------
// import { courseChapters, sampleText } from "@/lib/mock/mockData";
// import { Chapter, Instructor } from "@/types/course-details-api-response";
// import ChapterItem from "./ChapterItem";

// type ShowChaptersProps = {
//   chapters: Chapter[];
//   activeChapterIndex: Number;
//   setActiveChapterIndex: any;
// };

// const ShowChapters = ({
//   chapters,
//   activeChapterIndex,
//   setActiveChapterIndex,
// }: ShowChaptersProps) => {
//   return (
//     <Sheet key={"left"}>
//       <SheetTrigger asChild>
//         <p className="w-auto cursor-pointer text-sm font-medium text-blue-500 transition-all duration-300">
//           Show Chapters
//         </p>
//       </SheetTrigger>
//       <ScrollArea>
//         <SheetContent side={"right"} className="h-full w-auto text-left">
//           <SheetHeader>
//             <SheetTitle>Chapters</SheetTitle>
//             <SheetDescription>
//               These are all the chapters in this course. click on anyone to view
//               its content.
//             </SheetDescription>
//           </SheetHeader>

//           {/* chapters list */}
//           <div className="mt-6 space-y-4">
//             {chapters && chapters.length > 0 ? (
//               <ul className="space-y-2">
//                 {chapters?.map((chapter: Chapter, index: any) => {
//                   return (
//                     <li
//                       onClick={() => setActiveChapterIndex(index)}
//                       key={chapter.position}
//                     >
//                       <ChapterItem
//                         title={chapter?.title}
//                         duration={"0"}
//                         // duration={chapter?.createdAt.toLocaleDateString.toString()} // TODO: use chapter duration here
//                         isChapterFree={chapter?.isFree}
//                         activeChapterIndex={activeChapterIndex as number}
//                         index={index}
//                       />
//                     </li>
//                   );
//                 })}
//               </ul>
//             ) : (
//               <ul className="space-y-2">
//                 {courseChapters?.map(
//                   (
//                     chapter: {
//                       title: string;
//                       chapterDuration: string;
//                       isFree: boolean;
//                       position: number;
//                     },
//                     index: number
//                   ) => {
//                     return (
//                       <li
//                         onClick={() => setActiveChapterIndex(index)}
//                         key={chapter.position}
//                       >
//                         <ChapterItem
//                           title={chapter?.title}
//                           duration={chapter?.chapterDuration}
//                           isChapterFree={chapter?.isFree}
//                           activeChapterIndex={activeChapterIndex as number}
//                           index={index}
//                         />
//                       </li>
//                     );
//                   }
//                 )}
//               </ul>
//             )}
//           </div>
//         </SheetContent>
//       </ScrollArea>
//     </Sheet>
//   );
// };

// export default ShowChapters;

"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Chapter } from "@/types/course-details-api-response";
import ChapterItem from "./ChapterItem";
import { ListVideo, Menu, X } from "lucide-react";

type ShowChaptersProps = {
  chapters: Chapter[];
  activeChapterIndex: number;
  setActiveChapterIndex: (index: number) => void;
};

const ShowChapters = ({
  chapters,
  activeChapterIndex,
  setActiveChapterIndex,
}: ShowChaptersProps) => {
  const data = chapters && chapters.length > 0 ? chapters : [];
  const totalChapters = data.length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 active:scale-95 dark:from-blue-600 dark:to-indigo-700 dark:shadow-blue-900/30">
          <Menu size={18} />
          <span className="text-sm font-semibold">Chapters</span>
          {totalChapters > 0 && (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
              {totalChapters}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="h-full w-full max-w-sm p-0 border-l border-gray-200/50 dark:border-zinc-700/50 bg-white/95 backdrop-blur-xl dark:bg-zinc-900/95"
      >
        {/* Header with Gradient Background */}
        <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/20 p-2 backdrop-blur-sm">
                <ListVideo size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Course Chapters</h2>
                <p className="text-blue-100 text-sm mt-1">
                  {totalChapters} chapter{totalChapters !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <SheetTrigger asChild>
              <button className="rounded-xl bg-white/20 p-2 transition-all duration-200 hover:bg-white/30 hover:scale-110 active:scale-95 flex-shrink-0">
                <X size={18} />
              </button>
            </SheetTrigger>
          </div>

          {/* Progress Indicator */}
          {totalChapters > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-blue-100 mb-2">
                <span>Your Progress</span>
                <span className="font-bold">
                  {Math.round(((activeChapterIndex + 1) / totalChapters) * 100)}
                  %
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{
                    width: `${((activeChapterIndex + 1) / totalChapters) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Chapters List */}
        <ScrollArea className="h-full px-4 py-6">
          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 px-2">
            Tap on any chapter to view its content and start learning.
          </p>
          {/* Chapters */}
          <div className="space-y-3">
            {data.length > 0 ? (
              <ul className="space-y-3">
                {data.map((chapter: Chapter, index: number) => (
                  <li key={chapter.position ?? index}>
                    <SheetTrigger asChild>
                      <div onClick={() => setActiveChapterIndex(index)}>
                        <ChapterItem
                          title={chapter?.title}
                          duration={String(chapter?.duration || "0m")}
                          isChapterFree={chapter?.isFree}
                          activeChapterIndex={activeChapterIndex}
                          index={index}
                          totalChapters={totalChapters}
                          position={chapter.position}
                        />
                      </div>
                    </SheetTrigger>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-2xl bg-gray-100 p-4 mb-4 dark:bg-zinc-800">
                  <ListVideo
                    size={32}
                    className="text-gray-400 dark:text-zinc-500"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  No Chapters Available
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                  Course chapters will appear here once they're added to the
                  course.
                </p>
              </div>
            )}
          </div>

          {/* Footer Spacing */}
          <div className="h-20" />
        </ScrollArea>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none dark:from-zinc-900" />
      </SheetContent>
    </Sheet>
  );
};

export default ShowChapters;
