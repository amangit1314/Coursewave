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

function DashboardPage() {
  return (
    <div className="flex justify-between p-[2rem] h-full">
      {/* Right Side */}
      <div className="mx-[2rem]">
        <p className="text-xl pb-2 font-semibold">Online Learning Dashboard</p>
        <LineChartForLearningActivity />
        <Card className="flex justify-between">
          <EnrolledCourses />
        </Card>
      </div>

      {/* Left Side */}
      <div className="w-[22rem] mr-[2rem]">
        <DashboardLeftHeader />

        <Divider>Course Progress</Divider>
        <ChartThree />

        <Divider> Scheduled Sessions </Divider>
        <ScheduledSessions />
      </div>
    </div>
  );
}

export default DashboardPage;

//----------------- right side ---------------

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

export const LineChartForLearningActivity = () => {
  return (
    <Card className="rounded-md mr-[2rem] my-[1rem]">
      <Title className="font-semibold text-lg dark:text-gray-400">
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

export const EnrolledCourses = () => {
  return (
    <div className=" w-full">
      <div className="flex justify-between items-center py-auto">
        <div className="font-semibold text-gray-700 text-lg dark:text-gray-400">
          Enrolled Courses
        </div>

        <p className=" text-xs cursor-pointer font-medium hover:text-indigo-700 text-blue-500">
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

export const EnrolledCoursesCard = ({ courseId, courseImage, courseName, courseLessons, courseAssignments, courseDuration, courseProgress }: any) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`${123456}/dashboard/enrolledCourses/${courseId}`);
  }

  return (
    <Card
      className="flex my-[1rem] cursor-pointer flex-col justify-start rounded-xl"
      onClick={onClick}
    >
      <div className="flex justify-start items-center py-auto">
        <img
          className="h-10 w-10 rounded-md"
          src={courseImage || "/assets/images/images1.jpg"}
          alt="yo"
        />
        <p className="ml-2 text-sm line-clamp-2 text-gray-700 dark:text-gray-400 font-semibold ">
          {courseName || "Version Control System with <br /> Git & GitHub"}
        </p>
      </div>

      <div className="mt-4 mb-2 flex justify-between">
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
      </div>

      <div className="flex justify-start items-center py-auto">
        <IoIosTimer size={16} />
        <p className="ml-2 text-xs tracking-tight dark:text-gray-500">
          {courseDuration || '8hr 45min'}
        </p>
      </div>

      <progress
        className="progress progress-primary w-full mt-3"
        value={courseProgress || "70"}
        max="100"
      ></progress>
    </Card>
  );
};

// -------------- left side -------------------

export const NotificationBade = () => {
  return (
    <button
      className="relative  rounded-full  transition duration-150 ease-in-out"
      aria-label="Cart"
    >
      <div className="cursor-pointer rounded-full p-3 text-center items-center hover:bg-slate-50 border bg-transparent dark:hover:border-opacity-100 border-opacity-10 dark:bg-slate-700 dark:border-opacity-10">
        <IoNotificationsOutline size={16} />
      </div>
      <span className="absolute inset-0 object-right-top -mr-6">
        <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold leading-4 bg-blue-500 text-white">
          6
        </div>
      </span>
    </button>
  );
}

export const DashboardLeftHeader = () => {
  return (
    <div className="flex justify-between">
      {/* image and text */}
      <div className="flex justify-center">
        <img
          className="h-10 w-10 rounded-full"
          src="/assets/images/images1.jpg"
          alt="yo"
        />
        <div className="ml-3">
          <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">John Doe</p>
          <p className="text-xs text-gray-500">Student</p>
        </div>
      </div>

      <div className="flex">
        <NotificationBade />
        <div className="mx-1"></div>
        <ThemeModeToggle />
      </div>
    </div>
  );
}

export const DateRangeWidget = () => {
  return (
    <div className="flex items-center" data-rangepicker>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
        </div>
        <input
          type="text"
          name="start"
          placeholder="start date"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <span className="mx-4 text-gray-500">to</span>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
        </div>
        <input
          type="text"
          name="end"
          placeholder="end date"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </div>
  );
}

export function ScheduledSessionCard() {
  return (
    <Card className="rounded-xl cursor-pointer p-4 flex justify-start  my-4">
      <div className={`bg-purple-500 h-15 w-1 rounded-full`}></div>

      <div className="ml-3  mr-1 justify-start items-start py-auto flex flex-col">
        <p className="uppercase text-gray-500 text-xs">
          Tuesday, jan 3 at 3:40 pm (pt)
        </p>
        <div className="flex flex-col justify-start">
          <p className="text-sm text-gray-700 dark:text-white font-medium tracking-tight line-clamp-1">
            One-on-One Session
          </p>
          <p className="text-xs text-gray-500 tracking-tighter">40m</p>

          <div className="flex mt-1">
            {/* <Badge size="xs" className="text-xs">
              modify
            </Badge> */}
          </div>
        </div>
        {/* 
        <div className="flex">
          <Image
            className="h-6 w-6 rounded-full"
            src="/nextjs.png"
            alt="p"
            height={24}
            width={24}
            content="cover"
          />
          <p className="text-sm text-gray-600 ml-2 dark:text-gray-400">
            Terisha Simmons
          </p>
        </div> */}
      </div>

      <div className="flex items-center bg-gray-600 my-auto h-12 w-[1px] mx-1"></div>

      <div className="flex flex-col justify-start ml-1">
        <p className="text-gray-500 text-xs font-medium">Status</p>
        {/* <Badge size="xs" className="mt-[4px]" color="green">
          confirmed
        </Badge> */}
        <div className="flex justify-center mt-[4px] text-xs py-1 px-2 rounded-badge bg-green-300 text-green-900 font-medium">
          confirmed
        </div>
      </div>
    </Card>
  );
}

export const ScheduledSessions = () => {
  return (
    <div>
      <div className="flex mb-4 justify-between items-center py-auto">
        <div className="font-semibold text-lg text-gray-700 dark:text-gray-400">
          Scheduled Sessions
        </div>

        <p className=" text-xs cursor-pointer font-medium hover:text-indigo-700 text-blue-500">
          Show All
        </p>
      </div>

      <Card>
        <DateRangeWidget />
        <div className="flex flex-col">
          <ScheduledSessionCard />
          <ScheduledSessionCard />
          <ScheduledSessionCard />
          <ScheduledSessionCard />
        </div>
      </Card>
    </div>
  );
}

export const LearningGoalCard = () => {
  return (
    <div>

    </div>
  );
};

export const LearningGoals = () => {
  return (
    <div className=" mr-[2rem] w-full">
      <div className="flex justify-between">
        <div className="font-semibold text-lg dark:text-gray-400">
          Course Progress
        </div>
        <div className="flex  justify-center items-center text-blue-500 cursor-pointer font-medium hover:text-indigo-700">
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
