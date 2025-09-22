import React from "react";

import { useCourseAttachments } from "@/hooks/useCourses";
import { useCoursesStore } from "@/zustand/coursesStore";
import { Attachment } from "@/types/attachment";

import CourseAttachmentItem from "./CourseAttachmentItem";

export default function CourseAttachments() {
  const { selectedCourse } = useCoursesStore();
  const courseId = selectedCourse?.id ?? "";
  const { data: courseAttachmentsData } = useCourseAttachments(courseId);
  const courseAttachments = courseAttachmentsData ?? [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Course Resources
      </h3>
      {courseAttachments && courseAttachments.length > 0 ? (
        <ul className="space-y-2">
          {courseAttachments.map((attachment: Attachment) => (
            <CourseAttachmentItem
              key={attachment.id}
              id={attachment.id}
              url={attachment.url}
              name={attachment.name}
              type={attachment.type}
            />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No attachments available for this course.
        </p>
      )}
    </div>
  );
}
