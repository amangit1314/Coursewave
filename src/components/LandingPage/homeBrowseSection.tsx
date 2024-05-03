"use client";

import React from "react";
import Image from "next/image";
import { BsFillBookmarkStarFill } from "react-icons/bs";
import { CiBookmark } from "react-icons/ci";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa6";
import Link from "next/link";

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
    courseImage: "assets/illustrations/course_illus.png",
    courseId: "course_0xx1",
    isFree: false,
    coursePrice: "₹300",
    courseTitle: "Become React Hero",
    avgStarRatings: 4.8,
    instructorName: "Aman Soni",
  },
  {
    courseImage: "assets/images/images1.jpg",
    courseId: "course_0xx2",
    isFree: false,
    coursePrice: "₹200",
    courseTitle: "Full Stack Bootcamp",
    avgStarRatings: 4.8,
    instructorName: "Aman Soni",
  },
  {
    courseImage: "assets/images/images2.jpg",
    courseId: "course_0xx3",
    isFree: false,
    coursePrice: "₹270",
    courseTitle: "Git & Github Master Class",
    avgStarRatings: 4.8,
    instructorName: "Aman Soni",
  },
  {
    courseImage: "assets/images/images3.jpg",
    courseId: "course_0xx4",
    isFree: false,
    coursePrice: "₹470",
    courseTitle: "API Testing with Postman",
    avgStarRatings: 4.8,
    instructorName: "Aman Soni",
  },
  {
    courseImage: "/nextjs.png",
    courseId: "course_0xx5",
    isFree: false,
    coursePrice: "₹27",
    courseTitle: "Intro to Data Science",
    avgStarRatings: 4.8,
    instructorName: "Aman Soni",
  },
];

const HomeBrowseSection = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className="min-h-screen h-auto mt-[14rem] md:mt-[1rem] mb-2 max-w-7xl place-items-center items-center w-full overflow-x-hidden">
      {/* heading */}
      <p className="text-2xl font-bold text-center text-[#333333] dark:text-white">
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-y-4 my-6 w-9/12 justify-center mx-auto">
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            courseId={course.courseId}
            courseTitle={course.courseTitle}
            courseImage={course.courseImage ?? "./assets/images/images1.jpg"}
            avgStarRatings={course.avgStarRatings}
            coursePrice={course.coursePrice}
            instructorName={course.instructorName}
          />
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
    courseImage: string;
    courseId: string;
    isFree: boolean;
    coursePrice: string;
    courseTitle: string;
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
    // hover:border hover:border-blue-500 hover:bg-white hover:dark:border-blue-500

    <div
      key={course.courseId}
      onClick={onViewDetails}
      className={`flex flex-col items-center mx-auto md:mx-0 group cursor-pointer hover:shadow-md rounded-xl max-w-[15rem] w-auto dark:bg-gray-800 p-2.5 transition-colors  `}
    >
      {/* Course Image  and price*/}
      <div className="relative">
        <Image
          className="h-40 w-[15rem] bg-slate-700 rounded-lg relative left-0 right-0"
          src={course.courseImage ?? "./assets/images/images1.jpg"}
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
        <p className="text-xs tracking-tight">10 Classes</p>
        <p className="pl-1 text-xs tracking-tight">48 hours</p>
      </div>

      {/* Course Title */}
      <p className="text-md w-full text-start tracking-tight mt-1 mx-3 font-semibold line-clamp-2">
        {course.courseTitle}
      </p>

      {/* instructor(image and name) & bookmark icon */}
      <div className="flex w-full justify-between items-center py-auto  mt-1 mb-1">
        {/* instructor image and name */}
        <div className="flex items-center space-x-1 py-auto">
          {/* <Image
            className="h-8 w-8 rounded-full"
            src="/nextjs.png"
            alt="p"
            height={28}
            width={28}
            content="cover"
          /> */}
          <p className="text-xs text-gray-600 tracking-tight dark:text-gray-400">
            By
          </p>
          <p className="text-xs text-gray-600 tracking-tight hover:underline dark:text-gray-400">
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

type CourseCardProps = {
  courseId: string;
  courseTitle: string;
  courseImage: string;
  avgStarRatings: number;
  coursePrice: string;
  instructorName: string;
};

export const CourseCard = ({
  courseId,
  courseTitle,
  courseImage,
  avgStarRatings,
  coursePrice,
  instructorName,
}: CourseCardProps) => {
  // const router = useRouter();

  const onViewDetails = () => {
    // router.push(`/courses/${courseId}`);
  };

  return (
    <Link
      // href={`/courses/${courseId}`}
      href={""}
      key={courseId}
      onClick={onViewDetails}
      className={`group cursor-pointer border border-stroke hover:border-zinc-700 dark:border-none rounded-3xl max-h-[13rem] h-full md:max-w-[15rem] w-full dark:hover:bg-zinc-800 transition-colors  hover:bg-white hover:dark:border-neutral-700 dark:bg-neutral-800/30`}
    >
      {/* Course Image */}
      <div className="relative">
        <Image
          className="max-h-[8.5rem] h-full md:max-w-[15rem] w-full bg-slate-700 rounded-t-3xl relative left-0 right-0"
          src={courseImage}
          alt="Next.js Logo"
          width={250}
          height={35}
          style={{
            objectFit: "cover",
          }}
        />

        <div className="flex justify-between items-center absolute bottom-2 right-0 left-0 md:w-[14rem] px-2">
          <div className="flex flex-row justify-center item-center rounded-badge text-xs px-2 py-1 border border-stroke bg-zinc-900 text-white dark:border dark:border-stroke space-x-[2px]">
            <FaStar className="text-yellow-400 mt-[1px]" />
            <p className="font-medium">
              {avgStarRatings ? avgStarRatings.toFixed(1) : 5.0}
            </p>
          </div>
          <Badge className="dark:bg-zinc-900 dark:text-white">
            {!coursePrice ? (
              "Free"
            ) : (
              <div className="flex justify-start items-center">
                <span className="font-semibold text-yellow-400 text-sm">$</span>
                <p className="text-xs font-medium">{coursePrice}</p>
              </div>
            )}
          </Badge>
        </div>
      </div>

      <div className="p-2.5">
        {/* Course Title */}
        <p className="text-md text-[#333333] dark:text-white tracking-tight mt-1 mr-3 font-semibold line-clamp-1">
          {courseTitle ? courseTitle : "Aman Soni"}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center py-auto">
            <div className="flex justify-start items-center space-x-1">
              <p className="text-xs text-gray-600 tracking-tight dark:text-gray-400">
                By
              </p>
              <p className="text-xs font-medium hover:underline text-gray-600  tracking-tight dark:text-gray-400">
                {instructorName ? instructorName : "Aman Soni"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
