"use client";

import React, { useEffect } from "react";
import { FaRegCirclePlay } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { Chapter, CourseSection } from "@prisma/client";

type CourseContentProps = {
  courseId: string;
};
export default function CourseContent({ courseId }: CourseContentProps) {
  const [courseSections, setCourseSections] = React.useState<CourseSection[]>(
    []
  );
  const [courseChapters, setCourseChapters] = React.useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<String | null>(null);

  useEffect(() => {
    const fetchCourseSections = async (courseId: string) => {
      try {
        const res = await fetch(`/api/courses/${courseId}/sections`);

        if (!res.ok) {
          console.error("Failed to fetch sections from api:", res);
          setError("Failed to fetch sections ...");
        }

        const data = await res.json();
        console.log("Course Sections Data from api: ", JSON.stringify(data));

        setCourseSections(data.data);
      } catch (error: any) {
        console.error("Error fetching course sections data:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseSections(courseId);
  }, [courseId]);

  useEffect(() => {
    const fetchChaptersForSection = async (courseId: string) => {
      try {
        const res = await fetch(`/api/courses/${courseId}/chapterCount`);

        if (!res.ok) {
          console.log(
            "ERROR, Failed to fetch chapters for a sectionId from api ..."
          );
        }

        const data = await res.json();
        // console.log("Data from api: ", JSON.stringify(data));
        setCourseChapters(data.data);
      } catch (error: any) {
        console.log(
          "ERROR, Failed to fetch chapters from api in catch ...",
          error.message
        );
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChaptersForSection(courseId);
  }, [courseId]);

  if (isLoading) {
    return <div>Loading course content...</div>;
  }

  if (error) {
    console.log("ERROR: in sections and chapters", error);
    return <p>Error: {error}</p>;
  }

  return (
    <div className="mt-4 pr-8 md:pr-0 md:p-0 max-w-3xl w-full pb-4 md:pb-6">
      <div>
        <h3 className="mb-4 tracking-tight text-xl font-semibold text-gray-700 dark:text-slate-200">
          Course Content:
        </h3>
        <div className="flex justify-between pb-2">
          <ul className="flex pl-4 list-disc space-x-6 flex-wrap md:flex justify-evenly text-gray-700 dark:text-gray-400">
            {/* sections */}
            <li className="text-sm">
              {courseSections ? courseSections.length : 0} sections
            </li>
            {/* lections */}
            <li className="text-sm">
              {courseChapters ? courseChapters.length : 0} lectures
            </li>
            {/* total length */}
            <li className="text-sm">3 min total length</li>
          </ul>

          {/* Expand all sections */}
          {/* <div className="font-normal text-blue-500 text-sm">
            Expand all sections
          </div> */}
        </div>
      </div>

      {/* accordion (collapse expand for sections and chapters) */}
      <SectionsAndChaptersAccordion sections={courseSections!} />
    </div>
  );
}

// --------------------------------------------------------------------------------------
type SectionsAndChaptersAccordionProps = {
  sections: CourseSection[];
};

const SectionsAndChaptersAccordion = ({
  sections,
}: SectionsAndChaptersAccordionProps) => {
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

// Widget to display and open close the accordion (representing sections & on open you can see the chapters inside this section)
type AccordionSectionItemProps = {
  // section: CourseSection | (CourseSection & Chapter[]);
  section: CourseSection;
  item: { active: number }; // Explicitly define the state type
  setItem: any;
};

const AccordionSectionItem = ({
  section,
  item,
  setItem,
}: AccordionSectionItemProps) => {
  const toggleActiveItem = () => {
    let newActive = item.active === 1 ? 0 : 1;
    setItem({ ...item, active: newActive });
  };

  const [chapters, setChapters] = React.useState<Chapter[]>([]);

  const courseId = section.courseId;
  const courseSectionId = section.courseSectionId;

  useEffect(() => {
    const fetchChaptersForSection = async () => {
      const res = await fetch(
        `/api/courses/${courseId}/sections/${courseSectionId}/chapters`
      );

      if (!res.ok) {
        console.log(
          "ERROR, Failed to fetch chapters for a sectionId from api ..."
        );
      }

      const data = await res.json();
      console.log(
        `Chapters for a particualr sectionId: ${courseSectionId} :`,
        data
      );
      setChapters(data.data);
    };

    fetchChaptersForSection();
  }, [courseId, courseSectionId]);

  return (
    <div
      className={` bg-slate-100 p-3 md:p-5 transition-all duration-200  group rounded-md dark:bg-gray-800 ${
        item.active === 1 ? "activated" : ""
      }`}
    >
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
          <li className="text-sm text-gray-600 dark:text-gray-400">
            1 lecture
          </li>
          {/* total length */}
          <li className="text-sm text-gray-600 dark:text-gray-400">3 min</li>
        </ul>
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

// Widget to display the chapter name and duration
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
