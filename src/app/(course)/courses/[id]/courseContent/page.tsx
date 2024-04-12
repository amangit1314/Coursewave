"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Video from "next-video";
import { CgWebsite } from "react-icons/cg";
import { FaGithub, FaLinkedin, FaLock, FaNoteSticky } from "react-icons/fa6";
import { BsInstagram } from "react-icons/bs";
import { Button } from "@tremor/react";
import CourseContentNavbar from "./_components/course-content-navbar";
import {
  Chapter,
  Course,
  CourseAttachment,
  CourseSection,
  Instructor,
  CourseProgress,
} from "@prisma/client";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area";
import Footer from "@/components/LandingPage/footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useQuery } from "@tanstack/react-query";
import { courseChapters, sampleText } from "@/lib/mockData";
import useInstructorInfo from "@/hooks/use-instructor-info";
// import { Skeleton } from "@/components/ui/skeleton";
import CourseContentScreenSkeleton from "./_components/course-content-screen-skeleton";
import CourseChaptersSkeleton from "./_components/course-chapters-skeleton";
import CourseResourcesSkeleton from "./_components/course-resources-skeleton";
import { absoluteUrl } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { VideoPlayer } from "./_components/video-player";
import { redirect } from "next/navigation";
import CourseVideo from "./_components/course-video";
import useUserInfo from "@/hooks/use-user-info";
import { User } from "lucide-react";

function CourseContentPage({ params }: { params: { id: string } }) {

  const courseId = params?.id!;

  const fetchCourseInfo = async () => {
    console.log("Course id in Course Content page.tsx:", courseId);
    const response = await fetch(`/api/courses/${courseId}`);

    if (!response.ok) {
      console.log("Failed to fetch course content ...");
    }

    console.log(
      "Course id in courses/[courseId]/courseContent/page.tsx file:",
      courseId
    );
    return await response.json();
  };

  //* fetching course info
  const { isLoading, error, data } = useQuery({
    queryKey: ["courseContent", courseId],
    queryFn: fetchCourseInfo,
    staleTime: 1000 * 60 * 10,
  });

  const course: Course = data?.data!;

  const fetchCourseChapters = async () => {
    console.log("Course id in Course Content page.tsx:", courseId);

    const response = await fetch(
      absoluteUrl(`/api/courses/${courseId}/chapters`)
    );

    if (!response.ok) {
      console.log("Failed to fetch course chapters ...");
    }

    console.log(
      `Course id in courses/${courseId}/courseContent/page.tsx file: `,
      courseId
    );

    return await response.json();
  };

  //* fetching course chapters
  const {
    isLoading: isChaptersLoading,
    error: chaptersError,
    data: chaptersData,
  } = useQuery({
    queryKey: ["courseContent", courseId],
    queryFn: fetchCourseChapters,
    staleTime: 1000 * 60 * 10,
  });

  const chapters = chaptersData?.data;

  console.log(`Course: ${courseId}, Chapters: ${chaptersData}`)
  console.log('Chapters data', chapters);

  if (isLoading) return <CourseContentScreenSkeleton />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="overflow-x-hidden h-auto">
      {/* navbar */}
      <div className="inset-y-0 w-full z-50 ">
        <CourseContentNavbar course={course} />
      </div>

      {/* course details */}
      <CourseDetails
        chapters={chapters.chapters}
        instructorId={course?.instructorID ?? ""}
        courseId={courseId}
        isChaptersLoading={isChaptersLoading}
        chaptersError={chaptersError}
      />

      <div className="h-12 w-2" />

      {/* footer */}
      <Footer />
    </div>
  );
}

export default CourseContentPage;

//! .............................. Utility to saperate the details code ....................

type CourseDetailsProps = {
  chapters: Chapter[];
  instructorId: string;
  courseId: string;
  isChaptersLoading: boolean;
  chaptersError: Error | null;
};

const CourseDetails: React.FC<CourseDetailsProps> = ({
  chapters,
  instructorId,
  courseId,
  isChaptersLoading,
  chaptersError,
}) => {
  const user = useUserInfo();

  const [activeChapterIndex, setActiveChapterIndex] = React.useState<number>(0);
  const [courseProgress, setCourseProgress] = React.useState<CourseProgress>();
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  const activeChapter = chapters[activeChapterIndex];

  const aboutChapter = activeChapter
    ? activeChapter.description ?? sampleText
    : sampleText;

  console.log('Chapters inside course details: ', chapters)

  return (
    <div className="flex flex-col md:flex-row justify-start items-center md:items-start h-full max-w-7xl w-full mx-auto px-8 md:px-[3rem] space-x-8 overflow-x-hidden">
      {/* {COLUMN 1} with [Video And Course Metadata] */}
      <div className="mt-6 md:max-w-[45rem] w-full space-y-4">
        {/* video and mark as visited button */}
        <div className="max-w-xl md:max-w-[45rem] w-full h-auto">
          <div className="space-y-4 flex flex-col items-start justify-between">
            {/* [ONLY FOR MOBILE SCREENS] show chapters button & Mark as Completed btn  */}
            <div className="flex justify-between items-center md:hidden md:pb-0">
              {/* <Button color="green" className="text-xs text-white md:hidden ">
                ✔ Mark as completed
              </Button> */}

              <div>
                <ShowChapters
                  chapters={chapters}
                  activeChapterIndex={activeChapterIndex}
                  setActiveChapterIndex={setActiveChapterIndex}
                />
              </div>
            </div>

            {/* video component */}
            <div className="w-xl md:w-[45rem] h-auto md:h-[360px]">
              <CourseVideo activeChapter={activeChapter} userId={user.user?.id} />
            </div>

            {/* [NOT FOR MOBILE] Mark as Completed btn */}
            <div className="cursor-pointer hidden border border-stroke md:flex md:items-center md:justify-center h-10 w-10 rounded-full mt-4 text-zinc-800 hover:text-white hover:bg-green-600 transition-all duration-300 hover:border-none">
              ✔
            </div>
          </div>
        </div>

        {/* {COLUMN} WITH [about class, class notes and about instructor] */}
        <div className="max-w-[45rem] w-full space-y-6">
          {/* about this class with show more btn */}
          <div>
            <p className="text-xl md:text-lg mt-4 text-gray-950 dark:text-gray-300 font-semibold tracking-tight">
              About This Class
            </p>

            {/* class description */}
            <p
              className={`${
                showFullDescription ? "" : "line-clamp-4"
              } text-md text-base text-slate-700 dark:text-gray-400 py-4 md:py-2 md:text-md md:p-0 w-auto   ${
                showFullDescription ? "" : "overflow-hidden"
              }`}
            >
              {aboutChapter}
            </p>

            {/* show more text button */}
            {aboutChapter.length > 250 ? (
              <button
                className="text-sm tracking-tighter mt-2 font-medium hover:text-blue-600 dark:hover:text-blue-700 text-blue-500 dark:text-blue-600 underline .leading-relaxed"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                Show More
              </button>
            ) : (
              <div></div>
            )}
          </div>

          {/* course notes  */}
          <div className="md:hidden">
            <CourseNotes />
          </div>

          {/* About Instructor */}
          <div>
            <h3 className="text-xl md:text-lg mt-4 text-gray-950 dark:text-gray-300  font-semibold tracking-tight">
              About Instructor
            </h3>
            <InstructorCard
              instructorId={
                instructorId ? instructorId : "No instructor id provided ..."
              }
            />
          </div>
        </div>
      </div>

      {/* {COLUMN 2} with [Course Sections/Chapters, Course Resources ] */}
      <div className="mt-8 md:max-w-[27rem] w-full md:ml-[1rem] md:space-y-12">
        {/* course sections and chapters */}
        <div className="hidden md:flex md:flex-col">
          <CourseSectionsAndChapters
            chapters={chapters}
            activeChapterIndex={activeChapterIndex}
            setActiveChapterIndex={setActiveChapterIndex}
            isChaptersLoading={isChaptersLoading}
            chaptersError={chaptersError}
          />
        </div>

        {/* course resources */}
        <div className="h-auto">
          <h3 className="text-xl md:text-lg md:mt-4 text-gray-950 dark:text-gray-300  font-semibold tracking-tight">
            Course Resources
          </h3>
          <CourseAttachments courseId={courseId} />
        </div>
      </div>
    </div>
  );
};

//* ------------------------------- Components ---------------------------

function ShowChapters({
  chapters,
  activeChapterIndex,
  setActiveChapterIndex,
}: any) {
  return (
    <Sheet key={"left"}>
      <SheetTrigger asChild>
        <p className="w-auto text-sm font-medium text-blue-500">
          Show Chapters
        </p>
      </SheetTrigger>
      <ScrollArea>
        <SheetContent side={"right"} className=" h-full w-auto text-left">
          <SheetHeader>
            <SheetTitle>Chapters</SheetTitle>
            <SheetDescription>
              These are all the chapters in this course. click on anyone to view
              its content.
            </SheetDescription>
          </SheetHeader>

          {/* chapters list */}
          <div className="space-y-4 mt-6">
            {chapters && chapters.length > 0 ? (
              <ul className="space-y-2">
                {chapters?.map((chapter: Chapter, index: any) => {
                  return (
                    <li
                      onClick={() => setActiveChapterIndex(index)}
                      key={chapter.position}
                    >
                      <ChapterItem
                        title={chapter?.title}
                        duration={chapter?.chapterDuration}
                        isChapterFree={chapter?.isFree}
                        activeChapterIndex={activeChapterIndex}
                        index={index}
                      />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="space-y-2">
                {courseChapters?.map(
                  (
                    chapter: {
                      title: string;
                      chapterDuration: string;
                      isFree: boolean;
                      position: number;
                    },
                    index: any
                  ) => {
                    return (
                      <li
                        onClick={() => setActiveChapterIndex(index)}
                        key={chapter.position}
                      >
                        <ChapterItem
                          title={chapter?.title}
                          duration={chapter?.chapterDuration}
                          isChapterFree={chapter?.isFree}
                          activeChapterIndex={activeChapterIndex}
                          index={index}
                        />
                      </li>
                    );
                  }
                )}
              </ul>
            )}
          </div>

          {/* <SheetFooter> */}
          {/* <SheetClose asChild>
              <Button
                type="submit"
                color="red"
                className="text-white font-semibold"
              >
                Clear Notifications
              </Button>
            </SheetClose> */}
          {/* </SheetFooter> */}
        </SheetContent>
      </ScrollArea>
    </Sheet>
  );
}



function CourseSectionsAndChapters({
  chapters,
  activeChapterIndex,
  setActiveChapterIndex,
  isChaptersLoading,
  chaptersError,
}: any) {
  if (isChaptersLoading) return <CourseChaptersSkeleton />;
  if (chaptersError)
    return <div>Error in loading chapters: {chaptersError.message}</div>;

  return (
    <div>
      {chapters && chapters.length > 0 ? (
        <div className="max-w-xl w-full h-full ">
          <ScrollArea className="max-w-xl w-full max-h-[512px] h-full p-4 rounded-xl border border-stroke">
            <div>
              {/* course chapters text & total chapters count */}
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-200 ">
                  Course Chapters
                </p>

                <p className="text-sm dark:text-gray-300">
                  <span className="text-blue-500">
                    {chapters ? chapters.length : courseChapters.length}
                  </span>{" "}
                  chapters
                </p>
              </div>
              <p className="mb-4 text-sm">
                These are all the chapters in this course{" "}
              </p>

              {/* chapters list */}
              {chapters && chapters?.length > 0 ? (
                <ul className="space-y-2">
                  {chapters?.map((chapter: Chapter, index: any) => {
                    return (
                      <li
                        onClick={() => setActiveChapterIndex(index)}
                        key={chapter.position}
                      >
                        <ChapterItem
                          title={chapter?.title}
                          duration={chapter?.chapterDuration}
                          isChapterFree={chapter?.isFree}
                          activeChapterIndex={activeChapterIndex}
                          index={index}
                        />
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul className="space-y-2">
                  {courseChapters?.map((chapter: any, index: any) => {
                    return (
                      <li
                        onClick={() => setActiveChapterIndex(index)}
                        key={chapter.position}
                      >
                        <ChapterItem
                          title={chapter?.title}
                          duration={chapter?.chapterDuration}
                          isChapterFree={chapter?.isFree}
                          activeChapterIndex={activeChapterIndex}
                          index={index}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
              {/* chapters list */}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div>
          {/* course chapters text & total chapters count */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-200 ">
              Course Chapters
            </p>

            {/* <CoursesCollapsible
              chapters={chapters}
              activeChapterIndex={activeChapterIndex}
              setActiveChapterIndex={setActiveChapterIndex}
            /> */}
            <p className="text-sm dark:text-gray-300">
              <span className="text-blue-500">
                {chapters && chapters.length > 0
                  ? chapters.length
                  : courseChapters.length}
              </span>{" "}
              chapters
            </p>
          </div>
          <p className="mb-4 text-sm">
            These are all the chapters in this course{" "}
          </p>

          <ul className="space-y-2">
            {courseChapters?.map((chapter: any, index: any) => {
              return (
                <li
                  onClick={() => setActiveChapterIndex(index)}
                  key={chapter.position}
                >
                  <ChapterItem
                    title={chapter?.title}
                    duration={chapter?.chapterDuration}
                    isChapterFree={chapter?.isFree}
                    activeChapterIndex={activeChapterIndex}
                    index={index}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function ChapterItem({
  title,
  duration,
  isChapterFree,
  activeChapterIndex,
  index,
}: any) {
  const [videoPlaying, setVideoPlaying] = React.useState(false);

  var today = new Date();
  var time =
    today.getHours() + " : " + today.getMinutes() + " : " + today.getSeconds();

  return (
    <div
      className={`flex cursor-pointer hover:border-blue-500 justify-between hover:bg-blue-500 items-center py-2 px-2 text-base text-md tracking-tight hover:text-white rounded-badge border transition-all duration-300 ${
        activeChapterIndex === index ? "text-white bg-blue-500" : ""
      } `}
    >
      <div className="flex justify-start items-center space-x-2">
        <div onClick={() => setVideoPlaying(!videoPlaying)}>
          {videoPlaying ? (
            <FaPauseCircle
              className="cursor-pointer hover:bg-blue-700 p-1 rounded-full"
              size={24}
            />
          ) : (
            <FaPlayCircle
              className="cursor-pointer hover:bg-blue-700 p-1 rounded-full"
              size={24}
            />
          )}
        </div>
        <div className="link-clamp-1 overflow-hidden text-md text-base max-lines-1 line-clamp-1">
          {title}
        </div>
      </div>

      <div className="flex justify-start items-center space-x-2">
        {/* {isChapterFree ? <div></div> : <FaLock />} */}
        <p className="text-xs rounded-badge px-2 py-1 mr-1 text-center bg-white text-black font-normal">
          {duration ? duration : time}
        </p>
      </div>
    </div>
  );
}

function CourseNotes() {
  const [notes, setNotes] = React.useState([
    "What is Full Stack",
    "Node.js Installation Steps",
  ]);
  return (
    <ScrollArea className="max-w-[45rem] max-h-[300px] h-full  overflow-hidden w-full  md:mt-4 p-4 rounded-xl border border-storke">
      <div className="flex justify-between items-center ">
        <p className="text-lg text-gray-950 dark:text-gray-300 font-semibold tracking-tight">
          Your Notes
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <IoMdAddCircleOutline
              size={20}
              className="hover:text-blue-500 cursor-pointer"
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a note</DialogTitle>
              <DialogDescription>
                Add a note here. Click save when youre done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Note title"
                  className="col-span-3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note" className="text-right">
                  Note
                </Label>
                <Textarea
                  id="note"
                  placeholder="Write you note here ..."
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                color="gray"
                className="w-full border border-stroke bg-black hover:bg-blue-500 text-white"
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <p className="mb-4 text-sm">These are you notes for this class</p>

      <ul className="list-none max-h-[380px] h-full space-y-1">
        {notes.map((note, index) => {
          return (
            <li
              key={index}
              className="flex  justify-between items-center py-2 px-4 text-base text-md tracking-tight rounded-md border"
            >
              <div className="flex justify-start items-center space-x-2">
                <FaNoteSticky />
                <p className="text-sm cursor-pointer hover:text-blue-500 hover:underline">
                  {note}
                </p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MdModeEditOutline
                    className="cursor-pointer hover:bg-blue-700 p-1 rounded-full"
                    size={24}
                  />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit note</DialogTitle>
                    <DialogDescription>
                      Make changes in your note. Click save when youre done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        placeholder={note}
                        className="col-span-3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="note" className="text-right">
                        Note
                      </Label>
                      <Textarea
                        id="note"
                        placeholder={note}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      color="gray"
                      className="w-full border border-stroke bg-black hover:bg-blue-500 text-white"
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}

function CourseAttachments({ courseId }: { courseId: string }) {
  const fetchCourseAttachments = async () => {
    const response = await fetch(`/api/courses/${courseId}/attachments`);
    if (!response.ok) {
      console.log("Failed to fetch course attachments ...");
    }
    return await response.json();
  };

  const {
    isLoading,
    error,
    data: courseAttachments,
  } = useQuery({
    queryKey: ["courseAttachments", courseId],
    queryFn: fetchCourseAttachments,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) return <CourseResourcesSkeleton />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {courseAttachments && courseAttachments.length > 0 ? (
        <ul className=" md:ml-4 list-disc py-4 md:py-2 md:p-0 w-full font-normal">
          {courseAttachments.map((attachment: CourseAttachment) => (
            <li
              className="pb-1 text-md text-base text-gray-700  dark:text-gray-400 hover:text-blue-500 cursor-pointer transition-all duration-200"
              key={attachment.id}
            >
              <Link href={attachment.url}>{attachment.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="text-md ml-4 list-disc text-base py-4 md:py-2 md:text-md md:p-0  w-auto  font-noraml text-gray-700 dark:text-gray-400">
          <li className="pb-1">
            <Link href="">
              Connect with Martin on YouTube, Instagram, Spotify, and his
              website.
            </Link>
          </li>
          <li className="pb-1">
            <Link href="">
              Discover Martin’s best-selling book, “Modern Rock Guitar Soloing:
              Master Intermediate and Advanced Lead Guitar Concepts, Licks,
              Theory, & Technique for Rock Soloing & Improvisation”
            </Link>
          </li>
          <li>
            <Link href="">Resources PDF</Link>
          </li>
        </ul>
      )}
    </div>
  );
}

function InstructorCard({ instructorId }: { instructorId: string }) {
  const instructor: Instructor = useInstructorInfo(instructorId).data;

  return (
    <div className="max-w-3xl py-4 md:py-2  w-full flex flex-col justify-start items-start  rounded-xl space-y-4">
      <div className="flex space-x-4 justify-start items-center">
        <Image
          src={
            instructor
              ? instructor.instructorProfilePicUrl ??
                "/assets/images/user/user-01.png"
              : "/assets/images/user/user-01.png"
          }
          alt={`Image`}
          height={50}
          width={50}
          objectFit="cover"
          className="rounded-full flex items-center justify-center h-[50px] w-[50px] ring-1 ring-white"
        />

        <div className="flex flex-col justify-start items-start mr-auto text-base">
          <p className="text-lg text-gray-800 dark:text-slate-200 tracking-tight font-semibold">
            {instructor
              ? instructor.instructorName ?? "CourseWave"
              : "CourseWave"}
          </p>
          <p className="text-md text-base line-clamp-2 tracking-tight text-gray-700 dark:text-gray-400 font-thin ">
            {instructor
              ? instructor.instructorTag ?? "Full Stack Engineer"
              : "Full Stack Engineer"}
          </p>
        </div>
      </div>

      <div className="flex justify-start items-center space-x-4 ">
        <FaGithub size={22} className="hover:text-blue-500 cursor-pointer" />
        <BsInstagram size={22} className="hover:text-blue-500 cursor-pointer" />
        <FaLinkedin size={22} className="hover:text-blue-500 cursor-pointer" />
        <CgWebsite size={22} className="hover:text-blue-500 cursor-pointer" />
      </div>

      <p className="text-md  text-start text-base  md:text-md md:p-0  w-auto line-clamp-3 font-noraml text-gray-700 dark:text-gray-400">
        {instructor
          ? instructor.aboutInstructor ??
            `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos
        odit nam quae repellat quis cumque reiciendis autem ab expedita
        Provident eos odit nam quae repellat`
          : `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos
        odit nam quae repellat quis cumque reiciendis autem ab expedita
        Provident eos odit nam quae repellat`}
      </p>
    </div>
  );
}

// function CoursesCollapsible({
//   chapters,
//   activeChapterIndex,
//   setActiveChapterIndex,
//   isChaptersLoading,
//   chaptersError,
// }: any) {
//   const [isOpen, setIsOpen] = React.useState(false);

//   return (
//     <Collapsible
//       open={isOpen}
//       onOpenChange={setIsOpen}
//       className="w-[350px] space-y-2"
//     >
//       <div className="flex items-center justify-between space-x-4 px-4">
//         <h4 className="text-sm font-semibold">
//           @peduarte starred 3 repositories
//         </h4>
//         <CollapsibleTrigger asChild>
//           <p className="text-sm dark:text-gray-300">
//             <span className="text-blue-500">
//               {chapters && chapters.length > 0
//                 ? chapters.length
//                 : courseChapters.length}
//             </span>{" "}
//             chapters
//           </p>
//         </CollapsibleTrigger>
//       </div>
//       <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
//         @radix-ui/primitives
//       </div>
//       <CollapsibleContent className="space-y-2">
//         {/* <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
//           @radix-ui/colors
//         </div>
//         <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
//           @stitches/react
//         </div> */}
//         {chapters && chapters.length > 0 ? (
//           <div className="max-w-xl w-full h-full ">
//             <ScrollArea className="max-w-xl w-full max-h-[512px] h-full p-4 rounded-xl border border-stroke">
//               <div>
//                 {/* course chapters text & total chapters count */}
//                 <div className="flex justify-between items-center">
//                   <p className="text-lg font-semibold text-gray-900 dark:text-gray-200 ">
//                     Course Chapters
//                   </p>

//                   <p className="text-sm dark:text-gray-300">
//                     <span className="text-blue-500">
//                       {chapters ? chapters.length : courseChapters.length}
//                     </span>{" "}
//                     chapters
//                   </p>
//                 </div>
//                 <p className="mb-4 text-sm">
//                   These are all the chapters in this course{" "}
//                 </p>

//                 {/* chapters list */}
//                 {chapters && chapters?.length > 0 ? (
//                   <ul className="space-y-2">
//                     {chapters?.map((chapter: Chapter, index: any) => {
//                       return (
//                         <li
//                           onClick={() => setActiveChapterIndex(index)}
//                           key={chapter.position}
//                         >
//                           <ChapterItem
//                             title={chapter?.title}
//                             duration={chapter?.chapterDuration}
//                             isChapterFree={chapter?.isFree}
//                             activeChapterIndex={activeChapterIndex}
//                             index={index}
//                           />
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 ) : (
//                   <ul className="space-y-2">
//                     {courseChapters?.map((chapter: any, index: any) => {
//                       return (
//                         <li
//                           onClick={() => setActiveChapterIndex(index)}
//                           key={chapter.position}
//                         >
//                           <ChapterItem
//                             title={chapter?.title}
//                             duration={chapter?.chapterDuration}
//                             isChapterFree={chapter?.isFree}
//                             activeChapterIndex={activeChapterIndex}
//                             index={index}
//                           />
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 )}
//                 {/* chapters list */}
//               </div>
//             </ScrollArea>
//           </div>
//         ) : (
//           <div>
//             {/* course chapters text & total chapters count */}
//             <div className="flex justify-between items-center">
//               <p className="text-lg font-semibold text-gray-900 dark:text-gray-200 ">
//                 Course Chapters
//               </p>

//               <p className="text-sm dark:text-gray-300">
//                 <span className="text-blue-500">
//                   {chapters && chapters.length > 0
//                     ? chapters.length
//                     : courseChapters.length}
//                 </span>{" "}
//                 chapters
//               </p>
//             </div>
//             <p className="mb-4 text-sm">
//               These are all the chapters in this course{" "}
//             </p>

//             <ul className="space-y-2">
//               {courseChapters?.map((chapter: any, index: any) => {
//                 return (
//                   <li
//                     onClick={() => setActiveChapterIndex(index)}
//                     key={chapter.position}
//                   >
//                     <ChapterItem
//                       title={chapter?.title}
//                       duration={chapter?.chapterDuration}
//                       isChapterFree={chapter?.isFree}
//                       activeChapterIndex={activeChapterIndex}
//                       index={index}
//                     />
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         )}
//       </CollapsibleContent>
//     </Collapsible>
//   );
// }
