"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Button, Callout } from "@tremor/react";
import { Chapter, Course, CourseAttachment, Instructor } from "@prisma/client";
import { FaNoteSticky, FaLink } from "react-icons/fa6";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { TiTick, TiTickOutline } from "react-icons/ti";

//* -------------------- Custom Hooks ------------------------------
import { courseChapters, sampleText } from "@/lib/mockData";
import { useInstructorStore } from "@/zustand/instructorStore";
import { useCoursesStore } from "@/zustand/coursesStore";
import { useUserStore } from "@/zustand/userStore";

//? -------------------- Custom Components ------------------------------
import CourseContentScreenSkeleton from "./_components/skeletons/course-content-screen-skeleton";
import CourseResourcesSkeleton from "./_components/skeletons/course-resources-skeleton";
import CourseContentNavbar from "./_components/course-content-navbar";
import CourseVideo from "./_components/course-video";
import { Footer } from "@/components/LandingPage/footer";
import { CourseWithOtherFields } from "@/types/course-with-other-fields";

import { useCallback, useEffect } from "react";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import internal from "stream";

const CourseContentPage = ({ params }: { params: { id: string } }) => {
  const courseId = params?.id! || "";
  const { user } = useUserStore();
  const {
    course,
    attachments,
    fetchCourse,
    fetchCourseCloudinaryData,
    fetchCourseAttachments,
    fetchCourseProgress,
    fetchCourseReviews,
    loadingState,
  } = useCoursesStore();
  const router = useRouter();
  const userId = user?.id || "";
  console.log("============> User id in course content page: ", userId);

  // Memoize the fetch actions
  // const memoizedFetchCourse = useCallback(
  //   () => fetchCourse(courseId),
  //   [courseId, fetchCourse],
  // );
  // const memoizedFetchCourseCloudinaryData = useCallback(
  //   () => fetchCourseCloudinaryData(courseId),
  //   [courseId, fetchCourseCloudinaryData],
  // );
  // const memoizedFetchCourseAttachments = useCallback(
  //   () => fetchCourseAttachments(courseId),
  //   [courseId, fetchCourseAttachments],
  // );
  // const memoizedFetchCourseProgress = useCallback(
  //   () => fetchCourseProgress(courseId, userId),
  //   [courseId, userId, fetchCourseProgress],
  // );
  // const memoizedFetchCourseReviews = useCallback(
  //   () => fetchCourseReviews(courseId),
  //   [courseId, fetchCourseReviews],
  // );

  // useEffect(() => {
  //   memoizedFetchCourse();
  //   memoizedFetchCourseCloudinaryData();
  //   memoizedFetchCourseAttachments();
  //   memoizedFetchCourseProgress();
  //   memoizedFetchCourseReviews();
  // }, [
  //   memoizedFetchCourse,
  //   memoizedFetchCourseCloudinaryData,
  //   memoizedFetchCourseAttachments,
  //   memoizedFetchCourseProgress,
  //   memoizedFetchCourseReviews,
  // ]);

  // Handle loading state
  const isLoading = loadingState.loading;

  // Handle errors
  const error = loadingState.error;

  if (isLoading) {
    return <CourseContentScreenSkeleton />;
  }

  if (error) {
    if (error === "[UNAUTHORIZED_ACCESS], User not enrolled in this course") {
      toast.error("You're not enrolled in this course 🧐👮‍♂️🚫❌ ...");
      router.back();
    } else {
      return (
        <div className="w-7xl mx-auto flex items-center justify-center align-middle">
          <Callout title="Failed to Fetch Course Info 🚨❌" color="red">
            ERROR In Course Content page: <span>{error} 🚨❌ ...</span>
          </Callout>
        </div>
      );
    }
  }

  return (
    <div className="h-auto overflow-x-hidden">
      {/* <div className="inset-y-0 z-50 w-full">
        <CourseContentNavbar course={course} />
      </div> */}

      <CourseDetails
        chapters={course?.chapters as Chapter[]}
        instructor={course?.Instructor as Instructor}
        courseId={courseId}
        userId={userId}
        isChaptersLoading={loadingState.loading}
        chaptersError={loadingState.error}
        courseAttachments={attachments}
      />

      <div className="h-12 w-2" />
      {/* <Footer /> */}
    </div>
  );
};

export default CourseContentPage;

//! <--------------------- Utility to separate the details code --------------------->
type CourseDetailsProps = {
  chapters: Chapter[];
  instructor: Instructor;
  courseId: string;
  userId: string;
  isChaptersLoading: boolean;
  chaptersError: string | null;
  courseAttachments: CourseAttachment[];
};

const CourseDetails: React.FC<CourseDetailsProps> = ({
  chapters = [], // Default to an empty array
  instructor,
  courseId,
  userId,
  isChaptersLoading,
  chaptersError,
  courseAttachments,
}) => {
  const { updateCourseProgress } = useCoursesStore();
  const [activeChapterIndex, setActiveChapterIndex] = React.useState<number>(0);
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  // Only access activeChapter if chapters has elements
  const activeChapter =
    chapters.length > 0 ? (chapters[activeChapterIndex] ?? chapters[0]) : null;
  const chapterId = activeChapter?.id;

  const aboutChapter = activeChapter
    ? (activeChapter.description ?? sampleText)
    : sampleText;

  console.log("Chapters inside course details: ", chapters);

  const handleProgressChange = () => {
    if (chapterId) {
      updateCourseProgress(userId, courseId, chapterId);
    }
  };

  if (isChaptersLoading) {
    return <p>Loading chapters...</p>;
  }

  if (chaptersError) {
    return <p>Error loading chapters: {chaptersError}</p>;
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-start space-x-8 overflow-x-hidden px-8 md:flex-row md:items-start md:px-[3rem]">
      {/* {COLUMN 1} with [Video And Course Metadata] */}
      <div className="mt-6 w-full space-y-4 md:max-w-[45rem]">
        {/* video, show chapters btn(for mobile only) and mark as visited btn */}
        <div className="flex h-auto w-full max-w-xl flex-col items-start justify-between space-y-4 md:max-w-[45rem]">
          {/* [ONLY FOR MOBILE SCREENS] show chapters button */}
          <div className="flex items-start justify-start md:hidden md:pb-0">
            <ShowChapters
              chapters={chapters}
              activeChapterIndex={activeChapterIndex}
              setActiveChapterIndex={setActiveChapterIndex}
            />
          </div>

          {/* video component */}
          <div className="w-xl h-auto md:h-[360px] md:w-[45rem]">
            {activeChapter && <CourseVideo activeChapter={activeChapter} />}
          </div>

          {/* [NOT FOR MOBILE] Mark as Completed btn */}
          {activeChapter && (
            <Button
              color="green"
              onClick={handleProgressChange}
              className="border-stroke mt-4 hidden h-10 w-10 cursor-pointer overflow-hidden rounded-full border text-zinc-800 transition-all duration-300 hover:border-none hover:bg-green-600 hover:text-white dark:text-white md:flex md:items-center md:justify-center"
            >
              {activeChapter.isCompleted ? <TiTick /> : <TiTickOutline />}
            </Button>
          )}
        </div>

        {/* {COLUMN} WITH [about class, class notes and about instructor] */}
        <div className="w-full max-w-[45rem] space-y-6">
          {/* about this class with show more btn */}
          <div>
            <p className="mt-4 text-xl font-semibold tracking-tight text-gray-950 dark:text-gray-300 md:text-lg">
              About This Class
            </p>

            {/* class description */}
            <p
              className={`${
                showFullDescription ? "" : "line-clamp-4"
              } text-md md:text-md w-auto py-4 text-base text-slate-700 dark:text-gray-400 md:p-0 md:py-2 ${
                showFullDescription ? "" : "overflow-hidden"
              }`}
            >
              {aboutChapter}
            </p>

            {/* show more text button */}
            {aboutChapter.length > 250 ? (
              <button
                className=".leading-relaxed mt-2 text-sm font-medium tracking-tighter text-blue-500 underline hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-700"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                Show More
              </button>
            ) : (
              <div></div>
            )}
          </div>

          {/* course notes  */}
          <div className="hidden">
            <CourseNotes />
          </div>

          {/* About Instructor */}
          <div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-gray-950 dark:text-gray-300 md:text-lg">
              About Instructor
            </h3>
            <CourseContentInstructorCard instructor={instructor} />
          </div>
        </div>
      </div>

      {/* {COLUMN 2} with [Course Sections/Chapters, Course Resources ] */}
      <div className="mt-8 w-full md:ml-[1rem] md:max-w-[27rem] md:space-y-12">
        {/* course sections and chapters */}
        <div className="hidden md:flex md:flex-col">
          <CourseSectionsAndChapters
            chapters={chapters}
            activeChapterIndex={activeChapterIndex}
            setActiveChapterIndex={setActiveChapterIndex}
            // isChaptersLoading={isChaptersLoading}
            chaptersError={chaptersError}
          />
        </div>

        {/* course resources */}
        <div>
          <p className="text-xl font-semibold tracking-tight text-gray-950 dark:text-gray-300 md:mt-4 md:text-lg">
            Course Resources
          </p>
          <CourseAttachments courseAttachments={courseAttachments} />
        </div>
      </div>
    </div>
  );
};

//* <--------------------- Components --------------------->

type ShowChaptersProps = {
  chapters: Chapter[];
  activeChapterIndex: Number;
  setActiveChapterIndex: any;
};

const ShowChapters = ({
  chapters,
  activeChapterIndex,
  setActiveChapterIndex,
}: ShowChaptersProps) => {
  return (
    <Sheet key={"left"}>
      <SheetTrigger asChild>
        <p className="w-auto cursor-pointer text-sm font-medium text-blue-500 transition-all duration-300">
          Show Chapters
        </p>
      </SheetTrigger>
      <ScrollArea>
        <SheetContent side={"right"} className="h-full w-auto text-left">
          <SheetHeader>
            <SheetTitle>Chapters</SheetTitle>
            <SheetDescription>
              These are all the chapters in this course. click on anyone to view
              its content.
            </SheetDescription>
          </SheetHeader>

          {/* chapters list */}
          <div className="mt-6 space-y-4">
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
                        duration={"0"}
                        // duration={chapter?.createdAt.toLocaleDateString.toString()} // TODO: use chapter duration here
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
                    index: number,
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
                  },
                )}
              </ul>
            )}
          </div>
        </SheetContent>
      </ScrollArea>
    </Sheet>
  );
};

type CourseSectionsAndChaptersProps = {
  chapters: any;
  activeChapterIndex: Number;
  // setActiveChapter: any;
  setActiveChapterIndex: any;
  chaptersError: any;
};

const CourseSectionsAndChapters = ({
  chapters,
  activeChapterIndex,
  setActiveChapterIndex,
  chaptersError,
}: CourseSectionsAndChaptersProps) => {
  if (chaptersError) {
    return <div>Error in loading chapters: {chaptersError.message}</div>;
  }

  return (
    <div>
      {chapters && chapters.length > 0 ? (
        <div className="h-full w-full max-w-xl md:mt-2 md:h-[360px]">
          <ScrollArea className="border-stroke h-full max-h-[512px] w-full max-w-xl rounded-xl border p-4">
            <div>
              {/* course chapters text & total chapters count */}
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                  Course Chapters
                </p>

                {/* totoal no of chapters */}
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
                          duration={"0"}
                          // duration={chapter?.createdAt.toLocaleDateString.toString()} /// TODO: use chapter duration here
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
                          // duration={chapter?.chapterDuration}
                          duration={"0"}
                          isChapterFree={chapter?.isFree}
                          activeChapterIndex={activeChapterIndex}
                          index={index}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div>
          {/* course chapters text & total chapters count */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-200">
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
};

type ChapterItemProps = {
  title: string;
  duration: string;
  isChapterFree: boolean;
  activeChapterIndex: Number;
  // setActiveChapterIndex: any;
  index: Number;
};

const ChapterItem = ({
  title,
  duration,
  isChapterFree,
  activeChapterIndex,
  index,
}: ChapterItemProps) => {
  const [videoPlaying, setVideoPlaying] = React.useState(false);

  var today = new Date();
  var time =
    today.getHours() + " : " + today.getMinutes() + " : " + today.getSeconds();

  return (
    <div
      className={`text-md flex cursor-pointer items-center justify-between rounded-xl border p-4 text-base tracking-tight transition-all duration-300 hover:border-blue-500 dark:hover:text-white ${
        activeChapterIndex === index
          ? "border-blue-500 text-zinc-700 dark:text-white"
          : ""
      } `}
    >
      <div className="flex items-center justify-start space-x-2">
        <div onClick={() => setVideoPlaying(!videoPlaying)}>
          {videoPlaying ? (
            <FaPauseCircle
              className="cursor-pointer rounded-full p-1 hover:bg-blue-700"
              size={24}
            />
          ) : (
            <FaPlayCircle
              className="cursor-pointer rounded-full p-1 hover:bg-blue-700"
              size={24}
            />
          )}
        </div>

        <div>
          <div className="link-clamp-1 max-lines-1 line-clamp-1 overflow-clip text-xs">
            Chapter {index.toString()}
          </div>
          <div className="link-clamp-2 text-md max-lines-1 line-clamp-1 overflow-hidden text-base">
            {title}
          </div>
        </div>
      </div>

      {/* <div className="flex items-center justify-start space-x-2">
        <p className="mr-1 rounded-badge bg-white px-2 py-1 text-center text-xs font-normal text-black">
          {duration ? duration : time}
        </p>
      </div> */}
    </div>
  );
};

const CourseNotes = () => {
  const [notes, setNotes] = React.useState([
    "What is Full Stack",
    "Node.js Installation Steps",
  ]);
  return (
    <ScrollArea className="border-storke h-full max-h-[300px] w-full max-w-[45rem] overflow-hidden rounded-xl border p-4 md:mt-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold tracking-tight text-gray-950 dark:text-gray-300">
          Your Notes
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <IoMdAddCircleOutline
              size={20}
              className="cursor-pointer hover:text-blue-500"
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
                className="border-stroke w-full border bg-black text-white hover:bg-blue-500"
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <p className="mb-4 text-sm">These are you notes for this class</p>

      <ul className="h-full max-h-[380px] list-none space-y-1">
        {notes.map((note, index) => {
          return (
            <li
              key={index}
              className="text-md flex items-center justify-between rounded-md border px-4 py-2 text-base tracking-tight"
            >
              <div className="flex items-center justify-start space-x-2">
                <FaNoteSticky />
                <p className="cursor-pointer text-sm hover:text-blue-500 hover:underline">
                  {note}
                </p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MdModeEditOutline
                    className="cursor-pointer rounded-full p-1 hover:bg-blue-700"
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
                      className="border-stroke w-full border bg-black text-white hover:bg-blue-500"
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
};

type CourseAttachmentsProps = {
  courseAttachments: CourseAttachment[];
};

const CourseAttachments = ({ courseAttachments }: CourseAttachmentsProps) => {
  console.log("Course Attachments: ", courseAttachments);

  return (
    <div>
      {courseAttachments && courseAttachments.length > 0 ? (
        <ul className="w-full list-disc py-4 font-normal md:ml-4 md:p-0 md:py-2">
          {courseAttachments.map((attachment: CourseAttachment) => (
            <CourseAttachmentItem
              key={attachment.id}
              id={attachment.id}
              url={attachment.url}
              name={attachment.name}
            />
          ))}
        </ul>
      ) : (
        <ul className="text-md md:text-md font-noraml ml-4 w-auto list-disc py-4 text-base text-gray-700 dark:text-gray-400 md:p-0 md:py-2">
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
};

type CourseAttachmentCardProps = {
  id: string;
  url: string;
  name: string;
};

const CourseAttachmentItem = ({ id, url, name }: CourseAttachmentCardProps) => {
  return (
    <div
      className="text-md group hover flex cursor-pointer items-center justify-between pb-1 text-base text-gray-700 transition-all duration-200 hover:rounded-md hover:text-blue-500 dark:text-gray-400"
      key={id}
    >
      <Link
        className="text-sm tracking-tight group-hover:font-medium dark:hover:text-blue-500"
        href={url}
      >
        {name}
      </Link>
      <FaLink className="text-blue-600" />
    </div>
  );
};

type CourseContentInstructorCardProps = {
  instructor: Instructor;
};

const CourseContentInstructorCard = ({
  instructor,
}: CourseContentInstructorCardProps) => {
  const instructorID = instructor?.instructorID ?? "N/A";
  const instructorName = instructor?.instructorName ?? "CourseWave";
  const instructorTag = instructor?.instructorTag ?? "Full Stack Engineer";
  const instructorProfilePicUrl =
    instructor?.instructorProfilePicUrl ?? "/assets/images/user/user-01.png";
  const aboutInstructor =
    instructor?.aboutInstructor ??
    `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos
     odit nam quae repellat quis cumque reiciendis autem ab expedita. Provident eos odit nam quae repellat.`;

  console.log(
    `Instructor id in the instructor-card inside (course)/courses/[id]/courseContent/page.tsx: ${instructorID}`,
  );
  console.log(
    "Instructor Info in instructor-card inside (course)/courses/[id]/courseContent/page.tsx: ",
    instructor,
  );

  return (
    <div className="flex w-full max-w-3xl flex-col items-start justify-start space-y-4 rounded-xl py-4 md:py-2">
      <div className="flex items-center justify-start space-x-4">
        <Image
          src={instructorProfilePicUrl}
          alt={`Image of ${instructorName}`}
          height={50}
          width={50}
          objectFit="cover"
          className="flex h-[50px] w-[50px] items-center justify-center rounded-full ring-1 ring-white"
        />

        <div className="mr-auto flex flex-col items-start justify-start text-base">
          <p className="text-lg font-semibold tracking-tight text-gray-800 dark:text-slate-200">
            {instructorName}
          </p>
          <p className="text-md line-clamp-2 text-base font-thin tracking-tight text-gray-700 dark:text-gray-400">
            {instructorTag}
          </p>
        </div>
      </div>

      <p className="text-md md:text-md line-clamp-3 w-auto text-start text-base font-normal text-gray-700 dark:text-gray-400 md:p-0">
        {aboutInstructor}
      </p>
    </div>
  );
};
