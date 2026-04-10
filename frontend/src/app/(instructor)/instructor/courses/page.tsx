"use client";

import dynamic from "next/dynamic";
import { LoadingPage } from "@/components/shared";

const CreatedCourses = dynamic(() => import("./_components/CreatedCoursesPage"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <LoadingPage variant="cards" />
    </div>
  ),
});

export default function CoursesPage() {
  return <CreatedCourses />;
}
