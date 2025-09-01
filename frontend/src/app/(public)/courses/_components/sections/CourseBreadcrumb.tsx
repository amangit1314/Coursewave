import { Course } from "@/types/course";
import { CourseWithOtherFields } from "@/types/course-with-other-fields";
import Link from "next/link";

const CourseBreadcrumb = ({ course }: { course: Course }) => {
  return (
    <div className="breadcrumbs text-sm">
      <ul className="flex breadcrumbs text-white">
        <li>
          <Link
            href={"/browseCourses"}
            className="mr-1 inline-flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="mr-1 h-4 w-4 stroke-current text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              ></path>
            </svg>
            Courses
          </Link>
        </li>
        <li>
          <span className="mr-1 inline-flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-4 w-4 stroke-current text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            {course?.title}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default CourseBreadcrumb;
