'use client';

import { Card } from "@tremor/react";
import { useRouter } from "next/navigation";

const UserEnrolledCoursesCard = ({
  courseId,
  courseImage,
  courseName,
  courseLessons,
  courseAssignments,
  courseDuration,
  courseProgress,
}: any) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`/${1234}/dashboard/enrolledCourses/${courseId}`);
  };

  return (
    <Card
      className="flex cursor-pointer flex-col justify-start rounded-xl dark:bg-zinc-900 dark:hover:bg-zinc-800 shadow-xl transition-all duration-300 border dark:border-gray-600 hover:border-none dark:border-opacity-25"
      onClick={onClick}
    >
      <div className="flex justify-start items-center space-x-4">
        <img
          className="h-12 w-12 rounded-md"
          src={courseImage || "/assets/images/images1.jpg"}
          alt="yo"
        />
        <p className=" text-lg line-clamp-2 overflow-ellipsis text-gray-700 dark:text-gray-200 font-semibold ">
          {courseName || "Version Control System with  Git & GitHub"}
        </p>
      </div>

      {/* <div className="mt-4 mb-2 flex justify-between">
        <div className="flex justify-center items-center py-auto">
          <FaPlay size={16} />
          <p className="ml-2 text-xs tracking-tight dark:text-gray-500">
            {courseLessons || 64} lessons
          </p>
        </div>

        <div className="flex justify-center items-center py-auto">
          <MdAssignment size={16} />
          <p className="ml-2 text-xs tracking-tight dark:text-gray-500">
            {courseAssignments || 5} assignments
          </p>
        </div>

        <div className="flex justify-start items-center py-auto">
          <IoIosTimer size={16} />
          <p className="ml-2 text-xs tracking-tight dark:text-gray-500">
            {courseDuration || "8hr 45min"}
          </p>
        </div>
      </div> */}

      <div className="text-sm text-gray-800 dark:text-gray-500 my-1">
        <span className="text-blue-500 dark:text-blue-600">{"70 %"} </span>
        Completed
      </div>
      <progress
        className="progress progress-primary w-full"
        value={courseProgress || "70"}
        max="100"
        color="blue"
      ></progress>
    </Card>
  );
};

export default UserEnrolledCoursesCard;