"use client";

import React from "react";
import { FaRegCirclePlay } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { Chapter, CourseSection } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

type CourseContentProps = {
  courseId: string;
};

export default function CourseContent({ courseId }: CourseContentProps) {
  const fetchCourseSections = async () => {
    const res = await fetch(`/api/courses/${courseId}/sections`);

    if (!res.ok) {
      console.error("Failed to fetch sections ...");
      // toast.error("Failed to fetch sections ...");
    }

    const data = await res.json();
    console.log("Course Sections Data in course-content.tsx : ", data);

    return data;
  };

  const {
    data: sections,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courseSections"],
    queryFn: fetchCourseSections,
    staleTime: 4,
  });

  const courseSections: CourseSection[] = sections?.data as CourseSection[];
  console.log("Course Sections: ", courseSections);

  if (isLoading) {
    return <div>Loading course content...</div>;
  }

  if (error) {
    console.log("ERROR: in sections and chapters", error.message);
    return (
      <p className="mt-4 text-red-600 text-md text-base">
        Error in loading sections & chapters: {error.message}
      </p>
    );
  }

  return (
    <div className="mt-4 pr-8 md:pr-0 md:p-0 max-w-3xl w-full pb-4 md:pb-6">
      <div>
        <h3 className="mb-4 tracking-tight text-xl font-semibold text-gray-700 dark:text-slate-200">
          Course Content:
        </h3>
        <div className="flex justify-between pb-2">
          <ul className="flex pl-4 list-disc space-x-6 flex-wrap md:flex justify-evenly text-gray-700 dark:text-gray-400">
            <li className="text-sm">
              {courseSections ? courseSections.length : 0} sections
            </li>

            <li className="text-sm">
              {/* {sectionChapters ? sectionChapters.length : 0} lectures */}8
              lectures
            </li>

            <li className="text-sm">3 min total length</li>
          </ul>

          {/* <div className="font-normal text-blue-500 text-sm">
            Expand all sections
          </div> */}
        </div>
      </div>

      <SectionsAndChaptersAccordion sections={courseSections} />
    </div>
  );
}

const SectionsAndChaptersAccordion = ({
  sections,
}: {
  sections: CourseSection[];
}) => {
  const [expandedSections, setExpandedSections] = React.useState<number[]>([]);

  const handleSectionToggle = (sectionId: number) => {
    setExpandedSections(
      expandedSections.includes(sectionId)
        ? expandedSections.filter((id) => id !== sectionId)
        : [...expandedSections, sectionId]
    );
  };

  return (
    <div>
      {sections ? (
        <div className="bg-slate-100 list my-1 dark:bg-gray-800 py-1 rounded-xl border dark:border-gray-700">
          {sections.map((section: CourseSection) => {
            const isExpanded = expandedSections.includes(
              section.courseSectionNumber
            );

            return (
              <div
                key={section.courseSectionId}
                className="dark:border-gray-300 border-b-1"
              >
                <AccordionSectionItem
                  section={section}
                  item={{ active: isExpanded ? 1 : 0 }}
                  setItem={() =>
                    handleSectionToggle(section.courseSectionNumber)
                  }
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

const AccordionSectionItem = ({
  section,
  item,
  setItem,
}: {
  section: CourseSection;
  item: { active: number };
  setItem: (any: any) => void;
}) => {
  const toggleActiveItem = () => {
    let newActive = item.active === 1 ? 0 : 1;
    setItem({ ...item, active: newActive });
  };

  const courseId = section.courseId;
  const courseSectionId = section.courseSectionId;

  const fetchChaptersForSection = async () => {
    const res = await fetch(
      `/api/courses/${courseId}/sections/${courseSectionId}/chapters`
    );

    if (!res.ok) {
      console.log(
        "ERROR, Failed to fetch chapters for a sectionId from api ..."
      );
      // toast.error(
      //   `Error: Failed to fetch chapters for section: ${courseSectionId}`
      // );
    }

    const data = await res.json();
    console.log(`Chapters for sectionId: ${courseSectionId} :`, data);

    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["sectionChapters"],
    queryFn: fetchChaptersForSection,
    staleTime: 4,
  });

  const chapters: Chapter[] = data?.data as Chapter[];
  console.log(`Section Chapters for sectionId: ${courseSectionId}`, chapters);

  return (
    <div
      className={` bg-slate-100 p-3 md:p-5 transition-all duration-200  group rounded-md dark:bg-gray-800 ${
        item.active === 1 ? "activated" : ""
      }`}
    >
      {/* <Toaster /> */}

      <div className="flex items-center py-auto justify-between">
        <div className="flex items-center py-auto" onClick={toggleActiveItem}>
          <div className="px-1 cursor-pointer group-[.activated]:rotate-180">
            <IoMdArrowDropdown size={20} />
          </div>
          <div className="pl-1 group-[.activated]:text-indigo-500 hover:text-indigo-500 group-[.activated]:font-semibold cursor-pointer text-xs md:text-sm line-clamp-1 overflow-clip">
            {section.courseSectionTitle}
          </div>
        </div>

        <ul className="hidden list-disc md:flex md:visible space-x-6 items-center justify-end">
          {/* lections */}
          <li className="text-xs text-gray-600 dark:text-gray-400">
            1 lecture
          </li>
          {/* total length */}
          <li className="text-xs text-gray-600 dark:text-gray-400">3 min</li>
        </ul>

        <p className="text-xs visible md:hidden">
          {chapters && chapters.length}{" "}
          {chapters ? (chapters.length === 1 ? "chapter" : "chapters") : ""}
        </p>
      </div>

      <div className="overflow-hidden group-[.activated]:max-h-[120px] max-h-0 text-sm">
        {chapters ? (
          <div className="mt-2 ml-8">
            {chapters.map((chapter: Chapter) => {
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
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

const AccordionItemDescriptionItem = ({
  name,
  duration,
}: {
  name: string;
  duration: string;
}) => {
  return (
    <div className="flex justify-between items-center py-1">
      <div className="flex justify-start items-center space-x-2">
        <FaRegCirclePlay size={18} />
        <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
          {name}
        </p>
      </div>
      <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
        {duration}
      </p>
    </div>
  );
};
