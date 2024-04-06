"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, Suspense, useEffect } from "react";
import { useQuery } from "react-query"; // Import useQuery hook
import Video from "next-video";
import Footer from "@/components/LandingPage/footer";
import Image from "next/image";
import { CgWebsite } from "react-icons/cg";
import { FaGithub, FaLinkedin, FaLock, FaNoteSticky } from "react-icons/fa6";
import { BsInstagram } from "react-icons/bs";
import { Button, Divider } from "@tremor/react";
import CourseContentNavbar from "./_components/course-content-navbar";
import {
  Chapter,
  Course,
  CourseAttachment,
  CourseSection,
  UserProgress,
} from "@prisma/client";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
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
import { IoNotificationsOutline } from "react-icons/io5";
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
import { getChapters } from "@/app/_actions/get-chapters";
import useInstructorInfo from "@/lib/hooks/use-instructor-info";
import Link from "next/link";
import { getCourseAttachments } from "@/app/_actions/get-attachments";
import Error from "next/error";
import error from "next/error";
import { Skeleton } from "@/components/ui/skeleton";

const courseChapters = [
  "Introduction",
  "Chapter 1",
  "Chapter 2",
  "Chapter 3",
  "Chapter 4",
  "Chapter 5",
  "Chapter 6",
  "Chapter 7",
  "Chapter 8",
  "Outro",
];

type CourseContentProps = {
  courseId: string;
};

function CourseContentPage({
  params,
}: {
  params: {
    id?: string;
  };
}) {
  const courseId = params?.id;

  const [loading, setLoading] = React.useState(true);
  // const [course, setCourse] = React.useState<Course>();
  // const [chapters, setChapters] = React.useState<Chapter[]>([]);
  const [sections, setSections] = React.useState<CourseSection[]>([]);
  const [courseProgress, setCourseProgress] = React.useState<UserProgress>();
  const [showFullDescription, setShowFullDescription] = React.useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = React.useState<number>(0);

  console.log("Course id in Course Content page.tsx:", courseId);

  const {
    isLoading,
    error: Error,
    data,
  } = useQuery(
    ["courseContent", courseId],
    async () => {
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) {
        console.log("Failed to fetch course content ...");
      }
      return await response.json();
    },
    {
      enabled: !!courseId, // Only fetch data if courseId is available
      staleTime: 1000 * 60 * 10, // Cache for 10 minutes (optional)
    }
  );

  // fetch course info where courseId is courseId
  // useEffect(() => {
  //   // https://localhost:3000
  //   fetch(`/api/courses/${courseId}`)
  //     .then((res) => {
  //       if (res.ok) {
  //         return res.json();
  //       } else {
  //         throw new Error("Failed to fetch courses");
  //       }
  //     })
  //     .then((data) => {
  //       console.log(data);
  //       // Assuming your data.data is an array of courses
  //       setCourse(data.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching courses:", error);
  //       setLoading(false);
  //     });
  // }, [courseId]);

  // fetch chapters where courseId is courseId
  // useEffect(() => {
  //   const fetchChapters = async (courseId: string) => {
  //     await getChapters({ courseId, chapters })
  //       .then((res) => setChapters(res.chapters))
  //       .catch((err) => {
  //         console.log("ERROR in fetching course chapters: ", err);
  //         console.error(err);
  //       });
  //   };

  //   fetchChapters(courseId!);
  // }, [chapters, courseId]);

  const course = data?.data; // Access course data from useQuery response
  const chapters = course?.chapters ?? []; // Handle potential missing chapters

// return <CourseContentScreenSkeleton />;


  if (isLoading) return <CourseContentScreenSkeleton />;
  // if (error) return <div>Error: {error}</div>;

  const activeChapter = chapters[activeChapterIndex];
  const aboutChapter = activeChapter
    ? activeChapter.description ??
      `Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Provident eos odit nam quae repellat quis cumque reiciendis
                autem ab expedita Provident eos odit nam quae repellat amet
                consectetur adipisicing elit. Provident eos odit nam quae
                repellat quis amet consectetur adipisicing elit. Provident eos
                odit nam quae repellat quis Provident eos odit nam quae repellat
                repellat quis amet consectetur adipisicing elit. Provident eos
                amet consectetur adipisicing elit. Provident eos odit nam quae
                repellat quis cumque reiciendis autem ab expedita Provident eos
                odit nam quae repellat amet consectetur adipisicing elit.
                Provident eos odit nam quae repellat quis amet consectetur
                adipisicing elit. Provident eos odit nam quae repellat quis`
    : `Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Provident eos odit nam quae repellat quis cumque reiciendis
                autem ab expedita Provident eos odit nam quae repellat amet
                consectetur adipisicing elit. Provident eos odit nam quae
                repellat quis amet consectetur adipisicing elit. Provident eos
                odit nam quae repellat quis Provident eos odit nam quae repellat
                repellat quis amet consectetur adipisicing elit. Provident eos
                amet consectetur adipisicing elit. Provident eos odit nam quae
                repellat quis cumque reiciendis autem ab expedita Provident eos
                odit nam quae repellat amet consectetur adipisicing elit.
                Provident eos odit nam quae repellat quis amet consectetur
                adipisicing elit. Provident eos odit nam quae repellat quis`;

  return (
    <div className="overflow-x-hidden">
      {/* navbar */}
      <div className="inset-y-0 w-full z-50 ">
        <CourseContentNavbar course={course} />
      </div>

      {/* course details */}
      <div className="flex justify-start items-center h-full max-w-7xl w-full mx-auto py-4 px-8 md:px-[3rem] space-x-8 ">
        {/* video and chapters list */}
        <div className="mt-4">
          {/* video and mark as visited button */}
          <div className="w-[45rem] h-[360px]">
            <div className="max-w-3xl h-auto w-full">
              <div className="flex justify-between items-center md:hidden pb-4">
                <ShowChapters
                  chapters={chapters}
                  activeChapterIndex={activeChapterIndex}
                  setActiveChapterIndex={setActiveChapterIndex}
                />
                <p
                  // color="green"
                  className=" text-green-600 text-xs"
                >
                  ✔ Mark as completed
                </p>
              </div>

              {/* video component */}
              <CourseVideo activeChapter={activeChapter} />

              <Button color="green" className="hidden md:visible mt-4 ml-auto">
                ✔ Mark as completed
              </Button>
            </div>
          </div>

          {/* about class, course resurces, class notes and instructor info */}
          <div className="flex flex-col md:flex-row my-4">
            <div className="max-w-[45rem] w-full">
              {/* about this class */}
              <div>
                <p className="text-xl md:text-lg mt-4 text-gray-950 dark:text-gray-300 font-semibold tracking-tight">
                  About This Class
                </p>

                {/* product description */}
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

              {/* course notes */}
              <div className="visible md:hidden">
                <CourseNotes />
              </div>

              {/* About Instructor */}
              <div>
                <h3 className="text-xl md:text-lg mt-4 text-gray-950 dark:text-gray-300  font-semibold tracking-tight">
                  About Instructor
                </h3>
                <InstructorCard instructorId={course?.instructorID} />
              </div>
            </div>

            {/* course notes for large screens */}
            <div className="hidden md:visible">
              <CourseNotes />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* course sections and chapters */}
          <div className="hidden lg:visible">
            <CourseSectionsAndChapters
              chapters={chapters}
              activeChapterIndex={activeChapterIndex}
              setActiveChapterIndex={setActiveChapterIndex}
            />
          </div>

          {/* course resources */}
          <div className="h-auto">
            <p className="text-xl md:text-lg mt-4 text-gray-950 dark:text-gray-300  font-semibold tracking-tight">
              Course Resources
            </p>
            {/* <CourseAttachments courseId={course?.courseId} /> */}
          </div>
        </div>
      </div>

      <Divider />

      {/* footer */}
      <Footer />
    </div>
  );
}

export default CourseContentPage;

//* ------------------------------------- Components ---------------------------------------------

function ShowChapters({
  chapters,
  activeChapterIndex,
  setActiveChapterIndex,
}: any) {
  return (
    <Sheet key={"left"}>
      <SheetTrigger asChild>
        <p className=" w-auto text-xs text-blue-600">Show Chapters</p>
      </SheetTrigger>
      <ScrollArea>
        <SheetContent side={"left"} className="text-left">
          <SheetHeader>
            <SheetTitle>Chapters</SheetTitle>
            <SheetDescription>
              These are all the chapters in this course. click on anyone to view
              its content.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4">
            {chapters?.length > 0 && (
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
            )}
          </div>

          <SheetFooter>
            {/* <SheetClose asChild>
              <Button
                type="submit"
                color="red"
                className="text-white font-semibold"
              >
                Clear Notifications
              </Button>
            </SheetClose> */}
          </SheetFooter>
        </SheetContent>
      </ScrollArea>
    </Sheet>
  );
}

type CourseVideoProps = {
  activeChapter: Chapter;
};

function CourseVideo({ activeChapter }: CourseVideoProps) {
  return (
    <Video
      accentColor="blue"
      className="smooth-content w-xl h-xl md:h-[360px] overflow-hidden rounded-lg object-cover md:w-[45rem] bg-blue-200"
      src={
        activeChapter
          ? activeChapter.videoUrl ?? "/assets/videos/4k.mp4"
          : "/assets/videos/4k.mp4"
      }
    />
  );
}

function CourseSectionsAndChapters({
  chapters,
  activeChapterIndex,
  setActiveChapterIndex,
}: any) {
  var today = new Date();
  var time =
    today.getHours() + " : " + today.getMinutes() + " : " + today.getSeconds();
  return (
    <div className="ml-[1rem] max-w-xl w-full ">
      <ScrollArea className="max-w-xl w-full mt-4 max-h-[512px] h-full p-4 rounded-xl border border-stroke">
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
          {chapters?.length > 0 && (
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
          )}
          {/* chapters list */}
        </div>
      </ScrollArea>
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
      className={`flex cursor-pointer hover:border-blue-500 justify-between hover:bg-blue-500 items-center py-2 px-4 text-base text-md tracking-tight hover:text-white rounded-md border transition-all duration-300 ${
        activeChapterIndex === index ? "text-white bg-blue-500" : ""
      } `}
    >
      <div className="flex justify-start items-center space-x-2">
        <div onClick={() => setVideoPlaying(!videoPlaying)}>
          {videoPlaying ? (
            <FaPauseCircle
              className="cursor-pointer hover:bg-blue-700 p-1 rounded-full"
              size={20}
            />
          ) : (
            <FaPlayCircle
              className="cursor-pointer hover:bg-blue-700 p-1 rounded-full"
              size={20}
            />
          )}
        </div>
        <div className="link-clamp-1 overflow-hidden text-md text-base max-lines-1 line-clamp-1">
          {title}
        </div>
      </div>

      <div className="flex justify-start items-center space-x-2">
        {isChapterFree ? <div></div> : <FaLock />}
        <p className="text-xs rounded-badge px-2 py-1 text-center bg-blue-500 text-white font-normal">
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
    <ScrollArea className="max-w-[380px] max-h-[300px] h-full  overflow-hidden w-full md:ml-[1rem] md:mt-4 p-4 rounded-xl border border-storke">
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

function CourseAttachments({ courseId }: any) {
  const [courseAttachments, setCourseAttachments] = React.useState<
    CourseAttachment[]
  >([]);

  useEffect(() => {
    const fetchCourseAttachments = async (courseId: string) => {
      getCourseAttachments({ courseId, courseAttachments })
        .then((res) => {
          setCourseAttachments(res.courseAttachments);
        })
        .catch((err: any) => {
          console.log("FAILED TO GET COURSE ATTACHMENTS, ERRO:", err.message);
        });
    };

    fetchCourseAttachments(courseId);
  }, [courseId, courseAttachments]);

  console.log("Course Attachments: ", courseAttachments);

  return (
    <div>
      {courseAttachments && courseAttachments.length > 0 ? (
        <ul className=" ml-4 list-disc py-4 md:py-2 md:p-0 w-auto font-noraml">
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

function InstructorCard({ instructorId }: any) {
  const insStyle = { color: "white" };
  const instructor = useInstructorInfo(instructorId);

  return (
    <div className="max-w-3xl mt-4  w-full flex flex-col justify-start items-start  rounded-xl space-y-4">
      <div className="flex space-x-4 justify-start items-center">
        <Image
          src={
            instructor.instructor
              ? instructor.instructor.instructorProfilePicUrl ??
                "/assets/images/user/user-01.png"
              : "/assets/images/user/user-01.png"
          }
          alt={`Image`}
          height={60}
          width={60}
          objectFit="cover"
          className="rounded-full flex items-center justify-center h-[60px] w-[60px] ring-1 ring-white"
        />

        <div className="flex flex-col justify-start items-start mr-auto text-base">
          <p className="text-lg text-gray-800 dark:text-slate-200 tracking-tight font-semibold">
            {instructor.instructor
              ? instructor.instructor.instructorName ?? "CourseWave"
              : "CourseWave"}
          </p>
          <p className="text-md text-base line-clamp-2 tracking-tight text-gray-700 dark:text-gray-400 font-thin ">
            {instructor.instructor
              ? instructor.instructor.instructorTag ?? "Full Stack Engineer"
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
        {instructor.instructor
          ? instructor.instructor.aboutInstructor ??
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
//* -----------------------------------------------------------------------------------------------


const CourseContentScreenSkeleton = () => {
  return (
    <div className="flex px-12 py-8 justify-between space-x-6 items-center max-w-7xl w-full overflow-x-hidden mx-auto">
      <div className="space-y-6 max-w-[720px] w-full">
        <Skeleton className="h-[360px] w-full rounded-xl" />

        <div className="space-y-4 max-w-[720px]  w-full  rounded-xl">
          <Skeleton className="h-[16px] w-[160px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-[12px] w-[720px] rounded-xl" />
            <Skeleton className="h-[12px] w-[720px] rounded-xl" />
            <Skeleton className="h-[12px] w-[720px] rounded-xl" />
            <Skeleton className="h-[12px] w-[720px] rounded-xl" />
          </div>
        </div>
      </div>

      <div className="max-w-[27rem] w-full border border-stroke p-2.5 h-full rounded-xl space-y-4">
        <Skeleton className="h-[16px] w-[16rem] rounded-xl" />

        <div className="space-y-2 w-full max-w-[25rem] ">
          <Skeleton className="h-[48px] rounded-xl" />
          <Skeleton className="h-[48px] rounded-xl" />
          <Skeleton className="h-[48px] rounded-xl" />
          <Skeleton className="h-[48px] rounded-xl" />
          <Skeleton className="h-[48px] rounded-xl" />
          <Skeleton className="h-[48px] rounded-xl" />
          <Skeleton className="h-[48px] rounded-xl" />
          <Skeleton className="h-[48px] rounded-xl" />

        </div>
      </div>
    </div>
  );
}