"use client";

import { Card } from "@tremor/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      className="flex cursor-pointer flex-col justify-start rounded-xl border shadow-xl transition-all duration-300 hover:border-none border-border bg-card hover:bg-muted"
      onClick={onClick}
    >
      <div className="flex items-center justify-start space-x-4">
        <Image
          className="h-12 w-12 rounded-md"
          src={courseImage || "/assets/images/images1.jpg"}
          height={12}
          width={12}
          alt="courseImage..."
        />
        <p className="line-clamp-2 overflow-ellipsis text-lg font-semibold text-muted-foreground">
          {courseName || "Version Control System with  Git & GitHub"}
        </p>
      </div>

      {/* <div className="mt-4 mb-2 flex justify-between">
        <div className="flex justify-center items-center py-auto">
          <FaPlay size={16} />
          <p className="ml-2 text-xs tracking-tight dark:text-muted-foreground">
            {courseLessons || 64} lessons
          </p>
        </div>

        <div className="flex justify-center items-center py-auto">
          <MdAssignment size={16} />
          <p className="ml-2 text-xs tracking-tight dark:text-muted-foreground">
            {courseAssignments || 5} assignments
          </p>
        </div>

        <div className="flex justify-start items-center py-auto">
          <IoIosTimer size={16} />
          <p className="ml-2 text-xs tracking-tight dark:text-muted-foreground">
            {courseDuration || "8hr 45min"}
          </p>
        </div>
      </div> */}

      <div className="my-1 text-sm text-muted-foreground">
        <span className="text-blue-500 dark:text-blue-600">{"70 %"} </span>
        Completed
      </div>
      <progress
        className="progress progress-primary w-full"
        value={courseProgress || "70"}
        max="100"
        color="blue"
      />
    </Card>
  );
};

export default UserEnrolledCoursesCard;