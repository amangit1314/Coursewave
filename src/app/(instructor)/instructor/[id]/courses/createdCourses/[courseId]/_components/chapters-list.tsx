"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";
import { cn } from "@/utils/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import useCourseInfo from "@/hooks/use-course-info";

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  // onEdit: (id: string) => void;
  instructorId: string;
}

export const ChaptersList = ({
  items,
  onReorder,
  instructorId,
  // onEdit,
}: ChaptersListProps) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setChapters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdateData);
  };

  const onEdit = (
    instructorId: string,
    courseId: string,
    sectionId: string,
    id: string
  ) => {
    setIsEditing(true);
    router.push(
      `/instructor/${instructorId}/courses/createdCourses/${courseId}/sections/${sectionId}/chapters/${id}`
    );
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div>
                    {!isEditing ? (
                      <div
                        className={cn(
                          "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 dark:text-gray-400 dark:bg-zinc-800 dark:border-none rounded-md mb-4 text-sm  transition-all duration-300",
                          chapter.isPublished &&
                            "bg-blue-100 border-blue-200 text-blue-600  transition-all duration-300"
                        )}
                        // ref={provided.innerRef}{...provided.draggableProps}
                      >
                        {/* grip icon */}
                        <div
                          className={cn(
                            "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md  transition-all duration-300",
                            chapter.isPublished &&
                              "border-r hover:bg-blue-200 dark:hover:bg-zinc-950  transition-all duration-300"
                          )}
                          {...provided.dragHandleProps}
                        >
                          <Grip className="h-5 w-5" />
                        </div>

                        {/* chapter title */}
                       <p className="not-italic">
                       {chapter.title}
                       </p>

                        {/* isFree badge, published or in draft badge, pencil icon */}
                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                          {/* isFree badge */}
                          {chapter.isFree && <Badge>Free</Badge>}

                          {/* published or in draft badge */}
                          <Badge
                            className={cn(
                              "bg-zinc-500 dark:text-gray-400 dark:bg-zinc-800 not-italic text-xs  transition-all duration-300",
                              chapter.isPublished && "bg-zinc-500 dark:bg-zinc-800 cursor-not-allowed  transition-all duration-300"
                            )}
                          >
                            {chapter.isPublished ? "Published" : "Draft"}
                          </Badge>

                          {/* pencil icon */}
                          <Pencil
                            onClick={() =>
                              onEdit(
                                instructorId,
                                chapter.courseId,
                                chapter.courseSectionId!,
                                chapter.id
                              )
                            }
                            className="w-4 h-4 hover:text-black dark:hover:text-white cursor-pointer transition-all duration-300"
                          />
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
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
