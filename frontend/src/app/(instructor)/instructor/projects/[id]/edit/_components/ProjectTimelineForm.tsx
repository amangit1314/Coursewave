"use client";

import React from "react";
import { Calendar } from "lucide-react";

interface ProjectTimelineFormProps {
  formData: {
    startDate: string;
    deadline: string;
    endDate: string;
    maxSubmissions: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const ProjectTimelineForm = ({
  formData,
  onInputChange,
}: ProjectTimelineFormProps) => {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200/50 dark:border-zinc-700/50">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        Timeline & Submissions
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={onInputChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={onInputChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={onInputChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Max Submissions
          </label>
          <input
            type="number"
            name="maxSubmissions"
            value={formData.maxSubmissions}
            onChange={onInputChange}
            min="1"
            className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Unlimited"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Leave empty for unlimited submissions
          </p>
        </div>
      </div>
    </div>
  );
};
