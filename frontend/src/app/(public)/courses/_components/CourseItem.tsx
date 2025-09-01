import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course";
import { AiFillStar } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { BsFillBookmarkStarFill } from "react-icons/bs";

interface CourseItemProps {
  course: Course;
}

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
    router.push(`/courses/${course.id}`);
  };

  return (
    <div
      key={course.id}
      onClick={onViewDetails}
      className={`group w-auto max-w-[15rem] cursor-pointer rounded-2xl p-2.5 transition-colors hover:border-blue-500 hover:bg-white dark:bg-neutral-800/30 hover:dark:border-neutral-700 dark:hover:bg-zinc-800`}
    >
      {/* Course Image */}
      <div className="relative">
        <Image
          className="relative left-0 right-0 h-40 w-[15rem] rounded-xl bg-slate-700"
          src={course.imageUrl ?? "./assets/images/images1.jpg"}
          alt="Next.js Logo"
          width={250}
          height={35}
          style={{
            objectFit: "cover",
          }}
        />
        <Badge className="absolute bottom-2 right-2 dark:bg-blue-600 dark:text-white">
          {course.price === "0" ? "Free" : `$${course.price}`}
        </Badge>
      </div>

      {/* <p className="mt-2 border-blue-500 bg-transparent text-xs font-normal text-blue-500">
        {course.categories ? course.categories[0]?.name : "Default"}
      </p> */}

      {/* <div className="mt-2 flex justify-between">
        <p className="text-xs">{course.totalLessons} Classes</p>
        <p className="pl-1 text-xs">{Math.floor(course.durationMinutes / 60)} hours</p>
      </div> */}

      {/* Course Title */}
      <p className="text-md mr-3 mt-1 line-clamp-2 font-semibold tracking-tight text-[#333333] dark:text-white">
        {course.title ? course.title : "Course Title"}
      </p>

      {/* Course Instructor */}
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {course.instructor?.user?.name ? course.instructor.user.name : "Instructor"}
      </p>

      {/* Course Rating */}
      <div className="mt-2 flex items-center gap-1">
        <span style={starStyle}>★</span>
        <span className="text-xs">{course.averageRating ? course.averageRating.toFixed(1) : 4.9}</span>
        <span className="text-xs text-gray-500">({noOfCourseReviews})</span>
      </div>

      {/* Course Price */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {course.price === "0" ? "Free" : `$${course.price}`}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark();
          }}
          className="text-gray-400 hover:text-yellow-500"
        >
          {isBookmarked ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
};
