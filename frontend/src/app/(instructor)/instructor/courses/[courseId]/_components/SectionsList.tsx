// "use client";

// import { useEffect, useState } from "react";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
//   DraggableProvided,
//   DraggableStateSnapshot,
// } from "@hello-pangea/dnd";
// import { Grip, Pencil, Trash2, Loader2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { ChaptersForm } from "./ChaptersForm";
// import { Course } from "@/types/course";
// import { Chapter } from "@/types/course-details-api-response";

// import { dmSans } from "@/lib/config/fonts";
// import { cn } from "@/lib/utils/utils";
// // import { CourseSection } from "@/types/courses.service.types";
// import { CourseSection } from "@/types/course-details-api-response";

// interface SectionsListProps {
//   course: Course;
//   chapters: Chapter[];
//   items: CourseSection[];
//   onReorder: (updateData: { id: string; position: number }[]) => void;
//   onEdit: (section: CourseSection) => void;
//   onDelete: (sectionId: string) => void;
//   isPending?: boolean;
// }

// export const SectionsList = ({
//   course,
//   chapters,
//   items,
//   onReorder,
//   onEdit,
//   onDelete,
//   isPending = false,
// }: SectionsListProps) => {
//   const [isMounted, setIsMounted] = useState(false);
//   const [sections, setSections] = useState(items);
//   const [deletingSectionId, setDeletingSectionId] = useState<string | null>(
//     null
//   );

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   useEffect(() => {
//     setSections(items);
//   }, [items]);

//   const onDragEnd = (result: DropResult) => {
//     if (!result.destination) return;

//     const items = Array.from(sections);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);

//     const startIndex = Math.min(result.source.index, result.destination.index);
//     const endIndex = Math.max(result.source.index, result.destination.index);

//     const updatedSections = items.slice(startIndex, endIndex + 1);

//     setSections(items);

//     const bulkUpdateData = updatedSections.map((section) => ({
//       id: section.id,
//       position: items.findIndex((item) => item.id === section.id),
//     }));

//     onReorder(bulkUpdateData);
//   };

//   const handleDelete = async (sectionId: string) => {
//     setDeletingSectionId(sectionId);
//     onDelete(sectionId);
//     // Reset deleting state after a short delay to allow the mutation to complete
//     setTimeout(() => setDeletingSectionId(null), 2000);
//   };

//   if (!isMounted) {
//     return null;
//   }

//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <Droppable droppableId="sections">
//         {(provided) => (
//           <div {...provided.droppableProps} ref={provided.innerRef}>
//             {sections.map((section, index) => (
//               <Draggable
//                 key={section.id}
//                 draggableId={section.id}
//                 index={index}
//                 isDragDisabled={isPending}
//               >
//                 {(
//                   provided: DraggableProvided,
//                   snapshot: DraggableStateSnapshot
//                 ) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     className={cn("mb-4", snapshot.isDragging && "opacity-60")}
//                     // Use type assertion for style to avoid TypeScript errors
//                     style={provided.draggableProps.style as React.CSSProperties}
//                   >
//                     <SectionItem
//                       course={course}
//                       section={section}
//                       chapters={chapters}
//                       dragHandleProps={provided.dragHandleProps}
//                       onEdit={onEdit}
//                       onDelete={handleDelete}
//                       isDeleting={deletingSectionId === section.id && isPending}
//                       isPending={isPending}
//                     />
//                   </div>
//                 )}
//               </Draggable>
//             ))}
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//     </DragDropContext>
//   );
// };

// interface SectionItemProps {
//   course: Course;
//   section: CourseSection;
//   chapters: Chapter[];
//   dragHandleProps?: any;
//   onEdit: (section: CourseSection) => void;
//   onDelete: (sectionId: string) => void;
//   isDeleting?: boolean;
//   isPending?: boolean;
// }

// const SectionItem = ({
//   course,
//   section,
//   chapters,
//   dragHandleProps,
//   onEdit,
//   onDelete,
//   isDeleting = false,
//   isPending = false,
// }: SectionItemProps) => {
//   const [isUpdating, setIsUpdating] = useState(false);

//   const toggleEditing = () => {
//     setIsUpdating((current) => !current);
//   };

//   const handleEdit = () => {
//     onEdit(section);
//   };

//   const handleDelete = () => {
//     onDelete(section.id);
//   };

//   // Filter chapters for this specific section
//   const sectionChapters = chapters.filter(
//     (chapter) => chapter.sectionId === section.id
//   );

//   return (
//     <div className="relative mt-6 w-full rounded-2xl bg-gray-50 p-4 dark:bg-zinc-800 space-y-4">
//       {/* Loading overlay for delete operation */}
//       {isDeleting && (
//         <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-500/20 z-10">
//           <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
//         </div>
//       )}

//       <div className="flex items-start justify-between gap-4">
//         {/* Drag handle and section info */}
//         <div className="flex items-start gap-3 flex-1">
//           <div
//             {...dragHandleProps}
//             className={cn(
//               "flex items-center justify-center h-8 w-8 rounded-md border border-transparent transition-colors",
//               "hover:border-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700",
//               "cursor-grab active:cursor-grabbing",
//               isPending && "cursor-not-allowed opacity-50"
//             )}
//           >
//             <Grip className="h-4 w-4 text-gray-500" />
//           </div>

//           <div className="flex-1">
//             <div className="flex items-center gap-2 mb-1">
//               <span
//                 className={`${dmSans.className} text-blue-500 dark:text-blue-400 font-medium text-sm`}
//               >
//                 {section.position}.
//               </span>
//               <h3
//                 className={`${dmSans.className} font-semibold text-black dark:text-white text-lg`}
//               >
//                 {section.title}
//               </h3>
//             </div>

//             <p className="line-clamp-2 text-sm text-gray-600 dark:text-zinc-300 font-light mb-2">
//               {section.description}
//             </p>

//             {/* Section stats */}
//             <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-zinc-400">
//               <span>
//                 {sectionChapters.length} chapter
//                 {sectionChapters.length !== 1 ? "s" : ""}
//               </span>
//               {section.createdAt && (
//                 <span>
//                   Created: {new Date(section.createdAt).toLocaleDateString()}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Action buttons */}
//         <div className="flex items-center gap-2">
//           <Button
//             onClick={handleEdit}
//             variant="outline"
//             size="sm"
//             className={`${dmSans.className} rounded-full dark:text-white`}
//             disabled={isPending}
//           >
//             <Pencil className="h-3 w-3 mr-1" />
//             Edit
//           </Button>

//           <Button
//             onClick={handleDelete}
//             variant="destructive"
//             size="sm"
//             className="rounded-full"
//             disabled={isPending || isDeleting}
//           >
//             {isDeleting ? (
//               <Loader2 className="h-3 w-3 animate-spin" />
//             ) : (
//               <Trash2 className="h-3 w-3 mr-1" />
//             )}
//             Delete
//           </Button>
//         </div>
//       </div>

//       {/* Chapters for this section */}
//       {!isUpdating && (
//         <div className="ml-11">
//           <ChaptersForm
//             course={course}
//             chapters={sectionChapters}
//             section={section}
//           />
//         </div>
//       )}
//     </div>
//   );
// };


"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { Grip, Pencil, Trash2, Loader2, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChaptersForm } from "./ChaptersForm";
import { Course } from "@/types/course";
import { Chapter } from "@/types/course-details-api-response";

import { dmSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";
import { CourseSection } from "@/types/course-details-api-response";

interface SectionsListProps {
  course: Course;
  chapters: Chapter[];
  items: CourseSection[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (section: CourseSection) => void;
  onDelete: (sectionId: string) => void;
  isPending?: boolean;
}

export const SectionsList = ({
  course,
  chapters,
  items,
  onReorder,
  onEdit,
  onDelete,
  isPending = false,
}: SectionsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [sections, setSections] = useState(items);
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setSections(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedSections = items.slice(startIndex, endIndex + 1);

    setSections(items);

    const bulkUpdateData = updatedSections.map((section) => ({
      id: section.id,
      position: items.findIndex((item) => item.id === section.id),
    }));

    onReorder(bulkUpdateData);
  };

  const handleDelete = async (sectionId: string) => {
    setDeletingSectionId(sectionId);
    onDelete(sectionId);
    setTimeout(() => setDeletingSectionId(null), 2000);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {sections.map((section, index) => (
              <Draggable
                key={section.id}
                draggableId={section.id}
                index={index}
                isDragDisabled={isPending}
              >
                {(
                  provided: DraggableProvided,
                  snapshot: DraggableStateSnapshot
                ) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn("mb-6", snapshot.isDragging && "opacity-60")}
                    style={provided.draggableProps.style as React.CSSProperties}
                  >
                    <SectionItem
                      course={course}
                      section={section}
                      chapters={chapters}
                      dragHandleProps={provided.dragHandleProps}
                      onEdit={onEdit}
                      onDelete={handleDelete}
                      isDeleting={deletingSectionId === section.id && isPending}
                      isPending={isPending}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

interface SectionItemProps {
  course: Course;
  section: CourseSection;
  chapters: Chapter[];
  dragHandleProps?: any;
  onEdit: (section: CourseSection) => void;
  onDelete: (sectionId: string) => void;
  isDeleting?: boolean;
  isPending?: boolean;
}

const SectionItem = ({
  course,
  section,
  chapters,
  dragHandleProps,
  onEdit,
  onDelete,
  isDeleting = false,
  isPending = false,
}: SectionItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleEditing = () => {
    setIsUpdating((current) => !current);
  };

  const handleEdit = () => {
    onEdit(section);
  };

  const handleDelete = () => {
    onDelete(section.id);
  };

  const sectionChapters = chapters.filter(
    (chapter) => chapter.sectionId === section.id
  );

  return (
    <div className="relative w-full rounded-2xl bg-gray-50 dark:bg-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-zinc-700">
      {/* Loading overlay for delete operation */}
      {isDeleting && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Deleting section...
            </span>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Drag handle and section info */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div
              {...dragHandleProps}
              className={cn(
                "flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 transition-all duration-200",
                "hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30",
                "cursor-grab active:cursor-grabbing active:scale-95",
                isPending && "cursor-not-allowed opacity-50"
              )}
            >
              <Grip className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Section header */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`${dmSans.className} inline-flex items-center justify-center h-7 min-w-[28px] px-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-sm shadow-sm`}
                >
                  {section.position}
                </span>
                <h3
                  className={`${dmSans.className} font-bold text-gray-900 dark:text-white text-xl tracking-tight truncate`}
                >
                  {section.title}
                </h3>
              </div>

              {/* Description */}
              <p className="line-clamp-2 text-sm text-gray-600 dark:text-zinc-400 leading-relaxed mb-4">
                {section.description}
              </p>

              {/* Section stats */}
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
                  <BookOpen className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                  <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">
                    {sectionChapters.length} chapter
                    {sectionChapters.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {section.createdAt && (
                  <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium">
                    {new Date(section.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              className={cn(
                `${dmSans.className} rounded-xl border font-medium transition-all duration-200`,
                "hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700",
                "dark:hover:bg-blue-950/30 dark:hover:border-blue-500 dark:hover:text-blue-400",
                "dark:text-white dark:border-zinc-700"
              )}
              disabled={isPending}
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>

            <Button
              onClick={handleDelete}
              variant="destructive"
              size="sm"
              className={cn(
                "rounded-xl font-medium transition-all duration-200 shadow-sm",
                "hover:shadow-md active:scale-95"
              )}
              disabled={isPending || isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              )}
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Chapters for this section */}
      {!isUpdating && sectionChapters.length > 0 && (
        <div className="px-5 pb-5">
          <div className="ml-14 pt-4 border-t border-gray-200 dark:border-zinc-700">
            <ChaptersForm
              course={course}
              chapters={sectionChapters}
              section={section}
            />
          </div>
        </div>
      )}
    </div>
  );
};