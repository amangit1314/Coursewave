import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export const CourseCard = ({ course }: { course: Course }) => {
  const router = useRouter();

  const onViewDetails = () => {
    router.push(`/courses/${course.courseId}`);
  };

  return (
    <Link
      href={`/courses/${course.courseId}`}
      key={course.courseId}
      onClick={onViewDetails}
      className={`border-stroke group h-full max-h-[13rem] w-full cursor-pointer rounded-3xl border transition-colors hover:border-zinc-700 hover:bg-white dark:border-none dark:bg-neutral-800/30 hover:dark:border-neutral-700 dark:hover:bg-zinc-800 md:max-w-[15rem]`}
    >
      <div className="relative">
        <Image
          className="relative left-0 right-0 h-[8.5rem] w-full rounded-t-3xl bg-slate-700 object-cover md:max-w-[15rem]"
          src={course.courseImage ?? "./assets/images/android-jetpack.jpg"}
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
              {course.avgStarRatings ? course.avgStarRatings.toFixed(1) : 5.0}
            </p>
          </div>
          <Badge className="dark:bg-zinc-900 dark:text-white">
            {course.isFree ? (
              "Free"
            ) : (
              <div className="flex items-center justify-start">
                <span className="text-sm font-semibold text-yellow-400">$</span>
                <p className="text-xs font-medium">{course.coursePrice}</p>
              </div>
            )}
          </Badge>
        </div>
      </div>

      <div className="p-2.5">
        <p className="text-md mr-3 mt-1 line-clamp-1 font-semibold tracking-tight text-[#333333] dark:text-white">
          {course.courseTitle ? course.courseTitle : "Aman Soni"}
        </p>

        <div className="flex items-center justify-between">
          <div className="py-auto flex items-center">
            <div className="flex items-center justify-start space-x-1">
              <p className="text-xs tracking-tight text-gray-600 dark:text-gray-400">
                By
              </p>
              <p className="text-xs font-medium tracking-tight text-gray-600 hover:underline dark:text-gray-400">
                {course.instructorName ? course.instructorName : "Aman Soni"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
