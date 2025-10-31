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
// import { Chapter, CourseAttachment, Instructor } from "@prisma/client";
import { Course } from "@/types/course";
import { FaNoteSticky, FaLink } from "react-icons/fa6";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";

//* -------------------- Custom Hooks ------------------------------
import { courseChapters, sampleText } from "@/lib/mock/mockData";
import { useInstructorStore } from "@/zustand/instructorStore";
import { useCoursesStore } from "@/zustand/coursesStore";
import { useUserStore } from "@/zustand/userStore";

//? -------------------- Custom Components ------------------------------
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Chapter, Instructor } from "@/types/course-details-api-response";


type CourseContentInstructorCardProps = {
  instructor: Instructor;
};

const CourseContentInstructorCard = ({
  instructor,
}: CourseContentInstructorCardProps) => {
  const instructorID = instructor?.id ?? "N/A";
  const instructorName = instructor?.user.name ?? "CourseWave";
  const instructorTag = instructor?.expertise ?? "Full Stack Engineer";
  const instructorProfilePicUrl =
    instructor?.user.profileImageUrl ?? "/assets/images/user/user-01.png";
  // const aboutInstructor =
  //   instructor?.aboutInstructor ??
  //   `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos
  //    odit nam quae repellat quis cumque reiciendis autem ab expedita. Provident eos odit nam quae repellat.`;

  console.log(
    `Instructor id in the instructor-card inside (course)/courses/[id]/courseContent/page.tsx: ${instructorID}`
  );
  console.log(
    "Instructor Info in instructor-card inside (course)/courses/[id]/courseContent/page.tsx: ",
    instructor
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

      {/* <p className="text-md md:text-md line-clamp-3 w-auto text-start text-base font-normal text-gray-700 dark:text-gray-400 md:p-0">
        {aboutInstructor}
      </p> */}
    </div>
  );
};
