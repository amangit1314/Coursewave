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



