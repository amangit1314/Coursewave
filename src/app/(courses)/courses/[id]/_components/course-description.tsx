import React from "react";

const CourseDescription = ({
  courseDescription,
}: {
  courseDescription: string;
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  // const courseDescription = course?.courseDescription || "Lorem ipsum...";

  const truncatedDescription = courseDescription.slice(0, 170);

  return (
    <div className="h-auto w-full space-y-4">
      <h3 className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-slate-200">
        About This Course
      </h3>
      <p
        className={`text-md md:text-md font-noraml line-clamp-5 w-auto text-base text-gray-700 dark:text-gray-400 md:line-clamp-3 md:p-0 md:pr-[8rem] ${
          isExpanded ? "text-clamp-4" : ""
        }`}
      >
        {truncatedDescription}
      </p>

      {courseDescription.length > 250 && (
        <div
          className="expand-toggle text-md mt-1 cursor-pointer text-base text-blue-500"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </div>
      )}
    </div>
  );
};

export default CourseDescription;
