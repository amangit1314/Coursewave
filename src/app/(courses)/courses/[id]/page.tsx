import { Suspense } from "react";
import CoursePreviewClient from "./_components/CoursePreviewClientComponent";

export default async function CoursePreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <Suspense fallback={""}>
      <CoursePreviewClient courseId={id} />
    </Suspense>
  );
}