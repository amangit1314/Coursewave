import { Suspense } from "react";
import CoursePreviewClient from "./course-preview-client-component";

export default function CoursePreview({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={""}>
      <CoursePreviewClient courseId={params.id} />
    </Suspense>
  );
}
