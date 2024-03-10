/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import BrowseEnrolledCoursesSection from "./_components/browse-enrolled-courses-section";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiRadioButtonLine } from "react-icons/ri";
import { BsPersonVideo2 } from "react-icons/bs";
import { TbMoneybag } from "react-icons/tb";
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
import { AiOutlineDollarCircle } from "react-icons/ai";
import { FaSort, FaPlay } from "react-icons/fa";
import { IoIosTimer, IoMdAddCircleOutline } from "react-icons/io";
import { ThemeModeToggle } from "@/components/themeModeToggle";
import { MdAssignment } from "react-icons/md";
import { UpcommingSessionsCard } from "@/app/(browseSessions)/browseSessions/_components/upcomming-session-card";
import Image from "next/image";
import ChartFour from "@/components/Charts/ChartFour";
import ChartThree from "@/app/(instructor)/instructor/[id]/analytics/_components/apex-chart";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EnrolledCoursesTable } from "./_components/enrolled-courses-table";
import { DatePickerDemo } from "./_components/date-picker-widget";
import Notifications from "@/components/notification-button";
import useUserInfo from "@/lib/hooks/use-user-info";
import UserAvatar from "@/components/user-avatar";

function DashboardPage() {
  return (
    <div className="pb-16">
      <div className="flex justify-between items-center h-full pt-4">
        {/* Right Side */}
        {/* <div className="mr-[2rem]">
          <p className="text-xl pb-2 font-semibold text-gray-700 dark:text-gray-100">
            Online Learning Dashboard
          </p>

          <LineChartForLearningActivity />
        </div> */}

        <p className="text-xl pb-2 font-semibold text-gray-700 dark:text-gray-100">
          Online Learning Dashboard
        </p>

        <DashboardLeftHeader />

        {/* Left Side */}
        {/* <div className="w-[22rem] mr-[2rem]">
          <DashboardLeftHeader />

          <Divider>Course Progress</Divider>
          <ChartThree />
        </div> */}
      </div>
      <LineChartForLearningActivity />
      <Divider> Scheduled Sessions </Divider>
      <ScheduledSessions />
      {/* <Card className="flex justify-between mt-6"> */}
      <Divider className="mt-8"> Enrolled Courses </Divider>
      <EnrolledCoursesTable />
      {/* <EnrolledCourses /> */}
      {/* </Card> */}
    </div>
  );
}

export default DashboardPage;

//! ----------------- right side ---------------

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
  //...
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

//! -------------- left side -------------------

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

// sessions
function ScheduledSessionCard() {
  return (
    <div className="w-[500px] mx-[2px] border border-none rounded-xl cursor-pointer p-4 flex justify-start  my-4 bg-zinc-950 hover:bg-blue-600 dark:hover:text-white transition-all duration-300">
      <div className={`bg-blue-500 h-15 w-1 rounded-full`}></div>

      <div className="ml-3  mr-1 justify-start items-start py-auto flex flex-col">
        <p className="uppercase   text-xs">
          Tuesday, jan 3 at 3:40 pm (pt)
        </p>
        <div className="flex flex-col justify-start">
          <p className="max-w-[169px] w-full text-sm text-gray-700 dark:text-white font-medium tracking-tight line-clamp-1">
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

        <p className="text-sm cursor-pointer font-medium hover:text-blue-700 text-blue-500">
          Show All
        </p>
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

// others
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
