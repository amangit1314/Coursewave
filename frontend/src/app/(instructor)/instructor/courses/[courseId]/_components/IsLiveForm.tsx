"use client";

import React from "react";
import { Course } from "@/types/course";
import { useUpdateCourse } from "@/hooks/useCourses";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const IsLiveForm = ({ course }: { course: Course }) => {
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();
  const router = useRouter();

  const isLive = course?.isLive ?? false;

  const handleToggle = () => {
    const newValue = !isLive;

    if (!course?.id) return;

    updateCourse(
      {
        courseId: course.id,
        updates: {
          isLive: newValue,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            newValue ? "Course is now live!" : "Course is no longer live"
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
          ${isLive ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}
          ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {/* Switch Knob */}
        <span
          className={`
            inline-block mx-1 h-3 w-3 transform rounded-full bg-white shadow 
            transition-transform duration-200
            ${isLive ? "translate-x-5" : "translate-x-1"}
          `}
        />
      </button>

      {/* Status Label */}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {isLive ? "Live Course" : "Regular Course"}
      </span>
    </div>
  );
};

export default IsLiveForm;
