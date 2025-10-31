

"use client";

import React from "react";
import { Course } from "@/types/course";
import { useUpdateCourse } from "@/hooks/useCourses";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const PublishCourseForm = ({ course }: { course: Course }) => {
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();
  const router = useRouter();

  const isPublished = course?.isPublished ?? false;

  const handleToggle = () => {
    const newValue = !isPublished;

    if (!course?.id) return;

    updateCourse(
      {
        courseId: course.id,
        updates: {
          isPublished: newValue,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            newValue
              ? "Course published successfully!"
              : "Course unpublished successfully"
          );
          router.refresh();
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to update course status");
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-3">
      {/* Loading Spinner */}
      {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}

      {/* Custom Switch */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={isUpdating}
        className={`
    relative inline-flex h-5 w-9 items-center rounded-full 
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500
    ${isPublished ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}
    ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
  `}
      >
        {/* Switch Knob */}
        <span
          className={`
    absolute inline-block ml-1  h-3 w-3 rounded-full bg-white shadow 
    transition-all duration-200
    ${isPublished ? "right-1" : "left-1"}
  `}
        />
      </button>

      {/* Status Label */}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {isPublished ? "Published" : "Draft"}
      </span>
    </div>
  );
};

export default PublishCourseForm;

export const CustomSwitch = ({
  checked,
  color,
  disabled,
  onCheckedChange,
}: {
  checked: boolean;
  color: string;
  disabled: boolean;
  onCheckedChange: any;
}) => {
  return (
    <button
      type="button"
      onClick={onCheckedChange}
      disabled={disabled}
      className={`
    relative inline-flex h-5 w-9 items-center rounded-full 
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500
    ${checked ? `bg-${color}-500` : "bg-gray-300 dark:bg-gray-600"}
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    `}
    >
      {/* Switch Knob */}
      <span
        className={`absolute inline-block ml-1  h-3 w-3 rounded-full bg-white shadow transition-all duration-200 ${checked ? "right-1" : "left-1"}`}
      />
    </button>
  );
};
