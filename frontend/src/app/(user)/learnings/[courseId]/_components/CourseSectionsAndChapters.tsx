"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chapter } from "@/types/course-details-api-response";
import ChapterItem from "./ChapterItem";
import { ListVideo, Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CourseSectionsAndChaptersProps = {
  chapters: any[];
  activeChapterIndex: number;
  setActiveChapterIndex: (index: number) => void;
  chaptersError: any;
  totalDuration?: string;
};

const CourseSectionsAndChapters = ({
  chapters,
  activeChapterIndex,
  setActiveChapterIndex,
  chaptersError,
  totalDuration = "0m",
}: CourseSectionsAndChaptersProps) => {
  const data = chapters && chapters.length > 0 ? chapters : [];
  const totalChapters = data.length;

  if (chaptersError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-red-200 bg-red-50/80 p-6 backdrop-blur-sm dark:border-red-800/50 dark:bg-red-950/80"
      >
        <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertCircle size={20} />
          <div>
            <h4 className="font-semibold">Error Loading Chapters</h4>
            <p className="text-sm opacity-80">{chaptersError.message}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-700/50 dark:bg-zinc-900/80"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-50 p-2 dark:bg-green-900/20">
            <ListVideo className="text-lg text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Course Chapters
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span>{totalChapters} chapter{totalChapters !== 1 ? 's' : ''}</span>
              {/* <span>•</span>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{totalDuration}</span>
              </div> */}
            </div>
          </div>
        </div>

        {totalChapters > 0 && (
          <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-zinc-800 dark:text-gray-400">
            {activeChapterIndex + 1}/{totalChapters}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Browse through all chapters in this course. Click to navigate.
      </p>

      {/* Chapters List */}
      <ScrollArea className="h-full max-h-[400px]">
        <AnimatePresence>
          <ul className="space-y-2">
            {data.map((chapter: Chapter, index: number) => (
              <motion.li
                key={chapter.position ?? index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ChapterItem
                  title={chapter?.title}
                  duration={String(chapter?.duration || "0")}
                  isChapterFree={chapter?.isFree}
                  activeChapterIndex={activeChapterIndex}
                  index={index}
                  totalChapters={totalChapters}
                  position={chapter.position}
                />
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>

        {/* Empty State */}
        {data.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center"
          >
            <div className="mx-auto mb-4 rounded-full bg-gray-100 p-4 dark:bg-zinc-800 w-fit">
              <ListVideo className="text-3xl text-gray-400 dark:text-gray-500" />
            </div>
            <h4 className="mb-2 font-medium text-gray-600 dark:text-gray-400">
              No chapters available
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Course content will appear here
            </p>
          </motion.div>
        )}
      </ScrollArea>

      {/* Progress Footer */}
      {/* {totalChapters > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-700"
        >
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <span>Progress</span>
            <span>{Math.round(((activeChapterIndex + 1) / totalChapters) * 100)}%</span>
          </div>
          <div className="mt-2 h-1 w-full rounded-full bg-gray-200 dark:bg-zinc-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${((activeChapterIndex + 1) / totalChapters) * 100}%` }}
            />
          </div>
        </motion.div>
      )} */}
    </motion.div>
  );
};

export default CourseSectionsAndChapters;



// "use client";

// import React from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Chapter } from "@/types/course-details-api-response";
// import ChapterItem from "./ChapterItem";
// import { ListVideo, Clock, AlertCircle } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// type CourseSectionsAndChaptersProps = {
//   chapters: any[];
//   activeChapterIndex: number;
//   setActiveChapterIndex: (index: number) => void;
//   chaptersError: any;
// };

// // Helper function to format seconds to human readable duration
// const formatDuration = (totalSeconds: number): string => {
//   if (!totalSeconds || totalSeconds === 0) return "0m";
  
//   const hours = Math.floor(totalSeconds / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = Math.floor(totalSeconds % 60);

//   if (hours > 0) {
//     return `${hours}h ${minutes}m`;
//   } else if (minutes > 0) {
//     return `${minutes}m ${seconds}s`;
//   } else {
//     return `${seconds}s`;
//   }
// };

// const CourseSectionsAndChapters = ({
//   chapters,
//   activeChapterIndex,
//   setActiveChapterIndex,
//   chaptersError,
// }: CourseSectionsAndChaptersProps) => {
//   const data = chapters && chapters.length > 0 ? chapters : [];
//   const totalChapters = data.length;
  
//   // Calculate total duration from chapters that have durations
//   const totalDurationSeconds = data.reduce((total, chapter) => {
//     return total + (chapter.duration || 0);
//   }, 0);
  
//   const calculatedTotalDuration = formatDuration(totalDurationSeconds);
  
//   // Calculate completed duration (duration of chapters up to active chapter)
//   const completedDurationSeconds = data.slice(0, activeChapterIndex + 1).reduce((total, chapter) => {
//     return total + (chapter.duration || 0);
//   }, 0);
  
//   const completedDuration = formatDuration(completedDurationSeconds);

//   // Count chapters that have duration data
//   const chaptersWithDuration = data.filter(chapter => chapter.duration > 0).length;

//   if (chaptersError) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="rounded-2xl border border-red-200 bg-red-50/80 p-6 backdrop-blur-sm dark:border-red-800/50 dark:bg-red-950/80"
//       >
//         <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
//           <AlertCircle size={20} />
//           <div>
//             <h4 className="font-semibold">Error Loading Chapters</h4>
//             <p className="text-sm opacity-80">{chaptersError.message}</p>
//           </div>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-700/50 dark:bg-zinc-900/80"
//     >
//       {/* Header */}
//       <div className="mb-6 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="rounded-xl bg-green-50 p-2 dark:bg-green-900/20">
//             <ListVideo className="text-lg text-green-600 dark:text-green-400" />
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
//               Course Chapters
//             </h3>
//             <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
//               <span>{totalChapters} chapter{totalChapters !== 1 ? 's' : ''}</span>
//               <span>•</span>
//               <div className="flex items-center gap-1">
//                 <Clock size={14} />
//                 <span>{calculatedTotalDuration}</span>
//                 {chaptersWithDuration < totalChapters && (
//                   <span className="text-xs text-orange-500">
//                     ({chaptersWithDuration}/{totalChapters} loaded)
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {totalChapters > 0 && (
//           <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-zinc-800 dark:text-gray-400">
//             {activeChapterIndex + 1}/{totalChapters}
//           </div>
//         )}
//       </div>

//       {/* Chapters List */}
//       <ScrollArea className="h-full max-h-[400px]">
//         <AnimatePresence>
//           <ul className="space-y-2">
//             {data.map((chapter: Chapter, index: number) => (
//               <motion.li
//                 key={chapter.position ?? index}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.05 }}
//               >
//                 <ChapterItem
//                   title={chapter?.title}
//                   duration={formatDuration(chapter.duration || 0)}
//                   isChapterFree={chapter?.isFree}
//                   activeChapterIndex={activeChapterIndex}
//                   index={index}
//                   totalChapters={totalChapters}
//                   position={chapter.position}
//                   hasDuration={!!chapter.duration}
//                 />
//               </motion.li>
//             ))}
//           </ul>
//         </AnimatePresence>

//         {/* Empty State */}
//         {data.length === 0 && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="py-12 text-center"
//           >
//             <div className="mx-auto mb-4 rounded-full bg-gray-100 p-4 dark:bg-zinc-800 w-fit">
//               <ListVideo className="text-3xl text-gray-400 dark:text-gray-500" />
//             </div>
//             <h4 className="mb-2 font-medium text-gray-600 dark:text-gray-400">
//               No chapters available
//             </h4>
//             <p className="text-sm text-gray-500 dark:text-gray-500">
//               Course content will appear here
//             </p>
//           </motion.div>
//         )}
//       </ScrollArea>

//       {/* Progress Footer */}
//       {totalChapters > 0 && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-700"
//         >
//           <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-2">
//             <span>Progress</span>
//             <span>{Math.round(((activeChapterIndex + 1) / totalChapters) * 100)}%</span>
//           </div>
//           <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-2">
//             <span>Time completed: {completedDuration}</span>
//             <span>Total: {calculatedTotalDuration}</span>
//           </div>
//           <div className="mt-2 h-1 w-full rounded-full bg-gray-200 dark:bg-zinc-700">
//             <div 
//               className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
//               style={{ width: `${((activeChapterIndex + 1) / totalChapters) * 100}%` }}
//             />
//           </div>
//         </motion.div>
//       )}
//     </motion.div>
//   );
// };

// export default CourseSectionsAndChapters;