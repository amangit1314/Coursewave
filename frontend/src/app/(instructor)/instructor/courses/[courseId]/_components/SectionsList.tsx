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
import { Course } from "@/types/course";
import { cn } from "@/lib/utils/utils";
import { CourseSection } from "@/types/course-details-api-response";
import { SectionItem } from "./SectionItem";

interface SectionsListProps {
  course: Course;
  // chapters: Chapter[];
  items: CourseSection[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (section: CourseSection) => void;
  onDelete: (sectionId: string) => void;
  isPending?: boolean;
}

export const SectionsList = ({
  course,
  // chapters,
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
                      // chapters={chapters}
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
