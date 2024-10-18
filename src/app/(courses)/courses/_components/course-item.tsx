import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Course } from "@prisma/client";
import { AiFillStar } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { BsFillBookmarkStarFill } from "react-icons/bs";

type CourseItemProps = {
  course: Course;
};

const starStyle = { color: "yellow" };

export const CourseItem: React.FC<CourseItemProps> = ({ course }) => {
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
    <div
      key={course.courseId}
      onClick={onViewDetails}
      className={`group w-auto max-w-[15rem] cursor-pointer rounded-2xl p-2.5 transition-colors hover:border-blue-500 hover:bg-white dark:bg-neutral-800/30 hover:dark:border-neutral-700 dark:hover:bg-zinc-800`}
    >
      {/* Course Image */}
      <div className="relative">
        <Image
          className="relative left-0 right-0 h-40 w-[15rem] rounded-xl bg-slate-700"
          src={course.courseImage ?? "./assets/images/images1.jpg"}
          alt="Next.js Logo"
          width={250}
          height={35}
          style={{
            objectFit: "cover",
          }}
        />
        <Badge className="absolute bottom-2 right-2 dark:bg-blue-600 dark:text-white">
          {course.isFree ? "Free" : `$${course.coursePrice}`}
        </Badge>
      </div>

      {/* <p className="mt-2 border-blue-500 bg-transparent text-xs font-normal text-blue-500">
        {course.courseCategories ? course.courseCategories[0] : "Default"}
      </p> */}

      <div className="mt-2 flex justify-between">
        <p className="text-xs">10 Classes</p>
        <p className="pl-1 text-xs">48 hours</p>
      </div>

      {/* Course Title */}
      <p className="text-md mr-3 mt-1 line-clamp-2 font-semibold tracking-tight text-[#333333] dark:text-white">
        {course.courseTitle ? course.courseTitle : "Aman Soni"}
      </p>

      <div className="flex items-center justify-between">
        <div className="py-auto flex items-center">
          <div className="flex items-center justify-start">
            <p className="text-xs tracking-tight text-gray-600 dark:text-gray-400">
              By
            </p>
            <p className="ml-[4px] text-xs font-medium tracking-tight text-gray-600 hover:underline dark:text-gray-400">
              {course.instructorName ? course.instructorName : "Aman Soni"}
            </p>
          </div>
        </div>

        {/* bookmark icon */}
        <div
          className={`py-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-full p-1 hover:bg-blue-600 ${
            isBookmarked ? "bg-blue-600" : "bg-blue-400"
          }`}
          onClick={toggleBookmark}
        >
          {isBookmarked ? (
            <BsFillBookmarkStarFill size={12} className="text-white" />
          ) : (
            <CiBookmark size={16} className="text-white" />
          )}
        </div>
      </div>
    </div>
  );
};
