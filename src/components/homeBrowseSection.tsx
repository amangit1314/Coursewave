"use client";

import React from "react";
import Image from "next/image";
import { BsFillBookmarkStarFill } from "react-icons/bs";
import { CiBookmark } from "react-icons/ci";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { course } from "@prisma/client";

const style = { color: "blue", fontSize: "1.5em" };
const starStyle = { color: "yellow" };

const courseCategories = [
  {
    title: "All",
  },
  {
    title: "Programming",
  },
  {
    title: "Management",
  },
  {
    title: "Sales",
  },
  {
    titile: "Data",
  },
];

const courses = [
  {
    courseImage: "/course_illus.png",
    courseId: "course_0xx1",
    isFree: false,
    coursePrice: "₹300",
    courseTitle: "Become React Hero",
  },
  {
    courseImage: "/images1.jpg",
    courseId: "course_0xx2",
    isFree: false,
    coursePrice: "₹200",
    courseTitle: "Full Stack Bootcamp",
  },
  {
    courseImage: "/images2.jpg",
    courseId: "course_0xx3",
    isFree: false,
    coursePrice: "₹270",
    courseTitle: "Git & Github Master Class",
  },
  {
    courseImage: "/images3.jpg",
    courseId: "course_0xx4",
    isFree: false,
    coursePrice: "₹470",
    courseTitle: "API Testing with Postman",
  },
  {
    courseImage: "/nextjs.png",
    courseId: "course_0xx5",
    isFree: false,
    coursePrice: "₹27",
    courseTitle: "Intro to Data Science",
  },
];

const HomeBrowseSection = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className="h-auto mt-[14rem] md:mt-[1rem] mb-2 max-w-7xl place-items-center items-center w-full">
      {/* heading */}
      <p className="text-2xl font-bold text-center">
        Browse Different Course Categories
      </p>

      {/* subtext */}
      <p className="pt-4 text-md opacity-80 text-center">
        Browse different courses according to the selected course <br />{" "}
        categories on <span className="text-blue-500">Coursewave!</span>
      </p>

      {/* course Categories section */}
      <ul className="flex flex-wrap justify-center py-4 text-sm font-medium text-center mx-auto text-gray-500 dark:text-gray-400">
        {courseCategories.map((course, index) => (
          <li key={index} className="mr-2">
            <a
              href="#"
              onClick={() => setActiveTab(index)}
              className={`inline-block px-6 py-2 rounded-full hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white ${
                activeTab === index ? "text-white bg-blue-600" : "text-gray-500"
              }`}
            >
              {course.title}
            </a>
          </li>
        ))}
      </ul>

      {/* courses  section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-y-4 md:gap-x-16 my-6 w-full justify-center mx-auto">
        {courses.map((course, index) => (
          <CourseItem key={index} course={course} />
        ))}
      </div>

      {/* Courses Button */}
      <button className="flex justify-center px-6 mb-16 py-2 bg-blue-500 rounded-full place-items-center mx-auto font-bold text-sm text-white">
        Explore Courses
      </button>
    </div>
  );
};

export default HomeBrowseSection;

type CourseItemProps = {
    course: {
        courseImage: string,
        courseId: string,
        isFree: boolean,
        coursePrice: string,
        courseTitle: string,
  };
};

const CourseItem: React.FC<CourseItemProps> = ({ course }) => {
  const [isBookmarked, setBookmarked] = React.useState(false);
  const router = useRouter();

  const toggleBookmark = () => {
    setBookmarked(!isBookmarked);
  };

  const onViewDetails = () => {
    router.push(`/browseCourses/courseDetails/${course.courseId}`);
  };

  return (
    <div
      key={course.courseId}
      onClick={onViewDetails}
      className={`flex flex-col items-center mx-auto md:mx-0 group cursor-pointer hover:shadow-md rounded-xl w-[15rem] dark:bg-gray-800 p-2.5 transition-colors hover:border hover:border-blue-500 hover:bg-white hover:dark:border-blue-500 `}
    >
      {/* Course Image  and price*/}
      <div className="relative">
        <Image
          className="h-40 w-[15rem] bg-slate-700 rounded-lg relative left-0 right-0"
          src={course.courseImage}
          alt="Next.js Logo"
          width={250}
          height={35}
          style={{
            objectFit: "cover",
          }}
        />
        {/* course price */}
        <Badge className="absolute bottom-2 right-2">
          {course.isFree ? "Free" : course.coursePrice}
        </Badge>
      </div>

      {/* Course classes and duration */}
      <div className="flex w-full justify-between mt-2">
        <p className="text-xs">10 Classes</p>
        <p className="pl-1 text-xs">48 hours</p>
      </div>

      {/* Course Title */}
      <p className="text-md w-full text-start tracking-tight mt-1 mx-3 font-semibold line-clamp-2">
        {course.courseTitle}
      </p>

      {/* instructor(image and name) & bookmark icon */}
      <div className="flex w-full justify-between items-center py-auto  mt-1 mb-1">
        {/* instructor image and name */}
        <div className="flex items-center py-auto">
          <Image
            className="h-8 w-8 rounded-full"
            src="/nextjs.png"
            alt="p"
            height={28}
            width={28}
            content="cover"
          />
          <p className="text-xs text-gray-600 ml-[6px] dark:text-gray-400">
            Terisha Simmons
          </p>
        </div>

        {/* bookmark icon */}
        <div
          className={`h-7 hover:bg-blue-600 w-7 p-1 items-center cursor-pointer flex py-auto justify-center rounded-full ${
            isBookmarked ? "bg-blue-600" : "bg-blue-400"
          }`}
          onClick={toggleBookmark}
        >
          {isBookmarked ? (
            <BsFillBookmarkStarFill size={16} />
          ) : (
            <CiBookmark size={16} style={{ color: "white" }} />
          )}
        </div>
      </div>
    </div>
  );
};
