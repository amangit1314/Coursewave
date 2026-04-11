"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil, FileText, Video, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
// import { Chapter } from "@/types/course-details-api-response";
import { EditChapterSheet } from "./EditChapterSheet";

import { toast } from "sonner";
import { useUpdateChapter } from "@/hooks/useCourses";
import { Chapter } from "@/types/courses.service.types";

type Props = {
  chapter: Chapter;
  index: number;
  onEdit: any;
  courseId: string; // Add courseId prop
  sectionId: string; // Add sectionId prop
};

type ContentType = "text" | "video" | "quiz";

const ChapterItem = (props: Props) => {
  const { chapter, index, courseId, sectionId } = props;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const router = useRouter();

  // Use the update chapter hook
  const updateChapterMutation = useUpdateChapter(courseId, sectionId);

  // In ChapterItem.tsx - handleSaveChapter function
  const handleSaveChapter = async (chapterData: Partial<Chapter>) => {
    try {
      // Normalize nullable fields so they conform to Partial<Chapter> (no nulls)
      const sanitizedData: Partial<Chapter> = {
        ...chapterData,
        // Convert explicit null description to undefined to match Chapter type
        description:
          chapterData.description === null
            ? undefined
            : chapterData.description,
      };

    await updateChapterMutation.mutateAsync({
      chapterId: chapter.id,
      updates: sanitizedData, // This should now contain content as object
    });

    toast.success("Chapter updated successfully!");
    setEditDialogOpen(false);
  } catch (error) {
    console.error("Failed to update chapter:", error);
    toast.error("Failed to update chapter. Please try again.");
  }
};

const getContentIcon = () => {
  switch (chapter.contentType.toLocaleLowerCase() as ContentType) {
    case "video":
      return <Video className="h-3.5 w-3.5" />;
    case "quiz":
      return <ClipboardList className="h-3.5 w-3.5" />;
    default:
      return <FileText className="h-3.5 w-3.5" />;
  }
};

return (
  <>
    <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={provided.draggableProps.style as React.CSSProperties}
          className={cn(
            "group flex items-center gap-3 rounded-xl border bg-gray-50 px-4 py-3.5 text-sm transition-all duration-200",
            "hover:shadow-md hover:border-gray-300",
            "dark:bg-zinc-800 dark:border-zinc-700 dark:hover:border-zinc-600",
            chapter.isPublished &&
            "border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/20",
            snapshot.isDragging &&
            "rotate-1 scale-[1.02] shadow-xl border-blue-400 dark:border-blue-500"
          )}
        >
          {/* Drag handle */}
          <div
            {...provided.dragHandleProps}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-200",
              "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50",
              "dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-blue-500 dark:hover:bg-blue-950/30",
              "cursor-grab active:cursor-grabbing active:scale-95",
              chapter.isPublished &&
              "border-blue-300 bg-blue-100/50 dark:border-blue-800 dark:bg-blue-900/30"
            )}
          >
            <Grip className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
          </div>

          {/* Content type icon */}
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm",
              chapter.isPublished && "from-blue-600 to-blue-700"
            )}
          >
            {getContentIcon()}
          </div>

          {/* Chapter info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {index + 1}.
              </span>
              <p className="truncate font-semibold text-gray-900 dark:text-white">
                {chapter.title}
              </p>
            </div>
          </div>

          {/* Badges and actions */}
          <div className="flex items-center gap-2 shrink-0">
            {chapter.isFree && (
              <Badge className="border border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 rounded-full text-xs font-bold px-2.5 py-0.5 shadow-sm">
                Free
              </Badge>
            )}

            <Badge
              className={cn(
                "text-xs font-bold rounded-full border px-2.5 py-0.5 shadow-sm transition-all duration-200",
                chapter.isPublished
                  ? "bg-gradient-to-r from-green-500 to-green-600 border-green-600 text-white dark:from-green-600 dark:to-green-700 dark:border-green-500"
                  : "bg-amber-100 border-amber-400 text-amber-900 dark:bg-amber-900/50 dark:border-amber-600 dark:text-amber-200"
              )}
            >
              {chapter.isPublished ? "Published" : "Draft"}
            </Badge>

            <button
              onClick={() => setEditDialogOpen(true)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200",
                "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:scale-105",
                "dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-blue-500 dark:hover:bg-blue-950/30",
                "active:scale-95"
              )}
            >
              <Pencil className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </button>
          </div>
        </div>
      )}
    </Draggable>

    <EditChapterSheet
      open={editDialogOpen}
      onOpenChange={setEditDialogOpen}
      chapter={{
        ...chapter,
        contentType: chapter.contentType.toLowerCase() as
          | "VIDEO"
          | "QUIZ"
          | "TEXT"
          | "ASSIGNMENT",
      }}
      onSave={handleSaveChapter}
      isLoading={updateChapterMutation.isPending} // Pass loading state
    />
  </>
);
};

export default ChapterItem;
