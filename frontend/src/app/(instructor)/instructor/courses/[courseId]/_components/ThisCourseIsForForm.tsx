"use client";

import React from "react";
import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, X, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Course } from "@/types/course";
import { dmSans } from "@/lib/config/fonts";
import { useUpdateCourse } from "@/hooks/useCourses";

const formSchema = z.object({
  targetAudience: z.array(z.string().min(1, "Target audience cannot be empty")),
});

const defaultTargetAudience = [
  "Who wants to learn.",
  "Want to understand concepts of this topic.",
  "If you are a enthusiast of subject.",
];

export const ThisCourseIsForForm = ({ course }: { course: Course }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [targetAudience, setTargetAudience] = useState<string[]>(
    course?.targetAudience || defaultTargetAudience
  );
  const [newTargetAudience, setNewTargetAudience] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  const { mutate: updateCourse } = useUpdateCourse();

  const addTargetAudience = () => {
    const trimmedValue = newTargetAudience.trim();
    if (trimmedValue && !targetAudience.includes(trimmedValue)) {
      setTargetAudience([...targetAudience, trimmedValue]);
      setNewTargetAudience("");
    } else if (targetAudience.includes(trimmedValue)) {
      toast.error("This target audience already exists");
    }
  };

  const removeTargetAudience = async (index: number) => {
    setDeletingId(index.toString());
    const updatedTargetAudience = targetAudience.filter((_, i) => i !== index);
    setTargetAudience(updatedTargetAudience);
    setDeletingId(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTargetAudience();
    }
  };

  const onSubmit = async () => {
    if (targetAudience.length === 0) {
      toast.error("Please add at least one target audience");
      return;
    }

    setIsSubmitting(true);
    try {
      updateCourse(
        {
          courseId: course.id,
          updates: {
            targetAudience,
          },
        },
        {
          onSuccess: () => {
            toast.success("Course target audience updated successfully ...");
            toggleEdit();
            router.refresh();
          },
          onError: (error: { message: any }) => {
            toast.error(error.message || "Something went wrong ...");
          },
        }
      );
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong ...");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    setTargetAudience(course?.targetAudience || defaultTargetAudience);
    setNewTargetAudience("");
    toggleEdit();
  };

  return (
    <div className="mt-6 rounded-2xl bg-slate-100 p-4 dark:bg-zinc-900">
      <div className={`${dmSans.className} mb-4 flex items-center justify-between font-medium`}>
        This Course is for
        <Button onClick={toggleEdit} variant="outline" className="rounded-full">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4" />
              Add a point
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {targetAudience.length === 0 && (
            <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">
              No points yet
            </p>
          )}

          {targetAudience.length > 0 && (
            <div className="space-y-2">
              {targetAudience.map((audience: string, index: any) => (
                <div
                  key={index}
                  className="flex w-full items-center rounded-xl border border-sky-200 bg-sky-100 p-3 text-sky-700 dark:border-none dark:bg-zinc-800 dark:text-gray-100"
                >
                  <Pencil className="mr-2 h-4 w-4 flex-shrink-0" />
                  <p className="line-clamp-1 text-[12px]">{audience}</p>
                  {deletingId === index.toString() && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== index.toString() && (
                    <button
                      onClick={() => removeTargetAudience(index)}
                      className="ml-auto transition hover:opacity-75"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div className="mt-4 space-y-4">
          {/* Current Target Audience List */}
          {targetAudience.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Target Audience:
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {targetAudience.map((audience, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-sky-200 bg-sky-100 p-3 text-sky-700 dark:border-none dark:bg-zinc-800 dark:text-gray-100"
                  >
                    <div className="flex items-center space-x-2">
                      <Pencil className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{audience}</span>
                    </div>
                    <button
                      onClick={() => removeTargetAudience(index)}
                      className="ml-auto transition hover:opacity-75"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Target Audience */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Add New Target Audience:
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter who this course is for (e.g., 'Beginners in web development')"
                value={newTargetAudience}
                onChange={(e) => setNewTargetAudience(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 dark:bg-zinc-800"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                onClick={addTargetAudience}
                disabled={!newTargetAudience.trim() || isSubmitting}
                size="sm"
                className="whitespace-nowrap"
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Press Enter to quickly add
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={targetAudience.length === 0 || isSubmitting}
              className="dark:bg-zinc-800 dark:text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};