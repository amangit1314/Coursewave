import { Course, User } from "@prisma/client";
import Link from "next/link";

type EnrolledCourseProps = {
  enrollmentId: string;
  userId: string;
  courseId: string;
  enrollmentDate: string;
  completionStatus: string;
  user: User;
  course: Course;
};

const EnrolledCoursesWidget = ({
  enrolledCourses,
}: {
  enrolledCourses: EnrolledCourseProps[];
}) => {
  return (
    <ul className="space-y-4 rounded-xl px-4 border border-stroke mx-4  ">
      {enrolledCourses.map((enrolledCourse) => {
        return (
          <div
            key={enrolledCourse.enrollmentId}
            className="flex justify-between items-center py-2 text-sm border-b-2"
          >
            <div>{enrolledCourse?.enrollmentId ?? "Course Id Unavailable"}</div>

            <Link
              href={`/courses/${enrolledCourse?.course?.courseId}`}
              className="hover:text-blue-500 cursor-pointer transition-all duration-300"
            >
              {enrolledCourse?.course?.courseTitle ??
                "Course Title Unavailable"}
            </Link>

            <div>
              {enrolledCourse?.enrollmentDate ?? "Course Title Unavailable"}
            </div>

            <div>
              {enrolledCourse?.completionStatus ??
                "Course completion status Unavailable"}
            </div>
          </div>
        );
      })}
    </ul>
  );
};

export default EnrolledCoursesWidget;