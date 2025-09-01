"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChaptersForm } from "./ChaptersForm";
import { Course } from "@/types/course";
import { Chapter, CourseSection } from "@/types/course-details-api-response";

interface SectionsListProps {
  course: Course;
  chapters: Chapter[];
  items: CourseSection[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const SectionsList = ({
  course,
  chapters,
  items,
  onReorder,
  onEdit,
}: SectionsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [sections, setSections] = useState(items);

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

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setSections(items);

    const bulkUpdateData = updatedChapters.map((section) => ({
      id: section.id,
      position: items.findIndex((item) => item.id === section.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {sections.map((section, index) => (
              <Draggable
                key={section.id}
                draggableId={section.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div ref={provided.innerRef}>
                    <SectionItem
                      course={course}
                      section={section}
                      chapters={chapters}
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

const SectionItem = ({
  course,
  section,
  chapters,
}: {
  course: Course;
  section: CourseSection;
  chapters: Chapter[];
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleEditing = () => {
    setIsUpdating((current) => !current);
  };

  return (
    <div className="relative mt-6 w-full rounded-2xl border bg-slate-100 p-4 dark:bg-zinc-800">
      <div className="flex items-center justify-between font-medium">
        <div className="space-y-[5px]">
          <p className="space-x-2 text-xs dark:text-gray-400">
            <span className="dark:text-white">{section.position}.</span>
            <span className="font-semibold not-italic dark:text-white">
              {section.title}
            </span>
          </p>

          <p className="line-clamp-2 text-xs">{section.description}</p>
        </div>

        <Button onClick={toggleEditing} variant="ghost">
          {isUpdating ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>

      <ChaptersForm course={course} chapters={chapters} section={section} />
    </div>
  );
};
