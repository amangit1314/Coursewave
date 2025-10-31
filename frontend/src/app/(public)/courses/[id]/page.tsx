"use client";

import { useParams } from "next/navigation";
import CoursePreviewClient from "./_components/CoursePreviewClientComponent";

export default function CoursePreview() {
  const params = useParams<{ id: string }>();
  return <CoursePreviewClient courseId={params.id} />;
}
