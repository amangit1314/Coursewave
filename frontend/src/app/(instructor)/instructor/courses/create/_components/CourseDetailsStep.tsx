"use client";

import React, { RefObject } from "react";
import { Tag, DollarSign, ImageIcon, Upload, X } from "lucide-react";
import { dmSans } from "@/lib/config/fonts";
import { UseFormReturn } from "react-hook-form";
import TagInput from "./TagInput";

interface CourseDetailsStepProps {
  form: UseFormReturn<any>;
  errors: any;
  watchedFields: any;
  imageUrl: string;
  dragActive: boolean;
  isUploading: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDrag: (e: any) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileUpload: (file: File) => Promise<void>;
  onImageClear: () => void;
}

export const CourseDetailsStep = ({
  form,
  errors,
  watchedFields,
  imageUrl,
  dragActive,
  isUploading,
  fileInputRef,
  onDrag,
  onDrop,
  onFileUpload,
  onImageClear,
}: CourseDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <h2
        className={`${dmSans.className} text-2xl font-bold text-gray-800 dark:text-zinc-100 mb-6 flex items-center`}
      >
        <Tag className="mr-3 text-blue-500" />
        Course Details
      </h2>

      {/* Categories */}
      <div className="space-y-2">
        <label
          className={`${dmSans.className} block text-sm font-semibold text-gray-700 dark:text-zinc-200`}
        >
          Course Categories *
        </label>
        <TagInput
          value={watchedFields.courseCategories}
          onChange={(value: string) =>
            form.setValue("courseCategories", value, {
              shouldValidate: true,
            })
          }
          placeholder="Add categories (e.g., Web Development, React)"
          icon={Tag}
        />
        {errors.courseCategories && (
          <p className="text-red-500 text-sm">
            {errors.courseCategories.message}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <label
          className={`${dmSans.className} block text-sm font-semibold text-gray-700 dark:text-zinc-200 flex items-center`}
        >
          <DollarSign className="mr-2" size={16} />
          Course Price (USD) *
        </label>
        <div className="relative flex items-center">
          <DollarSign
            className="absolute left-3 text-gray-400"
            size={18}
          />
          <input
            {...form.register("coursePrice")}
            type="number"
            min="1"
            max="500"
            placeholder="49"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        {errors.coursePrice && (
          <p className="text-red-500 text-sm">
            {errors.coursePrice.message}
          </p>
        )}
        <p className="text-sm text-gray-500">
          Recommended: $1-$500 for optimal enrollment
        </p>
      </div>

      {/* Course Image */}
      <div className="space-y-2">
        <label
          className={`${dmSans.className} block text-sm font-semibold text-gray-700 dark:text-zinc-200 flex items-center`}
        >
          <ImageIcon className="mr-2" size={16} />
          Course Image *
        </label>
        <div
          className={`relative border border-dashed rounded-xl p-2 transition-all duration-200 ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }`}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
        >
          {isUploading ? (
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p
                className={`${dmSans.className} text-lg font-semibold text-gray-700 dark:text-zinc-200 mb-2`}
              >
                Uploading image...
              </p>
              <p className="text-sm text-gray-500">Please wait</p>
            </div>
          ) : imageUrl ? (
            <div className="relative">
              <img
                src={imageUrl}
                alt="Course preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={onImageClear}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="text-center p-8">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p
                className={`${dmSans.className} text-lg font-semibold text-gray-700 dark:text-zinc-200 mb-2`}
              >
                Drop your image here, or{" "}
                <button
                  type="button"
                  onClick={() =>
                    (fileInputRef.current as HTMLInputElement | null)?.click()
                  }
                  className="text-blue-500 hover:text-blue-600 underline transition-colors"
                >
                  browse
                </button>
              </p>
              <p className="text-sm text-gray-500">
                Recommended: 16:9 aspect ratio, max 5MB
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await onFileUpload(file);
            }}
            className="hidden"
          />
        </div>
        {errors.image && (
          <p className="text-red-500 text-sm">
            {errors.image.message}
          </p>
        )}
      </div>
    </div>
  );
};
