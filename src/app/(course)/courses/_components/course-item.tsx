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
      className={`group cursor-pointer rounded-2xl max-w-[15rem] w-auto dark:hover:bg-zinc-800 p-2.5 transition-colors hover:border-blue-500 hover:bg-white hover:dark:border-neutral-700 dark:bg-neutral-800/30`}
    >
      {/* Course Image */}
      <div className="relative">
        <Image
          className="h-40 w-[15rem] bg-slate-700 rounded-xl relative left-0 right-0"
          src={course.courseImage}
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

      {/* <p
                className='mt-2 text-xs bg-transparent text-blue-500 font-normal border-blue-500'>{course.courseCategories ? course.courseCategories[0] : 'Default'}
            </p> */}

      <div className="flex justify-between mt-2">
        <p className="text-xs">10 Classes</p>
        <p className="pl-1 text-xs">48 hours</p>
      </div>

      {/* Course Title */}
      <p className="text-md text-[#333333] dark:text-white tracking-tight mt-1 mr-3 font-semibold line-clamp-2">
        {course.courseTitle ? course.courseTitle : "Aman Soni"}
      </p>

      <div className="flex justify-between items-center">
        <div className="flex items-center py-auto">
          <div className="flex justify-start items-center">
            <p className="text-xs text-gray-600 tracking-tight dark:text-gray-400">
              By
            </p>
            <p className="text-xs font-medium hover:underline text-gray-600 ml-[4px] tracking-tight dark:text-gray-400">
              {course.instructorName ? course.instructorName : "Aman Soni"}
            </p>
          </div>
        </div>

        {/* bookmark icon */}
        <div
          className={`h-7 hover:bg-blue-600 w-7 p-1 items-center cursor-pointer flex py-auto justify-center rounded-full ${
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
