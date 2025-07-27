"use client";

import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaRegCirclePlay } from "react-icons/fa6";
import { Chapter } from "@/types/course-details-api-response";

export default function CourseContentAccordion () {
  const [list, setList] = React.useState([
    {
      sectionId: 1,
      title: "Introduction",
      chapters: [
        {
          id: "",
          title: "This is an introduction video",
          position: 0,
          isPublished: true,
          isFree: true,
          chapterDuration: "2 min",
          courseId: "",
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "",
          title: "What is UI/UX ?",
          position: 1,
          isPublished: true,
          isFree: true,
          chapterDuration: "5 min",
          courseId: "",
          createdAt: "",
          updatedAt: "",
        },
      ],
    },
    {
      sectionId: 2,
      title: "Know your instructor",
      chapters: [
        {
          id: "",
          title: "Meet your Instructor",
          position: 3,
          isPublished: true,
          isFree: true,
          chapterDuration: "3 min",
          courseId: "",
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "",
          title: "Outro",
          position: 4,
          isPublished: true,
          isFree: true,
          chapterDuration: "4 min",
          courseId: "",
          createdAt: "",
          updatedAt: "",
        },
      ],
    },
  ]);

  return (
    <div className="list my-1 rounded-xl border bg-slate-100 py-1 dark:border-gray-700 dark:bg-gray-800">
      {list.map((accordion, key) => {
        return (
          <div key={key} className="border-b-1 dark:border-gray-300">
            <AccordionItem key={key} data={accordion} />
          </div>
        );
      })}
    </div>
  );
};

/// * -------------------------------- COMPONENTS -----------------------------------

const AccordionItem = (props: any) => {
  const [item, setItem] = React.useState(props.data);

  const toggleActiveItem = () => {
    let newActive = item.active === 1 ? 0 : 1;
    setItem({ ...item, active: newActive });
  };

  return (
    <div
      className={`group rounded-md bg-slate-100 p-3 transition-all duration-200 dark:bg-gray-800 md:p-5 ${
        item.active === 1 ? "activated" : ""
      }`}
    >
      <div className="py-auto flex items-center justify-between">
        <div className="py-auto flex items-center" onClick={toggleActiveItem}>
          <div className="cursor-pointer px-1 group-[.activated]:rotate-180">
            {" "}
            <IoMdArrowDropdown size={20} />{" "}
          </div>
          <div className="cursor-pointer pl-1 text-xs group-[.activated]:font-semibold group-[.activated]:text-indigo-500 hover:text-indigo-500 md:text-sm">
            {item.title}
          </div>
        </div>

        <div className="hidden items-center justify-end md:visible md:flex">
          {/* lections */}
          <p className="px-1 text-sm text-gray-600 dark:text-gray-400">
            ◽ 3 lectures
          </p>
          {/* total length */}
          <p className="text-sm text-gray-600 dark:text-gray-400">◽ 15min</p>
        </div>
      </div>
      <div className="max-h-0 overflow-hidden text-sm group-[.activated]:max-h-[120px]">
        <div className="ml-8 mt-2">
          {item.chapters.map((chapter: Chapter) => {
            return (
              <div key={chapter.id}>
                <AccordionItemDescriptionItem
                  name={chapter.title}
                  duration={chapter.createdAt.toString()!}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

type AccordionItemDescriptionItemProps = {
  name: string;
  duration: string;
};

const AccordionItemDescriptionItem = ({
  name,
  duration,
}: AccordionItemDescriptionItemProps) => {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center justify-start space-x-2">
        <FaRegCirclePlay size={18} />
        <p className="text-xs text-gray-700 dark:text-gray-300 md:text-sm">
          {name}
        </p>
      </div>
      <p className="text-xs text-gray-700 dark:text-gray-300 md:text-sm">
        {duration}
      </p>
    </div>
  );
};
