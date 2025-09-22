// "use client";

// import React from "react";
// import ShowChapters from "./ShowChapters";
// import { courseChapters, sampleText } from "@/lib/mock/mockData";
// import CourseContentInstructorCard from "@/app/(public)/courses/[id]/courseContent/_components/CourseContentInstructorCard";
// import CourseSectionsAndChapters from "./CourseSectionsAndChapters";
// import CourseAttachments from "./CourseAttachments";
// import { Button, Callout } from "@tremor/react";

// // Types
// type CourseDetailsProps = {
//   courseId: string;
// };

// const CourseDetails: React.FC<CourseDetailsProps> = ({ courseId }) => {
//   // const { updateCourseProgress } = useCoursesStore();

//   // Zustand stores
//   // const { user, userId, loadingState: isUserLoading } = useUserStore();
//   // const {
//   //   course,
//   //   attachments,
//   //   fetchCourse,
//   //   // fetchCourseCloudinaryData,
//   //   // fetchCourseAttachments,
//   //   // fetchCourseProgress,
//   //   // fetchCourseReviews,
//   //   loadingState,
//   // } = useCoursesStore();

//   // Redirect if not enrolled or no user
//   // React.useEffect(() => {
//   //   if (!isUserLoading.loading && !userId) {
//   //     toast.error("Please sign in to access this course");
//   //     router.push("/sign-in");
//   //   }
//   // }, [userId, isUserLoading, router]);

//   // Fetch course data when userId is available
//   // React.useEffect(() => {
//   //   if (userId && courseId) {
//   //     const fetchData = async () => {
//   //       try {
//   //         await fetchCourse(courseId);
//   //         // await fetchCourseCloudinaryData(courseId);
//   //         // await fetchCourseAttachments(courseId);
//   //         // if (userId) await fetchCourseProgress(courseId, userId);
//   //         // await fetchCourseReviews(courseId);
//   //       } catch (error) {
//   //         console.error("Failed to fetch course data:", error);
//   //       }
//   //     };
//   //     fetchData();
//   //   }
//   // }, [
//   //   userId,
//   //   courseId,
//   //   fetchCourse,
//   //   // fetchCourseCloudinaryData, fetchCourseAttachments, fetchCourseProgress, fetchCourseReviews
//   // ]);

//   // if (isUserLoading.loading || loadingState.loading) {
//   //   return <CourseContentScreenSkeleton />;
//   // }

//   //*--------------------------------------------------------------------------------------

//   // if (loadingState.error) {
//   //   if (
//   //     loadingState.error ===
//   //     "[UNAUTHORIZED_ACCESS], User not enrolled in this course"
//   //   ) {
//   //     toast.error("You're not enrolled in this course");
//   //     router.back();
//   //     return null;
//   //   }
//   //   return (
//   //     <div className="flex h-screen items-center justify-center">
//   //       <Callout
//   //         title="Failed to Fetch Course Info"
//   //         className="rounded-md text-red-800 bg-red-100"
//   //       >
//   //         Error: {loadingState.error}
//   //       </Callout>
//   //     </div>
//   //   );
//   // }

//   if (!course) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <Callout
//           title="Course Not Found"
//           className="rounded-md text-yellow-800 bg-yellow-100"
//         >
//           The requested course could not be loaded.
//         </Callout>
//       </div>
//     );
//   }

//   const [activeChapterIndex, setActiveChapterIndex] = React.useState(0);
//   const [showFullDescription, setShowFullDescription] = React.useState(false);

//   const activeChapter = chapters[activeChapterIndex];
//   const aboutChapter = activeChapter?.description || sampleText;

//   /**
//  *           // chapters={course.sections?.flatMap((section) => section.Chapter) || []}
//         // // instructor={
//         // //   course.instructor
//         // //     ? {
//         // //         ...course.instructor,
//         // //         id: course.instructor.userId ?? course.instructor.userId ?? "",
//         // //         websiteUrl:
//         // //           typeof course.instructor.socialLinks === "string"
//         // //             ? course.instructor.socialLinks
//         // //             : "",
//         // //         user: {
//         // //           ...course.instructor.user,
//         // //           shortSummary: course.instructor.user.about ?? "",
//         // //         },
//         // //       }
//         // //     : undefined
//         // // }
//         // courseId={courseId}
//         // // isChaptersLoading={loadingState.loading}
//         // // chaptersError={loadingState.error}
//         // // courseAttachments={attachments || []}
//  */

//   const handleProgressChange = () => {
//     if (activeChapter?.id) {
//       // updateCourseProgress(userId, courseId, activeChapter.id);
//     }
//   };

//   /** ------------------------------------------------------------------------------------------------------------------------------------- */

//   // if (isChaptersLoading) {
//   //   return (
//   //     <div className="mx-auto max-w-7xl p-8">
//   //       <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
//   //       <div className="mt-4 h-64 w-full animate-pulse rounded bg-gray-200" />
//   //     </div>
//   //   );
//   // }

//   // if (chaptersError) {
//   //   return (
//   //     <div className="mx-auto max-w-7xl p-8">
//   //       <Callout title="Error loading chapters" color="red">
//   //         {chaptersError}
//   //       </Callout>
//   //     </div>
//   //   );
//   // }

//    /** ------------------------------------------------------------------------------------------------------------------------------------- */

//   return (
//     <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-start space-x-8 overflow-x-hidden px-8 md:flex-row md:items-start md:px-[3rem]">
//       {/* Column 1 - Video and Course Metadata */}
//       <div className="mt-6 w-full space-y-4 md:max-w-[45rem]">
//         {/* Video and controls */}
//         <div className="flex w-full max-w-xl flex-col items-start justify-between space-y-4 md:max-w-[45rem]">
//           {/* Mobile chapters button */}
//           <div className="flex items-start justify-start md:hidden">
//             <ShowChapters
//               chapters={chapters}
//               activeChapterIndex={activeChapterIndex}
//               setActiveChapterIndex={setActiveChapterIndex}
//             />
//           </div>

//           {/* Video component */}
//           <div className="w-full md:h-[360px]">
//             {/* {activeChapter && (
//               <CourseVideo
//                 // activeChapter={activeChapter}
//                 url={activeChapter.content.videoUrl}
//               />
//             )} */}
//           </div>

//           {/* Mark as completed button */}
//           {/* {activeChapter && (
//             <Button
//               color="green"
//               onClick={handleProgressChange}
//               className="hidden items-center justify-center rounded-full hover:bg-green-600 md:flex"
//               disabled={activeChapter.isCompleted}
//             >
//               {activeChapter.isCompleted ? <TiTick /> : <TiTickOutline />}
//             </Button>
//           )} */}
//         </div>

//         {/* About class, notes, and instructor */}
//         <div className="w-full space-y-2  mt-12">
//           {/* About this class */}
//           <div>
//             <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-300">
//               About This Class
//             </h2>
//             <p
//               className={`pb-4 text-slate-700 dark:text-gray-400 ${
//                 showFullDescription ? "" : "line-clamp-4"
//               }`}
//             >
//               {aboutChapter}
//             </p>
//             {aboutChapter.length > 250 && (
//               <button
//                 className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400"
//                 onClick={() => setShowFullDescription(!showFullDescription)}
//               >
//                 {showFullDescription ? "Show Less" : "Show More"}
//               </button>
//             )}
//           </div>

//           {/* About Instructor */}
//           <div>
//             <h3 className="text-xl font-semibold text-gray-950 dark:text-gray-300">
//               About Instructor
//             </h3>
//             {instructor ? (
//               <CourseContentInstructorCard instructor={instructor} />
//             ) : (
//               <p className="text-gray-500">
//                 No instructor information available
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Column 2 - Chapters and Resources */}
//       <div className="mt-8 w-full md:ml-4 md:max-w-[27rem] md:space-y-12">
//         {/* Course chapters */}
//         <div className="hidden md:block">
//           <CourseSectionsAndChapters
//             chapters={chapters}
//             activeChapterIndex={activeChapterIndex}
//             setActiveChapterIndex={setActiveChapterIndex}
//             chaptersError={chaptersError}
//           />
//         </div>

//         {/* Course resources */}
//         <div>
//           <h3 className="text-xl font-semibold text-gray-950 dark:text-gray-300">
//             Course Resources
//           </h3>
//           <CourseAttachments courseAttachments={courseAttachments} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseDetails;

"use client";

import React from "react";
import ShowChapters from "./ShowChapters";
import { sampleText } from "@/lib/mock/mockData";
import CourseContentInstructorCard from "@/app/(public)/courses/[id]/courseContent/_components/CourseContentInstructorCard";
import CourseSectionsAndChapters from "./CourseSectionsAndChapters";
import CourseAttachments from "./CourseAttachments";
import { Button, Callout } from "@tremor/react";
import {
  useCourse,
  useCourseAttachments,
  useCourseInstructor,
} from "@/hooks/useCourses";
import { useUserStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Section } from "@/types/course-details-api-response";
import { CourseContentScreenSkeleton } from "@/app/(public)/courses/[id]/courseContent/skeletons";

// Types
type CourseDetailsProps = {
  courseId: string;
};

const CourseDetails: React.FC<CourseDetailsProps> = ({ courseId }) => {
  const router = useRouter();
  const { user } = useUserStore();
  const userId = user?.id ?? "";

  // React Query hooks
  const {
    data: courseData,
    isLoading: isCourseLoading,
    error: courseError,
  } = useCourse(courseId);

  const course = courseData?.data;

  const { data: attachments = [], isLoading: isAttachmentsLoading } =
    useCourseAttachments(courseId);

  const { data: instructor, isLoading: isInstructorLoading } =
    useCourseInstructor(courseId);

  // Redirect if not enrolled or no user
  React.useEffect(() => {
    if (!userId) {
      toast.error("Please sign in to access this course");
      router.push("/sign-in");
    }
  }, [userId, router]);

  const [activeChapterIndex, setActiveChapterIndex] = React.useState(0);
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  // Extract chapters from all sections
  const chapters = React.useMemo(() => {
    if (!course?.sections) return [];
    return course.sections.flatMap((section: Section) => section.Chapter || []);
  }, [course?.sections]);

  const activeChapter = chapters[activeChapterIndex];
  const aboutChapter = activeChapter?.description || sampleText;

  const handleProgressChange = () => {
    if (activeChapter?.id && userId) {
      // updateCourseProgress(userId, courseId, activeChapter.id);
    }
  };

  // Loading state
  const isLoading =
    isCourseLoading ||
    isAttachmentsLoading ||
    isInstructorLoading ;
    // ||
    // isUserLoading.loading;

  if (isLoading) {
    return <CourseContentScreenSkeleton />;
  }

  if (courseError) {
    const errorMessage =
      courseError instanceof Error ? courseError.message : "Unknown error";

    if (
      errorMessage.includes("UNAUTHORIZED_ACCESS") ||
      errorMessage.includes("not enrolled")
    ) {
      toast.error("You're not enrolled in this course");
      router.back();
      return null;
    }

    return (
      <div className="flex h-screen items-center justify-center">
        <Callout
          title="Failed to Fetch Course Info"
          className="rounded-md text-red-800 bg-red-100"
        >
          Error: {errorMessage}
        </Callout>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Callout
          title="Course Not Found"
          className="rounded-md text-yellow-800 bg-yellow-100"
        >
          The requested course could not be loaded.
        </Callout>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-start space-x-8 overflow-x-hidden px-8 md:flex-row md:items-start md:px-[3rem]">
      {/* Column 1 - Video and Course Metadata */}
      <div className="mt-6 w-full space-y-4 md:max-w-[45rem]">
        {/* Video and controls */}
        <div className="flex w-full max-xl flex-col items-start justify-between space-y-4 md:max-w-[45rem]">
          {/* Mobile chapters button */}
          <div className="flex items-start justify-start md:hidden">
            <ShowChapters
              chapters={chapters}
              activeChapterIndex={activeChapterIndex}
              setActiveChapterIndex={setActiveChapterIndex}
            />
          </div>

          {/* Video component */}
          <div className="w-full md:h-[360px]">
            {/* {activeChapter && (
              <CourseVideo
                url={activeChapter.content.videoUrl}
              />
            )} */}
          </div>

          {/* Mark as completed button */}
          {/* {activeChapter && (
            <Button
              color="green"
              onClick={handleProgressChange}
              className="hidden items-center justify-center rounded-full hover:bg-green-600 md:flex"
              disabled={activeChapter.isCompleted}
            >
              {activeChapter.isCompleted ? "Completed" : "Mark as Completed"}
            </Button>
          )} */}
        </div>

        {/* About class, notes, and instructor */}
        <div className="w-full space-y-2 mt-12">
          {/* About this class */}
          <div>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-300">
              About This Class
            </h2>
            <p
              className={`pb-4 text-slate-700 dark:text-gray-400 ${
                showFullDescription ? "" : "line-clamp-4"
              }`}
            >
              {aboutChapter}
            </p>
            {aboutChapter.length > 250 && (
              <button
                className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          {/* About Instructor */}
          {/* <div>
            <h3 className="text-xl font-semibold text-gray-950 dark:text-gray-300">
              About Instructor
            </h3>
            {instructor ? (
              <CourseContentInstructorCard instructor={instructor} />
            ) : (
              <p className="text-gray-500">
                No instructor information available
              </p>
            )}
          </div> */}
        </div>
      </div>

      {/* Column 2 - Chapters and Resources */}
      <div className="mt-8 w-full md:ml-4 md:max-w-[27rem] md:space-y-12">
        {/* Course chapters */}
        <div className="hidden md:block">
          {/* todo: fix this */}
          {/* <CourseSectionsAndChapters
            sections={course.sections || []}
            activeChapterIndex={activeChapterIndex}
            setActiveChapterIndex={setActiveChapterIndex}
            chaptersError={courseError ? courseError.message : undefined}
          /> */}
        </div>

        {/* Course resources */}
        <div>
          <h3 className="text-xl font-semibold text-gray-950 dark:text-gray-300">
            Course Resources
          </h3>
          <CourseAttachments courseAttachments={attachments} />
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
