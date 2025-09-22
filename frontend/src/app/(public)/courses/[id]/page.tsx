import CoursePreviewClient from "./_components/CoursePreviewClientComponent";

export default function CoursePreview({ params }: { params: { id: string } }) {
  return <CoursePreviewClient courseId={params.id} />;
}
