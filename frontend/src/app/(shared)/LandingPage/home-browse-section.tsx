"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
// import { Badge } from "../ui/badge";
import { Course } from "@prisma/client";
import { FaStar } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { IoArrowForwardCircle } from "react-icons/io5";
import { sampleCourseCategories } from "@/lib/mockData";
import { getHomeStats } from "@/app/_actions/get-home-stats";
import { Badge } from "@/components/ui/badge";

const HomeBrowseSection = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = React.useState<Course[]>([]);

  React.useEffect(() => {
    const fetchStats = async () => {
      const { courses } = await getHomeStats();
      setCourses(courses);
      setFilteredCourses(courses.slice(0, 8));
    };

    fetchStats();
  }, []);

  React.useEffect(() => {
    if (activeTab === 0) {
      setFilteredCourses(courses.slice(0, 8));
    } else {
      const category = sampleCourseCategories[activeTab].title;
      const filtered = courses.filter((course) =>
        course.courseCategories?.includes(category),
      );
      setFilteredCourses(filtered.slice(0, 8));
    }
  }, [activeTab, courses]);

  return (
    <div className="mb-2 mt-[14rem] h-auto min-h-screen w-full max-w-7xl place-items-center items-center overflow-x-hidden md:mt-[1rem]">
      {/* heading */}
      <p className="text-center text-2xl font-bold text-zinc-800 dark:text-white">
        Browse Different Course Categories
      </p>

      {/* subtext */}
      <p className="text-md pt-4 text-center text-[#333333] dark:text-gray-200">
        Browse different courses according to the selected course <br />{" "}
        categories on <span className="text-blue-500">Coursewave!</span>
      </p>

      {/* course Categories */}
      <ul className="mx-auto flex flex-wrap justify-center py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
        {sampleCourseCategories.map((category, index) => (
          <li key={index} className="mr-2">
            <a
              href="#"
              onClick={() => setActiveTab(index)}
              className={`inline-block rounded-full px-6 py-2 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white ${
                activeTab === index ? "bg-blue-600 text-white" : "text-gray-500"
              }`}
            >
              {category.title}
            </a>
          </li>
        ))}
      </ul>

      {/* filtered courses */}
      <div className="mx-auto my-6 grid w-9/12 grid-cols-1 justify-center gap-4 md:gap-y-4 lg:grid-cols-4">
        {filteredCourses.map((course, index) => (
          <HomeBrowseSectionCourseCard
            key={index}
            courseId={course.courseId}
            courseTitle={course.courseTitle}
            courseImage={course.courseImage ?? "./assets/images/images1.jpg"}
            avgStarRatings={course.avgStarRatings!}
            coursePrice={course.coursePrice!}
            instructorName={course.instructorName!}
          />
        ))}
      </div>

      {/* Explore more button */}
      <Link
        href={"/browseCourses"}
        className="group mx-auto mt-4 flex items-center justify-center gap-2 transition-all duration-300"
      >
        <button className="group flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 font-semibold tracking-tight text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-sky-400">
          Explore
          <IoArrowForwardCircle className="group-hover:anim hidden text-white transition-all duration-300 group-hover:flex group-hover:animate-pulse" />
        </button>
      </Link>
    </div>
  );
};

export default HomeBrowseSection;

// --------------------------------- course card ----------------------------------

type CourseCardProps = {
  courseId: string;
  courseTitle: string;
  courseImage: string;
  avgStarRatings: number;
  coursePrice: string;
  instructorName: string;
};

export const HomeBrowseSectionCourseCard = ({
  courseId,
  courseTitle,
  courseImage,
  avgStarRatings,
  coursePrice,
  instructorName,
}: CourseCardProps) => {
  const router = useRouter();

  const onViewDetails = () => {
    router.push(`/courses/${courseId}`);
  };

  return (
    <Link
      href={`/courses/${courseId}`}
      key={courseId}
      onClick={onViewDetails}
      className={`border-stroke group h-full max-h-[13rem] w-full cursor-pointer rounded-3xl border transition-colors hover:border-zinc-700 hover:bg-white dark:border-none dark:bg-neutral-800/30 hover:dark:border-neutral-700 dark:hover:bg-zinc-800 md:max-w-[15rem]`}
    >
      {/* Course Image */}
      <div className="relative">
        <Image
          className="relative left-0 right-0 h-full max-h-[8.5rem] w-full rounded-t-3xl bg-slate-700 md:max-w-[15rem]"
          src={courseImage}
          alt="Next.js Logo"
          width={250}
          height={35}
          style={{
            objectFit: "cover",
          }}
        />

        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between px-2 md:w-[14rem]">
          <div className="item-center border-stroke dark:border-stroke flex flex-row justify-center space-x-[2px] rounded-badge border bg-zinc-900 px-2 py-1 text-xs text-white dark:border">
            <FaStar className="mt-[1px] text-yellow-400" />
            <p className="font-medium">
              {avgStarRatings ? avgStarRatings.toFixed(1) : 5.0}
            </p>
          </div>
          <Badge className="dark:bg-zinc-900 dark:text-white">
            {!coursePrice ? (
              "Free"
            ) : (
              <div className="flex items-center justify-start">
                <span className="text-sm font-semibold text-yellow-400">$</span>
                <p className="text-xs font-medium">{coursePrice}</p>
              </div>
            )}
          </Badge>
        </div>
      </div>

      <div className="p-2.5">
        {/* Course Title */}
        <p className="text-md mr-3 mt-1 line-clamp-1 font-semibold tracking-tight text-[#333333] dark:text-white">
          {courseTitle ? courseTitle : "Aman Soni"}
        </p>

        <div className="flex items-center justify-between">
          <div className="py-auto flex items-center">
            <div className="flex items-center justify-start space-x-1">
              <p className="text-xs tracking-tight text-gray-600 dark:text-gray-400">
                By
              </p>
              <p className="text-xs font-medium tracking-tight text-gray-600 hover:underline dark:text-gray-400">
                {instructorName ? instructorName : "Aman Soni"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
