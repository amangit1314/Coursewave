// "use client";

// import React from "react";
// import { Play, Pause, Lock, Clock, CheckCircle2 } from "lucide-react";
// import { motion } from "framer-motion";

// type ChapterItemProps = {
//   title: string;
//   duration?: string;
//   isChapterFree?: boolean;
//   activeChapterIndex: number;
//   index: number;
//   totalChapters?: number;
//   position?: number;
//   isCompleted?: boolean;
//   isLoadingDuration?: boolean;
// };

// const ChapterItem = ({
//   title,
//   duration = "0:00",
//   isChapterFree = false,
//   activeChapterIndex,
//   index,
//   totalChapters,
//   position,
//   isCompleted = false,
// }: ChapterItemProps) => {
//   const isActive = activeChapterIndex === index;
//   const chapterNumber = position !== undefined ? position + 1 : index + 1;

//   return (
//     <motion.div
//       // whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//       className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-200
//         ${
//           isActive
//             ? "border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md dark:border-blue-800/50 dark:from-blue-900/20 dark:to-indigo-900/20"
//             : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-blue-800/50"
//         }`}
//     >
//       <div className="flex items-center justify-between">
//         {/* Left Content */}
//         <div className="flex items-center gap-3 flex-1 min-w-0">
//           {/* Status Icon */}
//           <div
//             className={`rounded-lg p-2 transition-colors ${
//               isActive
//                 ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
//                 : isCompleted
//                   ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
//                   : "bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 dark:bg-zinc-700 dark:group-hover:bg-blue-900/20"
//             }`}
//           >
//             {isCompleted ? (
//               <CheckCircle2 size={16} />
//             ) : isActive ? (
//               <Pause size={16} />
//             ) : (
//               <Play size={16} />
//             )}
//           </div>

//           {/* Text Content */}
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-2 mb-1">
//               <span
//                 className={`text-xs font-medium ${
//                   isActive
//                     ? "text-blue-700 dark:text-blue-300"
//                     : "text-gray-500 dark:text-gray-400"
//                 }`}
//               >
//                 Chapter {chapterNumber}
//                 {totalChapters && ` of ${totalChapters}`}
//               </span>

//               {isChapterFree && (
//                 <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
//                   Free
//                 </span>
//               )}

//               {isCompleted && !isActive && (
//                 <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
//                   Completed
//                 </span>
//               )}
//             </div>

//             <h4
//               className={`truncate font-medium transition-colors ${
//                 isActive
//                   ? "text-blue-900 dark:text-blue-100"
//                   : "text-gray-900 group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-300"
//               }`}
//             >
//               {title}
//             </h4>
//           </div>
//         </div>

//         {/* Right Content */}
//         <div className="ml-3 flex items-center gap-3">
//           {/* Duration */}
//           {duration !== "0" && duration !== "0:00" && (
//             <div
//               className={`flex items-center gap-1 text-sm ${
//                 isActive
//                   ? "text-blue-600 dark:text-blue-400"
//                   : "text-gray-400 group-hover:text-blue-500 dark:text-gray-500"
//               }`}
//             >
//               <Clock size={14} />
//               <span>{duration}</span>
//             </div>
//           )}

//           {/* Lock Icon for Premium Chapters */}
//           {!isChapterFree && !isCompleted && !isActive && (
//             <Lock size={16} className="text-amber-500" />
//           )}
//         </div>
//       </div>

//       {/* Active Indicator */}
//       {isActive && (
//         <motion.div
//           layoutId="activeChapter"
//           className="absolute inset-0 rounded-xl border border-blue-300 pointer-events-none"
//           initial={false}
//           transition={{ type: "spring", stiffness: 300, damping: 30 }}
//         />
//       )}
//     </motion.div>
//   );
// };

// export default ChapterItem;

/// --------------------------------------------------------------------------------------

"use client";

import React from "react";
import { Play, Pause, Lock, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type ChapterItemProps = {
  title: string;
  duration?: string;
  isChapterFree?: boolean;
  activeChapterIndex: number;
  index: number;
  totalChapters?: number;
  position?: number;
  isCompleted?: boolean;
  isLoadingDuration?: boolean;
};

const ChapterItem = ({
  title,
  duration = "0:00",
  isChapterFree = false,
  activeChapterIndex,
  index,
  totalChapters,
  position,
  isCompleted = false,
}: ChapterItemProps) => {
  const isActive = activeChapterIndex === index;
  const chapterNumber = position !== undefined ? position + 1 : index + 1;
  const hasValidDuration =
    duration !== "0" && duration !== "0:00" && duration !== "0m";

  return (
    <motion.div
      whileHover={{
        // scale: 1.01,
        // y: -1,
      }}
      whileTap={{ scale: 0.99 }}
      className={`group relative cursor-pointer rounded-2xl border p-5 transition-all duration-300 
        ${
          isActive
            ? "border-blue-400/80 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 shadow-lg shadow-blue-200/50 dark:border-blue-400/60 dark:from-blue-950/40 dark:to-indigo-950/40 dark:shadow-blue-900/30"
            : "border-gray-200/80 bg-white/80 backdrop-blur-sm hover:border-blue-300/60 hover:bg-blue-50/30 hover:shadow-md dark:border-zinc-700/80 dark:bg-zinc-800/30 dark:hover:border-blue-600/40 dark:hover:bg-blue-950/20"
        } ${isCompleted && !isActive ? "opacity-90" : ""}`}
    >
      {/* Background Glow Effect for Active */}
      {isActive && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/5 to-indigo-400/5 dark:from-blue-400/10 dark:to-indigo-400/10" />
      )}

      {/* Progress Line for Completed */}
      {isCompleted && (
        <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 bg-gradient-to-b from-green-400 to-emerald-500 rounded-r-full dark:from-green-500 dark:to-emerald-600" />
      )}

      <div className="flex items-center justify-between relative z-10">
        {/* Left Content */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Status Icon with Enhanced Styling */}
          <div
            className={`relative rounded-2xl p-3 transition-all duration-300 shadow-sm
              ${
                isActive
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 dark:from-blue-600 dark:to-indigo-700 dark:shadow-blue-900/40"
                  : isCompleted
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 dark:from-green-600 dark:to-emerald-700 dark:shadow-green-900/40"
                    : "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-400 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-500 shadow dark:from-zinc-700 dark:to-zinc-600 dark:group-hover:from-blue-900/30 dark:group-hover:to-indigo-900/30 dark:group-hover:text-blue-400"
              }`}
          >
            {isCompleted ? (
              <CheckCircle2 size={18} className="relative z-10" />
            ) : isActive ? (
              <Pause size={18} className="relative z-10" />
            ) : (
              <Play size={18} className="relative z-10 ml-0.5" />
            )}

            {/* Subtle shine effect */}
            <div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent ${
                isActive || isCompleted
                  ? "opacity-30"
                  : "opacity-0 group-hover:opacity-20"
              }`}
            />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`text-sm font-semibold tracking-wide ${
                  isActive
                    ? "text-blue-700 dark:text-blue-200"
                    : isCompleted
                      ? "text-green-700 dark:text-green-200"
                      : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {chapterNumber}.
              </span>

              {/* Badges Container */}
              <div className="flex items-center gap-2">
                {isChapterFree && (
                  <span className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-green-500/25 dark:shadow-green-900/30">
                    <Sparkles size={10} className="inline mr-1" />
                    Free
                  </span>
                )}

                {isCompleted && !isActive && (
                  <span className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-green-500/25 dark:shadow-green-900/30">
                    Completed
                  </span>
                )}
              </div>
            </div>

            <h4
              className={`font-semibold leading-tight transition-colors line-clamp-2
                ${
                  isActive
                    ? "text-blue-900 dark:text-blue-50"
                    : isCompleted
                      ? "text-green-900 dark:text-green-50"
                      : "text-gray-900 group-hover:text-blue-800 dark:text-gray-100 dark:group-hover:text-blue-200"
                }`}
            >
              {title}
            </h4>
          </div>
        </div>

        {/* Right Content */}
        <div className="ml-4 flex items-center gap-4">
          {/* Duration with Enhanced Styling */}
          {hasValidDuration && (
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300
                ${
                  isActive
                    ? "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                    : isCompleted
                      ? "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                      : "bg-gray-100 text-gray-500 group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:bg-zinc-700/50 dark:text-gray-400 dark:group-hover:bg-blue-500/20 dark:group-hover:text-blue-400"
                }`}
            >
              <Clock size={14} className="flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">
                {duration}
              </span>
            </div>
          )}

          {/* Lock Icon with Enhanced Styling */}
          {!isChapterFree && !isCompleted && !isActive && (
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600 shadow-sm group-hover:bg-amber-200 group-hover:text-amber-700 transition-all duration-300 dark:bg-amber-900/30 dark:text-amber-400 dark:group-hover:bg-amber-900/50 dark:group-hover:text-amber-300">
              <Lock size={16} />
            </div>
          )}
        </div>
      </div>

      {/* Active Indicator - Fine Border */}
      {isActive && (
        <motion.div
          layoutId="activeChapter"
          className="absolute inset-0 rounded-2xl border-2 border-blue-400/60 pointer-events-none dark:border-blue-400/40"
          initial={false}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}

      {/* Hover Border Effect */}
      {!isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-blue-300/30 pointer-events-none transition-all duration-300 dark:group-hover:border-blue-600/20"
          initial={false}
        />
      )}

      {/* Subtle Shine Effect on Hover */}
      {!isActive && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/0 to-transparent opacity-0 group-hover:opacity-100 group-hover:via-white/20 transition-all duration-500 dark:via-white/5" />
      )}
    </motion.div>
  );
};

export default ChapterItem;

/// --------------------------------------------------------------------------------------

// "use client";

// import React from "react";
// import { Play, Pause, Lock, Clock, CheckCircle2, Loader2 } from "lucide-react";
// import { motion } from "framer-motion";

// type ChapterItemProps = {
//   title: string;
//   duration?: string;
//   isChapterFree?: boolean;
//   activeChapterIndex: number;
//   index: number;
//   totalChapters?: number;
//   position?: number;
//   isCompleted?: boolean;
//   isLoadingDuration?: boolean;
//   hasDuration?: boolean; // New prop to indicate if duration data is available
// };

// const ChapterItem = ({
//   title,
//   duration = "0m",
//   isChapterFree = false,
//   activeChapterIndex,
//   index,
//   totalChapters,
//   position,
//   isCompleted = false,
//   isLoadingDuration = false,
//   hasDuration = false, // New prop
// }: ChapterItemProps) => {
//   const isActive = activeChapterIndex === index;
//   const chapterNumber = position !== undefined ? position + 1 : index + 1;

//   // Determine what to show for duration
//   const renderDuration = () => {
//     if (isLoadingDuration) {
//       return (
//         <div className="flex items-center gap-1">
//           <Loader2 size={12} className="animate-spin" />
//           <span className="text-xs">...</span>
//         </div>
//       );
//     }

//     if (!hasDuration || duration === "0m" || duration === "0:00") {
//       return (
//         <div className="flex items-center gap-1 opacity-50">
//           <Clock size={12} />
//           <span className="text-xs">--</span>
//         </div>
//       );
//     }

//     return (
//       <div className="flex items-center gap-1">
//         <Clock size={12} />
//         <span className="text-xs">{duration}</span>
//       </div>
//     );
//   };

//   return (
//     <motion.div
//       whileTap={{ scale: 0.98 }}
//       className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-200
//         ${
//           isActive
//             ? "border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md dark:border-blue-800/50 dark:from-blue-900/20 dark:to-indigo-900/20"
//             : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-blue-800/50"
//         }`}
//     >
//       <div className="flex items-center justify-between">
//         {/* Left Content */}
//         <div className="flex items-center gap-3 flex-1 min-w-0">
//           {/* Status Icon */}
//           <div
//             className={`rounded-lg p-2 transition-colors ${
//               isActive
//                 ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
//                 : isCompleted
//                   ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
//                   : "bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 dark:bg-zinc-700 dark:group-hover:bg-blue-900/20"
//             }`}
//           >
//             {isCompleted ? (
//               <CheckCircle2 size={16} />
//             ) : isActive ? (
//               <Pause size={16} />
//             ) : (
//               <Play size={16} />
//             )}
//           </div>

//           {/* Text Content */}
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-2 mb-1">
//               <span
//                 className={`text-xs font-medium ${
//                   isActive
//                     ? "text-blue-700 dark:text-blue-300"
//                     : isCompleted
//                     ? "text-green-700 dark:text-green-300"
//                     : "text-gray-500 dark:text-gray-400"
//                 }`}
//               >
//                 {chapterNumber}.
//               </span>

//               {isChapterFree && (
//                 <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
//                   Free
//                 </span>
//               )}

//               {isCompleted && !isActive && (
//                 <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
//                   Completed
//                 </span>
//               )}
//             </div>

//             <h4
//               className={`truncate font-medium transition-colors ${
//                 isActive
//                   ? "text-blue-900 dark:text-blue-100"
//                   : isCompleted
//                   ? "text-green-900 dark:text-green-100"
//                   : "text-gray-900 group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-300"
//               }`}
//             >
//               {title}
//             </h4>
//           </div>
//         </div>

//         {/* Right Content */}
//         <div className="ml-3 flex items-center gap-3">
//           {/* Duration */}
//           <div
//             className={`flex items-center gap-1 ${
//               isActive
//                 ? "text-blue-600 dark:text-blue-400"
//                 : isCompleted
//                 ? "text-green-600 dark:text-green-400"
//                 : "text-gray-400 group-hover:text-blue-500 dark:text-gray-500"
//             }`}
//           >
//             {renderDuration()}
//           </div>

//           {/* Lock Icon for Premium Chapters */}
//           {!isChapterFree && !isCompleted && !isActive && (
//             <Lock
//               size={16}
//               className={
//                 isActive
//                   ? "text-blue-500"
//                   : "text-amber-500 group-hover:text-amber-600"
//               }
//             />
//           )}
//         </div>
//       </div>

//       {/* Active Indicator */}
//       {isActive && (
//         <motion.div
//           layoutId="activeChapter"
//           className="absolute inset-0 rounded-xl border-2 border-blue-300 pointer-events-none"
//           initial={false}
//           transition={{ type: "spring", stiffness: 300, damping: 30 }}
//         />
//       )}

//       {/* Progress indicator for completed chapters */}
//       {isCompleted && !isActive && (
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"
//         />
//       )}
//     </motion.div>
//   );
// };

// export default ChapterItem;
