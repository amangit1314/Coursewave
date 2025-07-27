// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Section } from "@/types/course-details-api-response";
// import React from "react";
// import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";

// type CourseSectionsAndChaptersProps = {
//   sections: Section[];
//   activeSectionIndex: number;
//   setActiveSectionIndex: (idx: number) => void;
//   activeChapterIndex: number;
//   setActiveChapterIndex: (idx: number) => void;
//   chaptersError: any;
// };

// export default function CourseSectionsAndChapters({
//   sections,
//   activeSectionIndex,
//   setActiveSectionIndex,
//   activeChapterIndex,
//   setActiveChapterIndex,
//   chaptersError,
// }: CourseSectionsAndChaptersProps) {
//   if (chaptersError) {
//     return <div>Error in loading chapters: {chaptersError.message}</div>;
//   }
//   return (
//     <Accordion
//       type="single"
//       collapsible
//       value={sections[activeSectionIndex]?.id}
//       onValueChange={(val) => {
//         const idx = sections.findIndex((s) => s.id === val);
//         if (idx !== -1) setActiveSectionIndex(idx);
//       }}
//     >
//       {sections.map((section, sectionIdx) => (
//         <AccordionItem value={section.id} key={section.id}>
//           <AccordionTrigger>{section.title}</AccordionTrigger>
//           <AccordionContent>
//             <ul className="space-y-2">
//               {(section.chapters ?? []).map((chapter, chapterIdx) => (
//                 <li
//                   key={chapter.id}
//                   className={`cursor-pointer px-2 py-1 rounded ${activeSectionIndex === sectionIdx && activeChapterIndex === chapterIdx ? "bg-blue-100 dark:bg-blue-900" : ""}`}
//                   onClick={() => {
//                     setActiveSectionIndex(sectionIdx);
//                     setActiveChapterIndex(chapterIdx);
//                   }}
//                 >
//                   {chapter.title}
//                 </li>
//               ))}
//             </ul>
//           </AccordionContent>
//         </AccordionItem>
//       ))}
//     </Accordion>
//   );
// }

// type ChapterItemProps = {
//   title: string;
//   duration: string;
//   isChapterFree: boolean;
//   activeChapterIndex: Number;
//   // setActiveChapterIndex: any;
//   index: Number;
// };

// const ChapterItem = ({
//   title,
//   duration,
//   isChapterFree,
//   activeChapterIndex,
//   index,
// }: ChapterItemProps) => {
//   const [videoPlaying, setVideoPlaying] = React.useState(false);

//   var today = new Date();
//   var time =
//     today.getHours() + " : " + today.getMinutes() + " : " + today.getSeconds();

//   return (
//     <div
//       className={`text-md flex cursor-pointer items-center justify-between border-neutral-500 rounded-xl border p-4 text-base tracking-tight transition-all duration-300 hover:border-blue-500 dark:hover:text-white ${
//         activeChapterIndex === index
//           ? "border-blue-500 text-zinc-700 dark:text-white"
//           : ""
//       } `}
//     >
//       <div className="flex items-center justify-start space-x-2">
//         <div onClick={() => setVideoPlaying(!videoPlaying)}>
//           {videoPlaying ? (
//             <FaPauseCircle
//               className="cursor-pointer rounded-full p-1 hover:bg-blue-700"
//               size={24}
//             />
//           ) : (
//             <FaPlayCircle
//               className="cursor-pointer rounded-full p-1 hover:bg-blue-700"
//               size={24}
//             />
//           )}
//         </div>

//         <div>
//           <div className="link-clamp-1 max-lines-1 line-clamp-1 overflow-clip text-xs">
//             Chapter {index.toString()}
//           </div>
//           <div className="link-clamp-2 text-md max-lines-1 line-clamp-1 overflow-hidden text-base">
//             {title}
//           </div>
//         </div>
//       </div>

//       {/* <div className="flex items-center justify-start space-x-2">
//         <p className="mr-1 rounded-badge bg-white px-2 py-1 text-center text-xs font-normal text-black">
//           {duration ? duration : time}
//         </p>
//       </div> */}
//     </div>
//   );
// };

// app/(course)/courses/[courseId]/courseContent/_components/CourseSectionsAndChapters.tsx
// app/(course)/courses/[courseId]/courseContent/_components/CourseSectionsAndChapters.tsx

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "@/types/course-details-api-response";
import { FaLock, FaUnlock } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";

const sampleChapters = [
  { title: "Intro to Full Stack", isFree: true },
  { title: "Frontend vs Backend", isFree: false },
  { title: "Setting up Node.js", isFree: true },
];

type CourseSectionsAndChaptersProps = {
  sections: Section[];
  activeSectionIndex: number;
  setActiveSectionIndex: (idx: number) => void;
  activeChapterIndex: number;
  setActiveChapterIndex: (idx: number) => void;
  chaptersError: any;
};

export default function CourseSectionsAndChapters({
  sections,
  activeSectionIndex,
  setActiveSectionIndex,
  activeChapterIndex,
  setActiveChapterIndex,
  chaptersError,
}: CourseSectionsAndChaptersProps) {
  if (chaptersError) {
    return (
      <div className="text-red-500">
        Error loading chapters: {chaptersError.message}
      </div>
    );
  }

  const enrichedSections = sections.map((section) => {
    return {
      ...section,
      chapters:
        section.chapters && section.chapters.length > 0
          ? section.chapters
          : sampleChapters.map((ch, idx) => ({
              id: `sample-${section.id}-${idx}`,
              title: ch.title,
              description: "Sample chapter description",
              isFree: ch.isFree,
              contentType: "VIDEO",
              courseId: section.courseId || "sample-course",
              content: {
                duration: 0,
                videoUrl: "",
                subtitles: [],
                resolution: { width: 1920, height: 1080 },
                thumbnailUrl: "",
              },
              position: idx,
              sectionId: section.id,
              isPublished: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })),
    };
  });

  return (
    <Accordion type="multiple" className="space-y-2">
      {enrichedSections.map((section, sectionIdx) => (
        <AccordionItem
          value={section.id}
          key={section.id}
          className="rounded-md border border-gray-200 dark:border-zinc-700 ring-0 focus:outline-none focus-visible:ring-0 focus:ring-0"
        >
          <AccordionTrigger className="px-2 py-2 text-left text-sm tracking-tight font-medium text-gray-800 dark:text-gray-200 focus:outline-none focus-visible:ring-0 focus:ring-0 focus:outline-transparent focus:ring-transparent">
            
            {section.position}
            {". "}
            {section.title}
          </AccordionTrigger>
          <AccordionContent className="px-2 py-2">
            <ul className="space-y-2">
              {(section.chapters ?? []).map((chapter, chapterIdx) => (
                <li
                  key={chapter.id}
                  className={`group flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-zinc-800 ${
                    activeSectionIndex === sectionIdx &&
                    activeChapterIndex === chapterIdx
                      ? "bg-blue-100 dark:bg-blue-900"
                      : ""
                  }`}
                  onClick={() => {
                    setActiveSectionIndex(sectionIdx);
                    setActiveChapterIndex(chapterIdx);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <FaPlayCircle className="text-blue-500" size={16} />
                    <div className="truncate text-gray-900 dark:text-white">
                      {chapter.title}
                    </div>
                  </div>
                  <div>
                    {!chapter.isFree && (
                      <span className="ml-2 rounded bg-yellow-100 px-2 py-0.5 text-[0.6rem] font-semibold text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200">
                        Premium
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
