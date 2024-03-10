"use client";

import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaRegCirclePlay } from "react-icons/fa6";
import { Chapter } from "@prisma/client";

const Accordion = () => {
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
    <div className="bg-slate-100 list my-1 dark:bg-gray-800 py-1 rounded-xl border dark:border-gray-700">
      {list.map((accordion, key) => {
        return (
          <div key={key} className="dark:border-gray-300 border-b-1">
            <AccordionItem key={key} data={accordion} />
          </div>
        );
      })}
    </div>
  );
};

const AccordionItem = (props: any) => {
  const [item, setItem] = React.useState(props.data);

  const toggleActiveItem = () => {
    let newActive = item.active === 1 ? 0 : 1;
    setItem({ ...item, active: newActive });
  };

  return (
    <div
      className={` bg-slate-100 p-3 md:p-5 transition-all duration-200  group rounded-md dark:bg-gray-800 ${
        item.active === 1 ? "activated" : ""
      }`}
    >
      <div className="flex items-center py-auto justify-between">
        <div className="flex items-center py-auto" onClick={toggleActiveItem}>
          <div className="px-1 cursor-pointer group-[.activated]:rotate-180">
            {" "}
            <IoMdArrowDropdown size={20} />{" "}
          </div>
          <div className="pl-1 group-[.activated]:text-indigo-500 hover:text-indigo-500 group-[.activated]:font-semibold cursor-pointer text-xs md:text-sm">
            {item.title}
          </div>
        </div>

        <div className="hidden md:flex md:visible items-center justify-end">
          {/* lections */}
          <p className="text-sm text-gray-600 dark:text-gray-400 px-1">
            ◽ 3 lectures
          </p>
          {/* total length */}
          <p className="text-sm text-gray-600 dark:text-gray-400">◽ 15min</p>
        </div>
      </div>
      <div className="overflow-hidden group-[.activated]:max-h-[120px] max-h-0 text-sm">
        <div className="mt-2 ml-8">
          {item.chapters.map((chapter: Chapter) => {
            return (
              <div key={chapter.id}>
                <AccordionItemDescriptionItem
                  name={chapter.title}
                  duration={chapter.chapterDuration!}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Accordion;

type AccordionItemDescriptionItemProps = {
  name: string;
  duration: string;
};

const AccordionItemDescriptionItem = ({
  name,
  duration,
}: AccordionItemDescriptionItemProps) => {
  return (
    <div className="flex justify-between items-center py-1">
      <div className="flex justify-start items-center space-x-2">
        <FaRegCirclePlay size={18} />
        <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">{name}</p>
      </div>
      <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">{duration}</p>
    </div>
  );
};
