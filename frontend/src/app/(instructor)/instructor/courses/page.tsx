"use client";

import dynamic from "next/dynamic";

const CreatedCourses = dynamic(() => import("./_components/CreatedCoursesPage"), {
  ssr: false,
  loading: () => (
    <div className="h-full pt-6 dark:bg-zinc-900">
      <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading courses...</p>
      </div>
    </div>
  ),
});

export default function CoursesPage() {
  return <CreatedCourses />;
}
