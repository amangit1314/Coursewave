"use client";

import { IoMdAdd } from "react-icons/io";
import React from "react";
import { DatePickerDemo } from "./_components/date-picker-widget";
import {
  LineChart,
  Flex,
  Switch,
  Badge,
  BadgeDelta,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
  Grid,
  Divider,
} from "@tremor/react";
import { IoMdAddCircleOutline } from "react-icons/io";
import Notifications from "@/components/notification-button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ThemeModeToggle } from "@/components/themeModeToggle";
import { useRouter } from "next/navigation";
import useUserInfo from "@/hooks/use-user-info";
import UserAvatar from "@/components/user-avatar";
import { columns } from "./_components/enrolled-courses-tables/columns";
import { useQuery } from "@tanstack/react-query";
import { Course, User } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { EnrolledCoursesTable } from "./_components/enrolled-courses-tables/enrolled-courses-table";
import { EnrolledCoursesTremorTable } from "./_components/enrolled-courses-tremor-table";

function DashboardPage({
  params,
}: {
  params: {
    userId: string;
  };
}) {
  const userId = params?.userId!;

  const fetchUserEnrolledCourses = async () => {
    const response = await fetch(`/api/profile/${userId}/enrolledCourses`);

    if (!response.ok) {
      console.log("Failed to fetch user enrolled courses ...");
    }

    return await response.json();
  };

  const {
    data: enrolledCourses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: fetchUserEnrolledCourses,
    staleTime: 4,
  });

  // const enrollementsData = [...enrolledCourses?.data];

  return (
    <div className="py-4">
      {/* header */}
      <div className="flex justify-between items-center h-full">
        <p className="text-xl pb-2 font-semibold text-gray-700 dark:text-gray-100">
          Online Learning Dashboard
        </p>

        <DashboardLeftHeader />
      </div>

      {/* other content */}
      <div className="space-y-12">
        {/* line chart for learning activity */}
        {/* <LineChartForLearningActivity /> */}

        {/* Sessions */}
        {/* <div>
          <Divider> Scheduled Sessions </Divider>
          <ScheduledSessions />
        </div> */}

        {/* enrolledCourses */}
        <div className="mb-8">
          <Divider> Enrolled Courses </Divider>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          ) : error ? (
            <div>Error fetching enrolled courses</div>
          ) : (
            <div>
              {enrolledCourses?.data?.length > 0 ? (
                <EnrolledCoursesTremorTable
                  // columns={columns}
                  data={enrolledCourses?.data}
                />
              ) : (
                <div>You haven't enrolled in any courses yet.</div>
              )}
            </div>
          )}
        </div>

        {/* Saved Articles */}

        {/* Learning Goals */}
      </div>
    </div>
  );
}

export default DashboardPage;

type EnrolledCourseProps = {
  enrollmentId: string;
  userId: string;
  courseId: string;
  enrollmentDate: string;
  completionStatus: string;
  user: User;
  course: Course;
};

const EnrolledCoursesWidget = ({enrolledCourses} :{enrolledCourses: EnrolledCourseProps[]}) => {
  return (
    <ul className="space-y-4 rounded-xl px-4 border border-stroke mx-4  ">
      {enrolledCourses.map((enrolledCourse) => {
        return (
          <div
            key={enrolledCourse.enrollmentId}
            className="flex justify-between items-center py-2 text-sm border-b-2"
          >
            <div>{enrolledCourse?.enrollmentId ?? "Course Id Unavailable"}</div>

            <Link href={`/courses/${enrolledCourse?.course?.courseId}`} className="hover:text-blue-500 cursor-pointer transition-all duration-300">
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

//* ---------------------------------------- COMPONENTS -----------------------------------


























































//! ------------------------- Learning Activity Chart -----------------------------------

const chartdata = [
  {
    year: 2023,
    "Courses Students": 2.04,
    "Sessions Students": 1.53,
  },
  {
    year: 2024,
    "Courses Students": 1.06,
    "Sessions Students": 3.58,
  },
  {
    year: 2025,
    "Courses Students": 3.96,
    "Sessions Students": 2.61,
  },
  {
    year: 2026,
    "Courses Students": 1.23,
    "Sessions Students": 1.61,
  },
  {
    year: 2027,
    "Courses Students": 1.88,
    "Sessions Students": 2.67,
  },
];

const valueFormatter = (number: number) =>
  `${new Intl.NumberFormat("us").format(number).toString()}K`;

const LineChartForLearningActivity = () => {
  return (
    <Card className="rounded-md mr-[2rem] my-[1rem]">
      <Title className="font-semibold text-lg dark:text-gray-200">
        Learning Activity
      </Title>
      <LineChart
        data={chartdata}
        index="year"
        categories={["Courses Students", "Sessions Students"]}
        colors={["orange", "teal"]}
        valueFormatter={valueFormatter}
        yAxisWidth={40}
      />
    </Card>
  );
};

//! --------------------------------- Enrolled Courses -----------------------------------

const EnrolledCourses = () => {
  return (
    <div className=" w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="font-semibold text-gray-700 text-lg dark:text-gray-400">
          Enrolled Courses
        </div>

        <p className="text-sm cursor-pointer font-medium hover:text-blue-700 text-blue-500">
          Show All
        </p>
      </div>

      <Grid className="grid grid-cols-2 gap-4">
        <EnrolledCoursesCard />
        <EnrolledCoursesCard />
        <EnrolledCoursesCard />
        <EnrolledCoursesCard />
        <EnrolledCoursesCard />
        <EnrolledCoursesCard />
      </Grid>
    </div>
  );
};

const EnrolledCoursesCard = ({
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

//! ----------------------------------------- Sessions -----------------------------------
function ScheduledSessionCard() {
  return (
    <div className="w-[500px] mx-[2px] border border-stroke border-gray-300 rounded-xl cursor-pointer p-4 flex justify-start  my-4 dark:bg-zinc-950 hover:bg-blue-100 hover:bg-blend-saturation  hover:text-blue-800 dark:hover:text-white transition-all hover:ring-2 hover:ring-blue-600 duration-300">
      <div className={`bg-blue-500 h-15 w-1 rounded-full`}></div>

      <div className="ml-3  mr-1 justify-start items-start py-auto flex flex-col">
        <p className="uppercase   text-xs">Tuesday, jan 3 at 3:40 pm (pt)</p>
        <div className="flex flex-col justify-start">
          <p className="max-w-[169px] w-full text-sm font-medium tracking-tight line-clamp-1">
            One-on-One Session
          </p>
          <p className="text-xs tracking-tighter">40m</p>
        </div>
      </div>

      <div className="flex items-center bg-gray-600 dark:hover:bg-white my-auto h-6 w-[1px] mx-1"></div>

      <div className="flex flex-col justify-start ml-1">
        <p className="  text-xs font-medium">Status</p>
        <div className="flex justify-center mt-[4px] text-xs py-1 px-2 rounded-badge bg-green-200 text-green-950 font-medium">
          confirmed
        </div>
      </div>
    </div>
  );
}

const ScheduledSessions = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="font-semibold text-gray-700 text-lg dark:text-gray-200">
          Scheduled Sessions
        </div>

        <div className="flex justify-center items-center bg-blue-500 text-white hover:bg-blue-700 text-sm cursor-pointer font-medium space-x-1 rounded-md px-4 py-2">
          <IoMdAdd />
          <p>Book a session</p>
        </div>
      </div>

      {/* <Card> */}
      <DateRangeWidget />

      {/* <DatePickerDemo /> */}
      <ScrollArea className="flex p-1 justify-start items-center space-x-2 max-w-7xl w-full">
        <div className="flex space-x-2 max-w-7xl w-full">
          <ScheduledSessionCard />
          <ScheduledSessionCard />
          <ScheduledSessionCard />
          <ScheduledSessionCard />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* </Card> */}
    </div>
  );
};

//! ----------------------------------- Learning Goals -----------------------------------
const LearningGoalCard = () => {
  return <div></div>;
};

const LearningGoals = () => {
  return (
    <div className=" mr-[2rem] w-full">
      <div className="flex justify-between">
        <div className="font-semibold text-lg dark:text-gray-400">
          Course Progress
        </div>
        <div className="flex  justify-center items-center text-blue-500 cursor-pointer font-medium hover:text-blue-700">
          <IoMdAddCircleOutline />
          <p className="text-xs font-medium pl-1">Set Goal</p>
        </div>
      </div>
      <div className="flex flex-col">
        <LearningGoalCard />
        <LearningGoalCard />
        <LearningGoalCard />
      </div>
    </div>
  );
};

//! ----------------------------------------- left header -----------------------------------

const DashboardLeftHeader = () => {
  const user = useUserInfo();
  return (
    <div className="flex justify-end space-x-6">
      {/* image and text */}
      {/* <div className="flex justify-start">
        <img
          className="h-10 w-10 rounded-full"
          src={
            user
              ? user?.user?.profileImageUrl ?? "/assets/images/images1.jpg"
              : "/assets/images/images1.jpg"
          }
          alt="yo"
        />
        <div className="ml-3">
          <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">
            {user ? user?.user?.name ?? "Guest" : "Guest"}
          </p>
          <p className="text-xs text-gray-500">
            {" "}
            {user ? user?.user?.email ?? "guest@gmail.com" : "guest@gmail.com"}
          </p>
        </div>
      </div> */}

      <div className="flex justify-end items-center space-x-2">
        <ThemeModeToggle />
        <Notifications />
        <UserAvatar />
      </div>
    </div>
  );
};

const DateRangeWidget = () => {
  return (
    <div className="flex items-center" data-rangepicker>
      <DatePickerDemo />
      <span className="mx-4 text-gray-500">to</span>
      <DatePickerDemo />
    </div>
  );
};
