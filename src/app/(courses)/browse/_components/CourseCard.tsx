// "use client";

// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { FaStar } from "react-icons/fa";
// import { Course } from "@/types/course";
// import { useRouter } from "next/navigation";
// import { Badge } from "@/components/ui/badge";
// import { Poppins } from "next/font/google";

// const poppins = Poppins({
//   weight: ["400", "500", "600", "700", "800", "900"],
//   subsets: ["latin"],
// });

// export const CourseCard = ({ course }: { course: Course }) => {
//   const router = useRouter();

//   const onViewDetails = () => {
//     router.push(`/courses/${course.id}`);
//   };

//   return (
//     <div
//       className={
//         `group h-full w-full cursor-pointer rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.025] hover:border-blue-500 dark:hover:border-blue-400  md:max-w-[15rem]`}
//     >
//       <Link
//         href={`/courses/${course.id}`}
//         key={course.id}
//         onClick={onViewDetails}
//         className={poppins.className}
//       >
//         <div className="relative">
//           <Image
//             className="relative left-0 right-0 h-[8.5rem] w-full rounded-t-3xl bg-slate-700 object-cover md:max-w-[15rem]"
//             src={course.imageUrl ?? "/assets/images/cover/cover-01.png"}
//             alt={course.title || "Course image"}
//             width={250}
//             height={35}
//             style={{ objectFit: "cover" }}
//           />

//           <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between px-2 md:max-w-[15rem]">
//             <Badge className="flex flex-row items-center gap-1 rounded-full border-none bg-yellow-400/90 px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm dark:bg-yellow-500/90 dark:text-zinc-900">
//               <FaStar className="text-yellow-600 dark:text-yellow-700" />
//               <span>{course.averageRating ? course.averageRating.toFixed(1) : 5.0}</span>
//             </Badge>
//             <Badge className={`rounded-full py-1 text-xs font-semibold ${course.isFree ? "bg-green-500/90 text-white" : "bg-blue-600/90 text-white"}`}>
//               {course.isFree ? (
//                 "Free"
//               ) : (
//                 <span>${course.price}</span>
//               )}
//             </Badge>
//           </div>
//         </div>

//         <div className="p-4">
//           <p className="text-base font-bold tracking-tight text-zinc-900 dark:text-white line-clamp-1 mb-1">
//             {course.title ? course.title : "Course Title"}
//           </p>

//           <div className="flex items-center gap-2">
//             <span className="text-xs text-gray-500 dark:text-gray-400">By</span>
//             <span className="text-xs font-medium text-blue-700 dark:text-blue-300 line-clamp-1">
//               {course.instructor?.user?.name ? course.instructor.user.name : "Instructor"}
//             </span>
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// };

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { FiHeart, FiHeart as FiHeartFilled } from "react-icons/fi";
import { Course } from "@/types/course";
import { Badge } from "@/components/ui/badge";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { IoMdHeart } from "react-icons/io";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const CourseCard = ({ course }: { course: Course }) => {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((prev) => !prev);
    // TODO: Hook this to a wishlist system
  };

  return (
    <div
      className={cn(
        "group relative h-full w-full cursor-pointer overflow-hidden rounded-3xl border bg-white dark:bg-neutral-900 shadow-sm transition-all duration-200 hover:shadow-xl hover:border-gray-600 dark:hover:border-gray-400",
        "border-zinc-200 dark:border-zinc-800 md:max-w-[17rem]"
      )}
    >
      <Link href={`/courses/${course.id}`} className={poppins.className}>
        {/* Image Wrapper */}
        <div className="relative w-full h-[9.5rem] overflow-hidden rounded-t-3xl">
          <Image
            src={course.imageUrl ?? "/assets/images/cover/cover-01.png"}
            alt={course.title || "Course image"}
            fill
            className="object-cover object-center"
          />

          {/* Wishlist */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 left-2 z-10 rounded-full bg-white/90 p-2 text-zinc-800 shadow-md hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black outline-transparent outline-0 ring-0 ring-transparent"
          >
            {wishlisted ? (
              <IoMdHeart className="text-red-500" />
            ) : (
              <FiHeart />
            )}
          </button>
        </div>

        {/* Card Body */}
        <div className="flex flex-col justify-between p-4">
          {/* Title */}
          <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white line-clamp-2">
            {course.title || "Course Title"}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-1 text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">By</span>
            <span className="font-medium text-blue-700 dark:text-blue-300 line-clamp-1">
              {course.instructor?.user?.name ?? "Instructor"}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 mt-2">
            <Badge className="flex items-center gap-1 rounded-full border-none bg-yellow-400/90 px-3 py-1 text-xs font-semibold text-zinc-900 dark:bg-yellow-500/90">
              <FaStar className="text-yellow-600 dark:text-yellow-700" />
              <span>{course.averageRating?.toFixed(1) ?? "5.0"}</span>
            </Badge>
            <Badge
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                course.isFree
                  ? "bg-green-500/90 text-white"
                  : "bg-blue-600/90 text-white"
              )}
            >
              {course.isFree ? "Free" : `$${course.price}`}
            </Badge>
          </div>
        </div>
      </Link>
    </div>
  );
};
