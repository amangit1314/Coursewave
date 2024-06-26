import React from "react";

export const CourseDescription = ({
  courseDescription,
}: {
  courseDescription: string;
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  // const courseDescription = course?.courseDescription || "Lorem ipsum...";

  const truncatedDescription = courseDescription.slice(0, 170);

  return (
    <div className="w-full h-auto space-y-4">
      <h3 className="tracking-tight text-xl  font-semibold text-zinc-800 dark:text-slate-200">
        About This Course
      </h3>
      <p
        className={`text-md text-base md:text-md md:p-0 md:pr-[8rem] w-auto line-clamp-5 md:line-clamp-3 font-noraml text-gray-700 dark:text-gray-400 ${
          isExpanded ? "text-clamp-4" : ""
        }`}
      >
        {truncatedDescription}
      </p>

      {courseDescription.length > 250 && (
        <div
          className="expand-toggle cursor-pointer text-blue-500 text-md text-base mt-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </div>
      )}
    </div>
  );
};
