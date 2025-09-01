// "use client";

// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { Button, Callout } from "@tremor/react";
// // import { Chapter, CourseAttachment, Instructor } from "@prisma/client";
// import { Course } from "@/types/course";
// import { FaNoteSticky, FaLink } from "react-icons/fa6";
// import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
// import { IoMdAddCircleOutline } from "react-icons/io";
// import { MdModeEditOutline } from "react-icons/md";
// import { TiTick, TiTickOutline } from "react-icons/ti";

// //* -------------------- Custom Hooks ------------------------------
// import { courseChapters, sampleText } from "@/lib/mockData";
// import { useInstructorStore } from "@/zustand/instructorStore";
// import { useCoursesStore } from "@/zustand/coursesStore";
// import { useUserStore } from "@/zustand/userStore";

// //? -------------------- Custom Components ------------------------------
// import CourseContentScreenSkeleton from "./_components/skeletons/CourseContentScreenSkeleton";
// import CourseVideo from "./_components/CourseVideo";
// import { useParams, useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import {
//   Chapter,
//   Instructor,
//   Section,
// } from "@/types/course-details-api-response";
// import VideoSummary from "./_components/VideoSummary";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from "@/components/ui/accordion";
// import UserAvatar from "@/app/(shared)/user-avatar";
// import { ThemeModeToggle } from "@/app/(shared)/theme-mode-toggle";
// import { CourseProgress } from "@/app/(shared)/course-progress";
// import { cn } from "@/utils/utils";

// const CourseContentPage = () => {
//   const params = useParams<{ courseId: string }>();
//   const router = useRouter();
//   const courseId = params.courseId;

//   // Zustand stores
//   const { user, userId, loadingState: isUserLoading } = useUserStore();
//   const {
//     course,
//     attachments,
//     fetchCourse,
//     fetchCourseCloudinaryData,
//     fetchCourseAttachments,
//     fetchCourseProgress,
//     fetchCourseReviews,
//     loadingState,
//   } = useCoursesStore();

//   // Redirect if not enrolled or no user
//   // React.useEffect(() => {
//   //   if (!isUserLoading.loading && !userId) {
//   //     toast.error("Please sign in to access this course");
//   //     router.push("/sign-in");
//   //   }
//   // }, [userId, isUserLoading, router]);

//   // Fetch course data when userId is available
//   React.useEffect(() => {
//     if (userId && courseId) {
//       const fetchData = async () => {
//         try {
//           await fetchCourse(courseId);
//           await fetchCourseCloudinaryData(courseId);
//           await fetchCourseAttachments(courseId);
//           if (userId) await fetchCourseProgress(courseId, userId);
//           await fetchCourseReviews(courseId);
//         } catch (error) {
//           console.error("Failed to fetch course data:", error);
//         }
//       };
//       fetchData();
//     }
//   }, [
//     userId,
//     courseId,
//     fetchCourse,
//     fetchCourseCloudinaryData,
//     fetchCourseAttachments,
//     fetchCourseProgress,
//     fetchCourseReviews,
//   ]);

//   if (isUserLoading.loading || loadingState.loading) {
//     return <CourseContentScreenSkeleton />;
//   }

//   if (!userId) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <Callout title="Authentication Required" color="red">
//           Please sign in to access this course content.
//         </Callout>
//       </div>
//     );
//   }

//   if (loadingState.error) {
//     if (
//       loadingState.error ===
//       "[UNAUTHORIZED_ACCESS], User not enrolled in this course"
//     ) {
//       toast.error("You're not enrolled in this course");
//       router.back();
//       return null;
//     }
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <Callout title="Failed to Fetch Course Info" color="red">
//           Error: {loadingState.error}
//         </Callout>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <Callout title="Course Not Found" color="yellow">
//           The requested course could not be loaded.
//         </Callout>
//       </div>
//     );
//   }

//   return (
//     <div className="h-auto overflow-auto">
//       {/* Header */}
//       <div className="sticky top-0 z-30 flex w-full items-center justify-between bg-white/80 px-2 py-3 shadow-sm backdrop-blur dark:bg-[#18181b]/80">
//         {/* Back Button */}
//         <button
//           className="mr-2 flex cursor-pointer border-stroke items-center rounded-md px-2 py-1 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800"
//           onClick={() => {
//             if (typeof window !== "undefined") {
//               window.history.back();
//             }
//           }}
//           aria-label="Go back"
//         >
//           <svg
//             className="h-5 w-5"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth={2}
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M15 19l-7-7 7-7"
//             />
//           </svg>
//           <span className="ml-1 hidden text-sm md:inline">Back</span>
//         </button>

//         {/* Breadcrumb with course name */}
//         <div className="flex-1">
//           <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
//             {/* <span className="hover:underline cursor-pointer" onClick={() => window.location.href = '/courses'}>
//               Courses
//             </span>
//             <span>/</span> */}
//             <span
//               className="font-semibold truncate max-w-xs inline-block align-middle text-blue-600"
//               title={course?.title}
//             >
//               {course?.title || "Course"}
//             </span>
//           </nav>
//         </div>

//         {/* Theme toggle and user avatar */}
//         <div className="flex items-center space-x-3">
//           {/* Course Progress */}
//           <CourseProgress
//             // course_id={courseId}
//             // user_id={userId}
//             value={79}
//             variant="default"
//             size="default"
//             // You may need to pass additional props depending on your CourseProgress component
//           />

//           {/* Theme Toggle */}
//           <ThemeModeToggle />

//           {/* User Avatar */}
//           <UserAvatar />
//         </div>
//       </div>

//       {/* Course details */}
//       <CourseDetails
//         sections={
// Array.isArray((course as any)?.sections)
//   ? (course as any).sections
//   : []
//         }
//         instructor={course.instructor}
//         courseId={courseId}
//         userId={userId}
//         isChaptersLoading={loadingState.loading}
//         chaptersError={loadingState.error}
//         courseAttachments={attachments || []}
//       />

//       {/* Space from bottom */}
//       <div className="h-12 w-2" />
//     </div>
//   );
// };

// export default CourseContentPage;

// // -------------------------------------------------------------------------------------
// // Types
// type CourseDetailsProps = {
//   sections: Section[];
//   instructor?: Instructor;
//   courseId: string;
//   userId: string;
//   isChaptersLoading: boolean;
//   chaptersError: string | null;
//   courseAttachments: any[];
// };

// const CourseDetails: React.FC<CourseDetailsProps> = ({
//   sections = [],
//   instructor,
//   courseId,
//   userId,
//   isChaptersLoading,
//   chaptersError,
//   courseAttachments = [],
// }) => {
//   const { updateCourseProgress } = useCoursesStore();
//   // Track active section and chapter
//   const [activeSectionIndex, setActiveSectionIndex] = React.useState(0);
//   const [activeChapterIndex, setActiveChapterIndex] = React.useState(0);
//   const [showFullDescription, setShowFullDescription] = React.useState(false);

//   // Get the active chapter based on section/chapter index
//   const activeSection = sections[activeSectionIndex];
//   const activeChapter = activeSection?.chapters?.[activeChapterIndex];
//   const aboutChapter = activeChapter?.description || sampleText;

//   const handleProgressChange = () => {
//     if (activeChapter?.id) {
//       updateCourseProgress(userId, courseId, activeChapter.id);
//     }
//   };

//   if (isChaptersLoading) {
//     return (
//       <div className="mx-auto max-w-7xl p-8">
//         <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
//         <div className="mt-4 h-64 w-full animate-pulse rounded bg-gray-200" />
//       </div>
//     );
//   }

//   if (chaptersError) {
//     return (
//       <div className="mx-auto max-w-7xl p-8">
//         <Callout title="Error loading chapters" color="red">
//           {chaptersError}
//         </Callout>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-start space-x-8 overflow-x-hidden px-8 md:flex-row md:items-start md:px-[3rem]">
//       {/* Column 1 - Video and Course Metadata */}
//       <div className="mt-6 w-full space-y-4 md:max-w-[45rem]">
//         {/* Video and controls */}
//         <div className="flex w-full max-w-xl flex-col items-start justify-between space-y-4 lg:max-w-[45rem]">
//           {activeChapter?.contentType === "VIDEO" &&
//           activeChapter?.content?.videoUrl ? (
//             <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
//               <video
//                 key={activeChapter.id}
//                 src={activeChapter.content.videoUrl}
//                 controls
//                 className="w-full h-full"
//                 poster={activeChapter?.content.thumbnailUrl || undefined}
//                 onEnded={handleProgressChange}
//               >
//                 Your browser does not support the video tag.
//               </video>
//             </div>
//           ) : (
//             <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-800">
//               <span className="text-gray-500 dark:text-gray-400">
//                 No video available for this chapter.
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Mark as completed button, About class, notes, and instructor */}
//         <div className="w-full space-y-6">
//           {/* mark as completed button */}
//           <div className="flex justify-start">
//             <button
//               className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-60"
//               onClick={() => {
//                 // mark‑as‑completed logic
//               }}
//             >
//               <span>✔</span> Mark as Completed
//             </button>
//           </div>

//           {/* AI Summary */}
//           <div>
//             {/* Add the AI Summary component here */}
//             <VideoSummary
//               chapterId={activeChapter?.id || ""}
//               chapterTitle={activeChapter?.title || ""}
//             />
//           </div>

//           {/* 4. About This Class */}
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
//               About This Class
//             </h2>
//             <p
//               className={cn(
//                 "py-4 text-gray-700 dark:text-gray-400 transition-all duration-300",
//                 !showFullDescription && "line-clamp-4"
//               )}
//             >
//               {aboutChapter}
//             </p>
//             {aboutChapter.length > 250 && (
//               <button
//                 onClick={() => setShowFullDescription((prev) => !prev)}
//                 className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400"
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

//       {/* Column 2 - Sections/Chapters and Resources */}
//       <div className="mt-8 w-full md:ml-4 md:max-w-[27rem] md:space-y-12">
//         {/* Course sections/chapters */}
//         <div className="hidden md:block">
//           <CourseSectionsAndChapters
//             sections={sections}
//             activeSectionIndex={activeSectionIndex}
//             setActiveSectionIndex={setActiveSectionIndex}
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

//         {/* Notes */}
//         <CourseNotes />
//       </div>
//     </div>
//   );
// };

// // Rest of your component implementations (ShowChapters, CourseSectionsAndChapters, etc.)
// // should remain similar but with proper null checks and loading states

// //* <--------------------- Components --------------------->

// type ShowChaptersProps = {
//   chapters: Chapter[];
//   activeChapterIndex: Number;
//   setActiveChapterIndex: any;
// };

// const ShowChapters = ({
//   chapters,
//   activeChapterIndex,
//   setActiveChapterIndex,
// }: ShowChaptersProps) => {
//   return (
//     <Sheet key={"left"}>
//       <SheetTrigger asChild>
//         <p className="w-auto cursor-pointer text-sm font-medium text-blue-500 transition-all duration-300">
//           Show Chapters
//         </p>
//       </SheetTrigger>
//       <ScrollArea>
//         <SheetContent side={"right"} className="h-full w-auto text-left">
//           <SheetHeader>
//             <SheetTitle>Chapters</SheetTitle>
//             <SheetDescription>
//               These are all the chapters in this course. click on anyone to view
//               its content.
//             </SheetDescription>
//           </SheetHeader>

//           {/* chapters list */}
//           <div className="mt-6 space-y-4">
//             {chapters && chapters.length > 0 ? (
//               <ul className="space-y-2">
//                 {chapters?.map((chapter: Chapter, index: any) => {
//                   return (
//                     <li
//                       onClick={() => setActiveChapterIndex(index)}
//                       key={chapter.position}
//                     >
//                       <ChapterItem
//                         title={chapter?.title}
//                         duration={"0"}
//                         // duration={chapter?.createdAt.toLocaleDateString.toString()} // TODO: use chapter duration here
//                         isChapterFree={chapter?.isFree}
//                         activeChapterIndex={activeChapterIndex}
//                         index={index}
//                       />
//                     </li>
//                   );
//                 })}
//               </ul>
//             ) : (
//               <ul className="space-y-2">
//                 {courseChapters?.map(
//                   (
//                     chapter: {
//                       title: string;
//                       chapterDuration: string;
//                       isFree: boolean;
//                       position: number;
//                     },
//                     index: number
//                   ) => {
//                     return (
//                       <li
//                         onClick={() => setActiveChapterIndex(index)}
//                         key={chapter.position}
//                       >
//                         <ChapterItem
//                           title={chapter?.title}
//                           duration={chapter?.chapterDuration}
//                           isChapterFree={chapter?.isFree}
//                           activeChapterIndex={activeChapterIndex}
//                           index={index}
//                         />
//                       </li>
//                     );
//                   }
//                 )}
//               </ul>
//             )}
//           </div>
//         </SheetContent>
//       </ScrollArea>
//     </Sheet>
//   );
// };

// // -------------------------------------------------------------------------------------
// type CourseSectionsAndChaptersProps = {
//   sections: Section[];
//   activeSectionIndex: number;
//   setActiveSectionIndex: (idx: number) => void;
//   activeChapterIndex: number;
//   setActiveChapterIndex: (idx: number) => void;
//   chaptersError: any;
// };

// const CourseSectionsAndChapters = ({
//   sections,
//   activeSectionIndex,
//   setActiveSectionIndex,
//   activeChapterIndex,
//   setActiveChapterIndex,
//   chaptersError,
// }: CourseSectionsAndChaptersProps) => {
//   if (chaptersError) {
//     return <div>Error in loading chapters: {chaptersError.message}</div>;
//   }
//   return (
//     <Accordion
//       type="single"
//       collapsible
//       value={sections[activeSectionIndex]?.id}
//       onValueChange={(val) => {
//         const idx = sections.findIndex((s) => s.id === val);
//         if (idx !== -1) setActiveSectionIndex(idx);
//       }}
//     >
//       {sections.map((section, sectionIdx) => (
//         <AccordionItem value={section.id} key={section.id}>
//           <AccordionTrigger>{section.title}</AccordionTrigger>
//           <AccordionContent>
//             <ul className="space-y-2">
//               {(section.chapters ?? []).map((chapter, chapterIdx) => (
//                 <li
//                   key={chapter.id}
//                   className={`cursor-pointer px-2 py-1 rounded ${activeSectionIndex === sectionIdx && activeChapterIndex === chapterIdx ? "bg-blue-100 dark:bg-blue-900" : ""}`}
//                   onClick={() => {
//                     setActiveSectionIndex(sectionIdx);
//                     setActiveChapterIndex(chapterIdx);
//                   }}
//                 >
//                   {chapter.title}
//                 </li>
//               ))}
//             </ul>
//           </AccordionContent>
//         </AccordionItem>
//       ))}
//     </Accordion>
//   );
// };

// type ChapterItemProps = {
//   title: string;
//   duration: string;
//   isChapterFree: boolean;
//   activeChapterIndex: Number;
//   // setActiveChapterIndex: any;
//   index: Number;
// };

// const ChapterItem = ({
//   title,
//   duration,
//   isChapterFree,
//   activeChapterIndex,
//   index,
// }: ChapterItemProps) => {
//   const [videoPlaying, setVideoPlaying] = React.useState(false);

//   var today = new Date();
//   var time =
//     today.getHours() + " : " + today.getMinutes() + " : " + today.getSeconds();

//   return (
//     <div
//       className={`text-md flex cursor-pointer items-center justify-between border-neutral-500 rounded-xl border p-4 text-base tracking-tight transition-all duration-300 hover:border-blue-500 dark:hover:text-white ${
//         activeChapterIndex === index
//           ? "border-blue-500 text-zinc-700 dark:text-white"
//           : ""
//       } `}
//     >
//       <div className="flex items-center justify-start space-x-2">
//         <div onClick={() => setVideoPlaying(!videoPlaying)}>
//           {videoPlaying ? (
//             <FaPauseCircle
//               className="cursor-pointer rounded-full p-1 hover:bg-blue-700"
//               size={24}
//             />
//           ) : (
//             <FaPlayCircle
//               className="cursor-pointer rounded-full p-1 hover:bg-blue-700"
//               size={24}
//             />
//           )}
//         </div>

//         <div>
//           <div className="link-clamp-1 max-lines-1 line-clamp-1 overflow-clip text-xs">
//             Chapter {index.toString()}
//           </div>
//           <div className="link-clamp-2 text-md max-lines-1 line-clamp-1 overflow-hidden text-base">
//             {title}
//           </div>
//         </div>
//       </div>

//       {/* <div className="flex items-center justify-start space-x-2">
//         <p className="mr-1 rounded-badge bg-white px-2 py-1 text-center text-xs font-normal text-black">
//           {duration ? duration : time}
//         </p>
//       </div> */}
//     </div>
//   );
// };

// // -------------------------------------------------------------------------------------
// const CourseNotes = () => {
//   const [notes, setNotes] = React.useState([
//     "What is Full Stack",
//     "Node.js Installation Steps",
//   ]);
//   return (
//     <ScrollArea className="border-storke h-full  overflow-hidden w-full max-w-[45rem]  rounded-xl border p-4 md:mt-4">
//       <div className="flex items-center justify-between">
//         <p className="text-lg font-semibold tracking-tight text-gray-950 dark:text-gray-300">
//           Your Notes
//         </p>
//         <Dialog>
//           <DialogTrigger asChild>
//             <IoMdAddCircleOutline
//               size={20}
//               className="cursor-pointer hover:text-blue-500"
//             />
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Add a note</DialogTitle>
//               <DialogDescription>
//                 Add a note here. Click save when youre done.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <div className="space-y-2">
//                 <Label htmlFor="title" className="text-right">
//                   Title
//                 </Label>
//                 <Input
//                   id="title"
//                   placeholder="Note title"
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="note" className="text-right">
//                   Note
//                 </Label>
//                 <Textarea
//                   id="note"
//                   placeholder="Write you note here ..."
//                   className="col-span-3"
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button
//                 type="submit"
//                 color="gray"
//                 className="border-stroke w-full border bg-black text-white hover:bg-blue-500"
//               >
//                 Save changes
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//       <p className="mb-4 text-sm">These are you notes for this class</p>

//       {/* notes list */}
//       <ul className="h-full max-h-[20rem] overflow-auto list-none space-y-1 mb-2">
//         {notes.map((note, index) => {
//           return (
//             <li
//               key={index}
//               className="text-md flex items-center justify-between rounded-md border px-4 py-2 text-base tracking-tight"
//             >
//               <div className="flex items-center justify-start space-x-2">
//                 <FaNoteSticky />
//                 <p className="cursor-pointer text-sm hover:text-blue-500 hover:underline">
//                   {note}
//                 </p>
//               </div>
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <MdModeEditOutline
//                     className="cursor-pointer rounded-full p-1 hover:bg-blue-700"
//                     size={24}
//                   />
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-[425px]">
//                   <DialogHeader>
//                     <DialogTitle>Edit note</DialogTitle>
//                     <DialogDescription>
//                       Make changes in your note. Click save when youre done.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="grid gap-4 py-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="title" className="text-right">
//                         Title
//                       </Label>
//                       <Input
//                         id="title"
//                         placeholder={note}
//                         className="col-span-3"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="note" className="text-right">
//                         Note
//                       </Label>
//                       <Textarea
//                         id="note"
//                         placeholder={note}
//                         className="col-span-3"
//                       />
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button
//                       type="submit"
//                       color="gray"
//                       className="border-stroke w-full border bg-black text-white hover:bg-blue-500"
//                     >
//                       Save changes
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>
//             </li>
//           );
//         })}
//       </ul>
//     </ScrollArea>
//   );
// };

// // -------------------------------------------------------------------------------------
// type CourseAttachmentsProps = {
//   courseAttachments: any[];
// };

// const CourseAttachments = ({ courseAttachments }: CourseAttachmentsProps) => {
//   console.log("Course Attachments: ", courseAttachments);

//   return (
//     <div>
//       {courseAttachments && courseAttachments.length > 0 ? (
//         <ul className="w-full list-disc py-4 font-normal md:ml-4 md:p-0 md:py-2">
//           {courseAttachments.map((attachment: any) => (
//             <CourseAttachmentItem
//               key={attachment.id}
//               id={attachment.id}
//               url={attachment.url}
//               name={attachment.name}
//             />
//           ))}
//         </ul>
//       ) : (
//         <ul className="text-md md:text-md font-noraml ml-4 w-auto list-disc py-4 text-base text-gray-700 dark:text-gray-400 md:p-0 md:py-2">
//           <li className="pb-1">
//             <Link href="">
//               Connect with Martin on YouTube, Instagram, Spotify, and his
//               website.
//             </Link>
//           </li>
//           <li className="pb-1">
//             <Link href="">
//               Discover Martin’s best-selling book, “Modern Rock Guitar Soloing:
//               Master Intermediate and Advanced Lead Guitar Concepts, Licks,
//               Theory, & Technique for Rock Soloing & Improvisation”
//             </Link>
//           </li>
//           <li>
//             <Link href="">Resources PDF</Link>
//           </li>
//         </ul>
//       )}
//     </div>
//   );
// };

// type CourseAttachmentCardProps = {
//   id: string;
//   url: string;
//   name: string;
// };

// const CourseAttachmentItem = ({ id, url, name }: CourseAttachmentCardProps) => {
//   return (
//     <div
//       className="text-md group hover flex cursor-pointer items-center justify-between pb-1 text-base text-gray-700 transition-all duration-200 hover:rounded-md hover:text-blue-500 dark:text-gray-400"
//       key={id}
//     >
//       <Link
//         className="text-sm tracking-tight group-hover:font-medium dark:hover:text-blue-500"
//         href={url}
//       >
//         {name}
//       </Link>
//       <FaLink className="text-blue-600" />
//     </div>
//   );
// };

// // -------------------------------------------------------------------------------------
// type CourseContentInstructorCardProps = {
//   instructor: Instructor;
// };

// const CourseContentInstructorCard = ({
//   instructor,
// }: CourseContentInstructorCardProps) => {
//   const instructorID = instructor?.id ?? "N/A";
//   const instructorName = instructor?.user.name ?? "CourseWave";
//   const instructorTag = instructor?.expertise[0] ?? "Full Stack Engineer";
//   const instructorProfilePicUrl =
//     instructor?.user.profileImageUrl ?? "/assets/images/user/user-01.png";
//   const aboutInstructor = instructor?.bio ?? `No profile description.`;

//   console.log(
//     `Instructor id in the instructor-card inside (course)/courses/[id]/courseContent/page.tsx: ${instructorID}`
//   );
//   console.log(
//     "Instructor Info in instructor-card inside (course)/courses/[id]/courseContent/page.tsx: ",
//     instructor
//   );
//   console.log("About Instructor ", aboutInstructor);

//   return (
//     <div className="flex w-full max-w-3xl flex-col items-start justify-start space-y-4 rounded-xl py-4 md:py-2">
//       <div className="flex items-center justify-start space-x-4">
//         <Image
//           src={instructorProfilePicUrl}
//           alt={`Image of ${instructorName}`}
//           height={50}
//           width={50}
//           objectFit="cover"
//           className="flex h-[50px] w-[50px] items-center justify-center rounded-full ring-1 ring-white"
//         />

//         <div className="mr-auto flex flex-col items-start justify-start text-base">
//           <p className="text-lg font-semibold tracking-tight text-gray-800 dark:text-slate-200">
//             {instructorName}
//           </p>
//           <p className="text-md line-clamp-2 text-base font-thin tracking-tight text-gray-700 dark:text-gray-400">
//             {instructorTag}
//           </p>
//         </div>
//       </div>

//       <p className="text-md md:text-md line-clamp-3 w-auto text-start text-base font-normal text-gray-700 dark:text-gray-400 md:p-0">
//         {aboutInstructor}
//       </p>
//     </div>
//   );
// };

///* ==============================================================================================================

// app/(course)/courses/[courseId]/courseContent/page.tsx
"use client";

import React from "react";

import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CourseProgress } from "@/app/(shared)/CourseProgress";
import { ThemeModeToggle } from "@/app/(shared)/ThemeModeToggle";
import { useCoursesStore } from "@/zustand/coursesStore";
import { useUserStore } from "@/zustand/userStore";
import { Callout } from "@tremor/react";

import UserAvatar from "@/app/(shared)/UserAvatar";
import VideoSummary from "./_components/VideoSummary";
import CourseAttachments from "./_components/CourseAttachments";

import CourseNotes from "./_components/CourseNotes";
import CourseContentInstructorCard from "./_components/CourseContentInstructorCard";
import CourseSectionsAndChapters from "./_components/CourseSectionsAndChapters";
// import CourseVideo from "./_components/CourseVideoNew";

const CourseContentPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, loadingState: userLoading } = useUserStore();
  const userId = user?.id;
  const {
    course,
    attachments,
    fetchCourse,
    // fetchCourseCloudinaryData,
    fetchCourseAttachments,
    fetchCourseProgress,
    fetchCourseReviews,
    loadingState,
  } = useCoursesStore();
  // const { updateCourseProgress } = useCoursesStore();

  // Track active section and chapter
  const [activeSectionIndex, setActiveSectionIndex] = React.useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = React.useState(0);
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  // Ensure sections is always an array
  const sections = Array.isArray((course as any)?.sections)
    ? (course as any).sections
    : [];

  // Get the active chapter based on section/chapter index
  const activeSection = sections[activeSectionIndex];
  const activeChapter = activeSection?.chapters?.[activeChapterIndex];
  const aboutChapter =
    activeChapter?.description || "No chapter description available.";

  React.useEffect(() => {
    if (courseId && userId) {
      fetchCourse(courseId);
      // fetchCourseCloudinaryData(courseId);
      fetchCourseAttachments(courseId);
      fetchCourseProgress(courseId, userId);
      fetchCourseReviews(courseId);
    }
  }, [courseId, userId]);

  if (userLoading.loading || loadingState.loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (loadingState.error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Callout title="Error loading course" color="red">
          {loadingState.error}
        </Callout>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Callout title="Authentication Required" color="red">
          Please sign in to access this course content.
        </Callout>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Callout title="Course Not Found" color="yellow">
          The requested course could not be loaded.
        </Callout>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-80 flex-col overflow-y-auto border-r bg-white px-4 py-6 dark:bg-zinc-900 md:flex">
        <Tabs defaultValue="chapters" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger
              value="chapters"
              className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:rounded-md"
            >
              Chapters
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:rounded-md"
            >
              Notes
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:rounded-md"
            >
              Resources
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chapters">
            <CourseSectionsAndChapters
              sections={sections}
              activeSectionIndex={activeSectionIndex}
              setActiveSectionIndex={setActiveSectionIndex}
              activeChapterIndex={activeChapterIndex}
              setActiveChapterIndex={setActiveChapterIndex}
              chaptersError={loadingState.error}
            />
          </TabsContent>
          <TabsContent value="notes">
            <CourseNotes />
          </TabsContent>
          <TabsContent value="resources">
            <CourseAttachments courseAttachments={attachments} />
          </TabsContent>
        </Tabs>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
        {/* Header */}
        <div className="sticky top-0 z-10 flex w-full items-center justify-between bg-white py-2 dark:bg-zinc-900">
          <div className="text-xl font-bold text-blue-500 truncate max-w-[60%]">
            {course.title}
          </div>
          <div className="flex items-center space-x-3">
            <CourseProgress value={79} />
            <ThemeModeToggle />
            <UserAvatar />
          </div>
        </div>

        <div className="mx-auto mt-4 w-full max-w-4xl space-y-6">
          {/* <CourseVideo chapter={sections?.[0]?.chapters?.[0] ?? null} /> */}
          <VideoSummary
            chapterId={sections?.[0]?.chapters?.[0]?.id || ""}
            chapterTitle={sections?.[0]?.chapters?.[0]?.title || ""}
          />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              About this Class
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {course.description || "No description provided."}
            </p>
          </div>
          <div>
            {/* <CourseContentInstructorCard instructor={course.instructor} /> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseContentPage;
