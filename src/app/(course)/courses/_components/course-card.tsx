import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type CourseCardProps = {
  course: Course;
};

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [isBookmarked, setBookmarked] = React.useState(false);
  const [courseRating, setCourseRating] = React.useState(4.95);
  const [noOfCourseReviews, setNoOfCourseReviews] = React.useState(25);

  const router = useRouter();

  const toggleBookmark = () => {
    setBookmarked(!isBookmarked);
  };

  const onViewDetails = () => {
    router.push(`/courses/${course.courseId}`);
  };

  return (
    <Link
      href={`/courses/${course.courseId}`}
      key={course.courseId}
      onClick={onViewDetails}
      className={`group cursor-pointer border border-stroke hover:border-zinc-700 dark:border-none rounded-3xl max-h-[13rem] h-full md:max-w-[15rem] w-full dark:hover:bg-zinc-800 transition-colors  hover:bg-white hover:dark:border-neutral-700 dark:bg-neutral-800/30`}
    >
      {/* Course Image */}
      <div className="relative">
        <Image
          className="max-h-[8.5rem] h-full md:max-w-[15rem] w-full bg-slate-700 rounded-t-3xl relative left-0 right-0"
          src={course.courseImage ?? './assets/images/android-jetpack.jpg'}
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
              {course.avgStarRatings ? course.avgStarRatings.toFixed(1) : 5.0}
            </p>
          </div>
          <Badge className="dark:bg-zinc-900 dark:text-white">
            {course.isFree ? (
              "Free"
            ) : (
              <div className="flex justify-start items-center">
                <span className="font-semibold text-yellow-400 text-sm">$</span>
                <p className="text-xs font-medium">{course.coursePrice}</p>
              </div>
            )}
          </Badge>
        </div>
      </div>

      <div className="p-2.5">
        {/* Course Title */}
        <p className="text-md text-[#333333] dark:text-white tracking-tight mt-1 mr-3 font-semibold line-clamp-1">
          {course.courseTitle ? course.courseTitle : "Aman Soni"}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center py-auto">
            <div className="flex justify-start items-center space-x-1">
              <p className="text-xs text-gray-600 tracking-tight dark:text-gray-400">
                By
              </p>
              <p className="text-xs font-medium hover:underline text-gray-600  tracking-tight dark:text-gray-400">
                {course.instructorName ? course.instructorName : "Aman Soni"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
