"use client";

import React from "react";
import {
  BookOpen,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";

interface ProjectBasicInfoFormProps {
  formData: {
    title: string;
    slug: string;
    description: string;
    status: string;
    difficulty: string;
  };
  thumbnailPreview: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onThumbnailClear: () => void;
}

export const ProjectBasicInfoForm = ({
  formData,
  thumbnailPreview,
  onInputChange,
  onThumbnailChange,
  onThumbnailClear,
}: ProjectBasicInfoFormProps) => {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200/50 dark:border-zinc-700/50">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        Basic Information
      </h2>

      <div className="space-y-6">
        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
            Project Thumbnail
          </label>
          <div className="flex items-start gap-6">
            {thumbnailPreview ? (
              <div className="relative group">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-48 h-48 object-cover rounded-xl border-2 border-zinc-200 dark:border-zinc-700 shadow-lg"
                />
                <button
                  type="button"
                  onClick={onThumbnailClear}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 hover:scale-110"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors" />
              </div>
            ) : (
              <div className="w-48 h-48 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50">
                <ImageIcon className="w-16 h-16 text-zinc-400" />
              </div>
            )}
            <div className="flex-1">
              <label className="cursor-pointer block">
                <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all">
                  <Upload className="w-10 h-10 mx-auto mb-3 text-zinc-400" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onThumbnailChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Enter project title"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm"
            placeholder="project-slug"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            URL-friendly version of the title. Use lowercase letters and
            hyphens only.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            required
            rows={6}
            className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            placeholder="Describe your project in detail..."
          />
        </div>

        {/* Status and Difficulty */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={onInputChange}
              className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
              <option value="archived">Archived</option>
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 dark:text-zinc-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={onInputChange}
              className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 dark:text-zinc-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
