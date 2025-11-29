"use client";

import React from "react";
import { Callout } from "@tremor/react";
import { useQuery } from "@tanstack/react-query";
import { FaRegCirclePlay } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { Chapter, CourseSection } from "@/types/course-details-api-response";


export const CourseContent = ({ courseId }: { courseId: string }) => {
  const fetchCourseSections = async () => {
    // TODO:
    const res = await fetch(`/api/courses/${courseId}/sections`);

    if (!res.ok) {
      console.error("Failed to fetch sections ...");
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
  });

  const courseSections: CourseSection[] = sections?.data as CourseSection[];
  console.log("Course Sections: ", courseSections);

  if (isLoading) {
    return (
      <Callout
        className=""
        title="⏳ Loading course sections & chapters ..."
        color="yellow"
      >
        ⏳ Loading course sections and chapters ...
      </Callout>
    );
  }

  if (error) {
    console.log("ERROR: in sections and chapters", error.message);
    return (
      <Callout
        className=""
        title="Error loading course sections & chapters 🚨❌"
        color="red"
      >
        {error.message} 🚨❌ ...
      </Callout>
    );
  }

  return (
    <div className="mt-4 w-full max-w-3xl space-y-4 pr-8 md:p-0 md:pr-0">
      {/* heading and number of sections */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight text-gray-800 dark:text-slate-200">
          Course Content:
        </h3>

        <div className="flex justify-between">
          <ul className="flex list-disc flex-wrap justify-evenly space-x-6 pl-4 text-gray-700 dark:text-gray-400 md:flex">
            <li className="text-sm">
              {courseSections ? courseSections.length : 0} sections
            </li>
          </ul>
        </div>
      </div>

      {/* accordion */}
      <SectionsAndChaptersAccordion sections={courseSections} />
    </div>
  );
};

export default CourseContent;

// --------------------------- components --------------------------------

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
        : [...expandedSections, sectionId],
    );
  };

  return (
    <div>
      {sections ? (
        <div className="list my-1 rounded-xl border bg-slate-100 py-1 dark:border-gray-700 dark:bg-gray-800">
          {sections.map((section: CourseSection) => {
            const isExpanded = expandedSections.includes(
              section.position,
            );

            return (
              <div
                key={section.id}
                className="border-b-1 dark:border-gray-300"
              >
                <AccordionSectionItem
                  section={section}
                  item={{ active: isExpanded ? 1 : 0 }}
                  setItem={() =>
                    handleSectionToggle(section.position)
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
  const courseId = section.courseId!;
  const courseSectionId = section.id!;

  const toggleActiveItem = () => {
    let newActive = item.active === 1 ? 0 : 1;
    setItem({ ...item, active: newActive });
  };

  const fetchChaptersForSection = async () => {
    const res = await fetch(
      `/api/courses/${courseId}/sections/${courseSectionId}/chapters`,
    );

    if (!res.ok) {
      console.log(
      "ERROR, Failed to fetch chapters for a sectionId from api ...",
      );
    }

const data = await res.json();
console.log(`Chapters for sectionId: ${courseSectionId} :`, data);

return data;
  };

const { data, isLoading, error } = useQuery({
  queryKey: ["sectionChapters"],
  queryFn: fetchChaptersForSection,
});

if (isLoading) {
  return (
    <Callout
      className=""
      title="⏳ Loading course section chapters ..."
      color="yellow"
    >
      ⏳ Loading course section chapters ...
    </Callout>
  );
}

if (error) {
  console.log("ERROR: in loading section chapters", error.message);
  return (
    <Callout
      className=""
      title="Error loading section chapters 🚨❌"
      color="red"
    >
      {error.message} 🚨❌ ...
    </Callout>
  );
}

const chapters: Chapter[] = data?.data as Chapter[];
console.log(`Section Chapters for sectionId: ${courseSectionId}`, chapters);

return (
  <div
    className={`group rounded-md bg-slate-100 p-3 transition-all duration-200 dark:bg-gray-800 md:p-5 ${item.active === 1 ? "activated" : ""
      }`}
  >
    <div className="py-auto flex items-center justify-between">
      <div className="py-auto flex items-center" onClick={toggleActiveItem}>
        <div className="cursor-pointer px-1 group-[.activated]:rotate-180">
          <IoMdArrowDropdown size={20} />
        </div>
        <div className="line-clamp-1 cursor-pointer overflow-clip pl-1 text-xs group-[.activated]:font-semibold group-[.activated]:text-indigo-500 hover:text-indigo-500 md:text-sm">
          {section.title}
        </div>
      </div>

      <ul className="hidden items-center justify-end space-x-6 md:visible md:flex">
        <li className="text-xs text-gray-600 dark:text-gray-400">
          {chapters?.filter(
            (chapter) => chapter.id === section.id,
          )
            ? chapters?.filter(
              (chapter) =>
                chapter.id === section.id,
            ).length
            : 1}{" "}
          lecture
        </li>
      </ul>

      <p className="visible text-xs md:hidden">
        {chapters && chapters.length}{" "}
        {chapters ? (chapters.length === 1 ? "chapter" : "chapters") : ""}
      </p>
    </div>

    <div className="max-h-0 overflow-hidden text-sm group-[.activated]:max-h-[120px]">
      {chapters ? (
        <div className="ml-8 mt-2">
          {chapters.map((chapter: Chapter) => {
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
    <div className="flex items-center justify-start space-x-2 py-1">
      <FaRegCirclePlay size={18} />
      <p className="text-xs text-gray-700 dark:text-gray-300 md:text-sm">
        {name}
      </p>
    </div>
  );
};
