// import { db } from "@/lib/db";
// import CourseContent from "./_components/CourseContent";
// // import toast from "react-hot-toast";

// const CourseIdPage = async ({
//   params,
// }: {
//   params: { id: string; courseId: string };
// }) => {
//   const instructorId = params?.id!;
//   const courseId = params?.courseId!;

//   if (!instructorId || !courseId) {
//     throw new Error(
//       "Required parameters Instructor id , course id or both are missing ... "
//     );
//   }

//   const course = await db.course.findUnique({
//     where: {
//       courseId: courseId,
//       instructorID: instructorId,
//     },
//   });

//   if (!course) {
//     console.log('No course found with this id in createdCourse/[courseId] page ...')
//     // toast.error("No course found with these ids ...");
//   }

//   const courseAttachments = await db.courseAttachment.findMany({
//     where: {
//       courseId: course?.courseId,
//     },
//   });

//   if (!courseAttachments) {
//     // toast.error("No course attachments found for this course ...");
//   }

//   const sections = await db.courseSection.findMany({
//     where: {
//       courseId: course?.courseId,
//     },
//   });

//   if (!sections) {
//     console.log("No course sections found for this course ...");
//     // toast.error("No course sections found for this course ...");
//   }

//   const chapters = await db.chapter.findMany({
//     where: {
//       courseId: course?.courseId,
//     },
//   });

//   if (!chapters) {
//     console.log("No course chapters found for this course ...");
//     // toast.error("No course chapters found for this course ...");
//   }

//   return (
//     <div>
//       {course ? (
//         <CourseContent
//           course={course}
//           courseAttachments={courseAttachments}
//           sections={sections}
//           chapters={chapters}
//         />
//       ) : (
//         <div></div>
//       )}
//     </div>
//   );
// };

// export default CourseIdPage;

"use client";

import React from "react";
import CourseContent from "./_components/CourseContent";
import { Chapter } from "@/types/user-enrollments-api-response";
import { CourseSection } from "@/types/course-details-api-response";
import { Course } from "@/types/course";

// ✅ Mock Data
const mockCourse: Course = {
  id: "course-1",
  title: "Mock Course Title",
  description: "This is a mock description",
  imageUrl: "/placeholder.png",
  price: "49.99",
  discount: 10,
  dealPrice: 39.99,
  instructorId: "instructor-123",
  isLive: false,
  isPublished: true,
  averageRating: 4.5,
  categories: ["Programming", "Web Development"],
  duration: 120,
  slug: "mock-course-title",
  learningOutcomes: ["Understand basic concepts", "Build real-world projects"],
  prerequisites: ["Basic programming knowledge"],
  targetAudience: ["Beginners", "Students"],
  technologies: ["React", "Next.js", "TypeScript"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  sections: [], // We'll fill this next
  category: undefined,
  instructor: undefined,
};

const mockCourseAttachments: any[] = [
  {
    id: "att-1",
    courseId: "course-1",
    name: "Attachment 1",
    url: "#",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "att-2",
    courseId: "course-1",
    name: "Attachment 2",
    url: "#",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockSections: CourseSection[] = [
  {
    id: "section-1",
    title: "Introduction",
    description: "Overview of the course and setup instructions.",
    position: 1,
    courseId: "course-1",
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    Chapter: [], // will add chapters here
  },
  {
    id: "section-2",
    title: "Advanced Concepts",
    description: "Deep dive into advanced topics.",
    position: 2,
    courseId: "course-1",
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    Chapter: [],
  },
];

const mockChapters: Chapter[] = [
  {
    id: "chapter-1",
    title: "Getting Started",
    description: "Learn the basics of the course structure.",
    position: 1,
    sectionId: "section-1",
    courseId: "course-1",
    isPublished: true,
    isFree: true,
    contentType: "VIDEO",
    content: "intro-video.mp4",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // duration: 10,
  },
  {
    id: "chapter-2",
    title: "Setting Up the Environment",
    description: "Install Node.js, Next.js, and dependencies.",
    position: 2,
    sectionId: "section-1",
    courseId: "course-1",
    isPublished: true,
    isFree: false,
    contentType: "VIDEO",
    content: "setup-video.mp4",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // duration: 15,
  },
  {
    id: "chapter-3",
    title: "Building the Backend",
    description: "Create an API using Express.",
    position: 1,
    sectionId: "section-2",
    courseId: "course-1",
    isPublished: true,
    isFree: false,
    contentType: "VIDEO",
    content: "backend-video.mp4",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // duration: 20,
  },
];

const CourseIdPage = () => {
  const course = mockCourse;
  const courseAttachments = mockCourseAttachments;
  const sections = mockSections;
  const chapters = mockChapters;

  return (
    <div>
      {course ? (
        <CourseContent
          course={course}
          courseAttachments={courseAttachments}
          sections={sections}
          chapters={chapters}
        />
      ) : (
        <div className="p-6 text-center text-gray-500">
          No course data found...
        </div>
      )}
    </div>
  );
};

export default CourseIdPage;
