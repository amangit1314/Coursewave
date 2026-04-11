"use client";

import React from "react";
import { BookOpen, User, Sparkles } from "lucide-react";
import { dmSans } from "@/lib/config/fonts";
import { UseFormReturn } from "react-hook-form";

interface CourseBasicInfoStepProps {
  form: UseFormReturn<any>;
  errors: any;
  watchedFields: any;
  isAIGenerating: boolean;
  onAIDescription: () => void;
}

export const CourseBasicInfoStep = ({
  form,
  errors,
  watchedFields,
  isAIGenerating,
  onAIDescription,
}: CourseBasicInfoStepProps) => {
  return (
    <div className="space-y-6">
      <h2
        className={`${dmSans.className} text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center `}
      >
        <BookOpen className="mr-3 text-blue-500" />
        Basic Information
      </h2>

      {/* Course Title */}
      <div className="space-y-2">
        <label
          className={`${dmSans.className} block text-sm font-semibold text-gray-700 dark:text-zinc-200`}
        >
          Course Title *
        </label>
        <input
          {...form.register("title")}
          placeholder="e.g., Complete Web Development Bootcamp"
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Instructor Name */}
      <div className="space-y-2">
        <label
          className={`${dmSans.className} block text-sm font-semibold text-gray-700 dark:text-zinc-200 flex items-center`}
        >
          <User className="mr-2" size={16} />
          Instructor Name *
        </label>
        <input
          {...form.register("instructorName")}
          placeholder="Your full name"
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {errors.instructorName && (
          <p className="text-red-500 text-sm">
            {errors.instructorName.message}
          </p>
        )}
      </div>

      {/* Course Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            className={`${dmSans.className} block text-sm font-semibold text-gray-700 dark:text-zinc-200`}
          >
            Course Description *
          </label>
          <button
            type="button"
            onClick={onAIDescription}
            disabled={isAIGenerating}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 rounded-full hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors disabled:opacity-50"
          >
            {isAIGenerating ? (
              <span className="h-3 w-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            {isAIGenerating ? "Generating..." : "AI Generate"}
          </button>
        </div>
        <textarea
          {...form.register("courseDescription")}
          rows={6}
          placeholder="Describe what students will learn in this course. Include key benefits and outcomes. Minimum 150 characters."
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
        />
        <div className="flex justify-between items-center">
          {errors.courseDescription && (
            <p className="text-red-500 text-sm">
              {errors.courseDescription.message}
            </p>
          )}
          <p className="text-sm text-gray-500 ml-auto">
            {watchedFields.courseDescription?.length || 0}/1000
            characters
          </p>
        </div>
      </div>
    </div>
  );
};
