"use client";

import React from "react";
import CourseContent from "./_components/CourseContent";
// import { Chapter } from "@/types/user-enrollments-api-response";
// import { CourseSection } from "@/types/course-details-api-response";
import { Course } from "@/types/course";
import { useCourse } from "@/hooks/useCourses";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

// // ✅ Mock Data
// const mockCourse: Course = {
//   id: "course_2025d018",
//   title: "Mock Course Title",
//   description: "This is a mock description",
//   imageUrl: "/placeholder.png",
//   price: "49.99",
//   discount: 10,
//   dealPrice: 39.99,
//   instructorId: "instructor-123",
//   isLive: false,
//   isPublished: true,
//   averageRating: 4.5,
//   categories: ["Programming", "Web Development"],
//   duration: 120,
//   slug: "mock-course-title",
//   learningOutcomes: ["Understand basic concepts", "Build real-world projects"],
//   prerequisites: ["Basic programming knowledge"],
//   targetAudience: ["Beginners", "Students"],
//   technologies: ["React", "Next.js", "TypeScript"],
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),

//   sections: [], // We'll fill this next
//   category: undefined,
//   instructor: undefined,
// };

// const mockCourseAttachments: any[] = [
//   {
//     id: "att-1",
//     courseId: "course-1",
//     name: "Attachment 1",
//     url: "#",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: "att-2",
//     courseId: "course-1",
//     name: "Attachment 2",
//     url: "#",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
// ];

// const mockSections: CourseSection[] = [
//   {
//     id: "section-1",
//     title: "Introduction",
//     description: "Overview of the course and setup instructions.",
//     position: 1,
//     courseId: "course-1",
//     isPublished: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     Chapter: [], // will add chapters here
//   },
//   {
//     id: "section-2",
//     title: "Advanced Concepts",
//     description: "Deep dive into advanced topics.",
//     position: 2,
//     courseId: "course-1",
//     isPublished: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     Chapter: [],
//   },
// ];

// const mockChapters: Chapter[] = [
//   {
//     id: "chapter-1",
//     title: "Getting Started",
//     description: "Learn the basics of the course structure.",
//     position: 1,
//     sectionId: "section-1",
//     courseId: "course-1",
//     isPublished: true,
//     isFree: true,
//     contentType: "VIDEO",
//     content: "intro-video.mp4",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     // duration: 10,
//   },
//   {
//     id: "chapter-2",
//     title: "Setting Up the Environment",
//     description: "Install Node.js, Next.js, and dependencies.",
//     position: 2,
//     sectionId: "section-1",
//     courseId: "course-1",
//     isPublished: true,
//     isFree: false,
//     contentType: "VIDEO",
//     content: "setup-video.mp4",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     // duration: 15,
//   },
//   {
//     id: "chapter-3",
//     title: "Building the Backend",
//     description: "Create an API using Express.",
//     position: 1,
//     sectionId: "section-2",
//     courseId: "course-1",
//     isPublished: true,
//     isFree: false,
//     contentType: "VIDEO",
//     content: "backend-video.mp4",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     // duration: 20,
//   },
// ];

const CourseIdPage = () => {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  // const { data: courseData, isLoading, error } = useCourse(courseId);

  // const courseAttachments = mockCourseAttachments;
  // const sections = mockSections;
  // const chapters = mockChapters;

  // if (isLoading) {
  //   return <div className="p-8">Loading...</div>;
  // }

  // if (error) {
  //   return (
  //     <div className="text-red-800 bg-red-200 p-2 rounded-xl m-8">
  //       {error.message}
  //     </div>
  //   );
  // }

  // const course = courseData?.data || ({} as Course);

  // console.log("COURSE IN CONTENT BEFORE USE", JSON.stringify(course));

  const { data: course, isLoading, error } = useCourse(courseId); // data is now the course directly

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-800 bg-red-100 p-4 rounded-xl max-w-md">
          <p className="font-semibold">Error loading course</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>No course data found</p>
        </div>
      </div>
    );
  }

  console.log("COURSE IN CONTENT BEFORE USE", JSON.stringify(course));

  return (
    <div>
      {course ? (
        <CourseContent
          course={course as unknown as Course}
          sections={course.sections}
          chapters={
            course?.sections
              ? course.sections.flatMap((section) => section.Chapter || [])
              : []
          }
          // chapters={
          //   course?.sections
          //     ? course.sections.flatMap((s) => s.Chapter || [])
          //     : []
          // }
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
