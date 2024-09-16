"use client";

import Image from "next/image";
import { Course } from "@prisma/client";
import React, { useEffect } from "react";
import "swiper/css";
import { useInstructorInfo } from "@/hooks/useInstructorInfo";
import { Separator } from "@/components/ui/separator";
import { Callout } from "@tremor/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useInstructorStore } from "@/zustand/instructorStore";

//* WAY 1
// export const InstructorCard = ({ instructorId }: { instructorId: string }) => {
//   console.log(`Instructor id in the instructor-info.tsx: ${instructorId} `);

//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState<String | null>(null);
//   const [instructorCreatedCourses, setInstructorCreatedCourses] =
//     React.useState<Course[]>([]);

//   // Access instructor data from the store
//   const { fetchInstructorById, instructor, loadingState } =
//     useInstructorStore();

//   // Fetch instructor data using the store
//   useEffect(() => {
//     if (instructorId) {
//       fetchInstructorById(instructorId);
//     }
//   }, [instructorId, fetchInstructorById]);

//   useEffect(() => {
//     const fetchInstructorCreatedCourses = async () => {
//       try {
//         setLoading(true);
//         // TODO:
//         const response = await fetch(
//           `/api/instructor/${instructorId}/dashboard/courses`,
//         );

//         if (!response.ok) {
//           console.log(
//             "Failed to fetch instructor created courses from api ...",
//           );
//           setError("Failed to fetch instructor created courses from api ...");
//         }

//         const data = await response.json();
//         setInstructorCreatedCourses(data.data);
//       } catch (error: any) {
//         console.log(
//           "Failed to fetch instructor created courses from api, ERROR: ",
//           error.message,
//         );
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInstructorCreatedCourses();
//   }, [instructorId]);

//   const fetchInstructorStudentsCount = async () => {
//     // TODO:
//     const response = await fetch(
//       `/api/instructor/${instructorId}/dashboard/courses/totalStudents`,
//     );

//     if (!response.ok) {
//       console.log("Failed to fetch instructor students count from api ...");
//     }

//     const data = await response.json();
//     console.log("Instructor students count json data before returning ...");
//     return data;
//   };

//   const {
//     data: instructorStudentsCountData,
//     isLoading: instructorStudentsCountLoading,
//     error: instructorStudentsCountError,
//   } = useQuery({
//     queryKey: ["instructorStudentsCount"],
//     queryFn: fetchInstructorStudentsCount,
//     staleTime: 4,
//   });

//   const fetchInstructorTotalReviewsCount = async () => {
//     const response = await fetch(
//       `api/instructor/${instructorId}/dashboard/courses/totalReviews`,
//     );

//     if (!response.ok) {
//       console.log("Failed to fetch instructor reviews count from api ...");
//       setError("Failed to fetch instructor reviews count from api ...");
//     }

//     const data = await response.json();
//     return data.data; // Ensure correct data return
//   };

//   const {
//     data: instructorReviewsCountData,
//     isLoading: instructorTotalReviewsCountLoading,
//     error: instructorTotalReviewsCountError,
//   } = useQuery({
//     queryKey: ["instructorTotalReviewsCount"],
//     queryFn: fetchInstructorTotalReviewsCount,
//     staleTime: 4,
//   });

//   if (
//     loading ||
//     instructorTotalReviewsCountLoading ||
//     instructorStudentsCountLoading
//   ) {
//     return <InstructorCardLoadingSkeleton />;
//   }

//   if (
//     error ||
//     instructorStudentsCountError ||
//     instructorTotalReviewsCountError
//   ) {
//     const errorMessage =
//       error ||
//       instructorStudentsCountError?.message ||
//       instructorTotalReviewsCountError?.message;

//     return (
//       <Callout
//         className=""
//         title="Failed to fetch Instructor data 🚨❌"
//         color="red"
//       >
//         ERROR: <span>{errorMessage} </span>
//       </Callout>
//     );
//   }

//   const instructorStudentsCount = instructorStudentsCountData as number;
//   const instructorTotalReviewsCount = instructorReviewsCountData as number;

//   return (
//     <div className="my-4 flex max-w-7xl flex-col justify-start md:mb-0 md:mt-4">
//       <div className="mb-6 flex flex-col items-start justify-start rounded-xl md:flex-row">
//         <div className="flex flex-col space-y-2">
//           <Image
//             src={
//               instructor
//                 ? instructor.instructorProfilePicUrl
//                 : "https://wcgwzdehnxpexussrkni.supabase.co/storage/v1/object/public/assets/green-3d.jpg"
//             }
//             alt={`Image`}
//             height={150}
//             width={150}
//             objectFit="cover"
//             quality={100}
//             className="flex h-[10rem] w-[16rem] items-center justify-start rounded-xl object-cover ring-1 ring-white"
//           />

//           <div className="flex w-full max-w-[16rem] flex-col items-start text-start text-base">
//             <p className="line-clamp-1 text-lg font-semibold tracking-tight text-gray-800 dark:text-slate-200">
//               {instructor ? instructor.instructorName : "Aman Soni"}
//             </p>
//             <p className="line-clamp-2 text-sm font-thin tracking-tight text-gray-700 dark:text-gray-400">
//               {instructor ? instructor.instructorTag : "Full Stack Engineer"}
//             </p>
//           </div>
//         </div>

//         <div className="mt-4 md:ml-6 md:mt-0 md:px-6">
//           <div>
//             <p className="mb-1 text-lg font-semibold tracking-tight text-gray-800 dark:text-slate-200">
//               About Instructor
//             </p>

//             <p className="md:text-md md:text-md line-clamp-3 w-full max-w-3xl text-start text-sm font-normal text-gray-700 dark:text-gray-400 md:line-clamp-4 md:text-base">
//               {instructor
//                 ? instructor.aboutInstructor
//                 : `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos odit nam quae repellat quis cumque reiciendis autem ab expedita Provident eos odit nam quae repellat. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos odit nam quae repellat quis cumque reiciendis autem ab expedita Provident eos odit nam quae repellat.`}
//             </p>
//           </div>

//           <div className="mt-4 border-t pt-8">
//             <div className="flex h-5 items-center space-x-4 text-sm">
//               <div>
//                 <p className="text-sm font-medium uppercase text-gray-800 dark:text-white">
//                   Courses
//                 </p>
//                 <p className="text-xl font-bold text-black dark:text-white">
//                   {instructorCreatedCourses.length}
//                 </p>
//               </div>
//               <Separator orientation="vertical" />
//               <div>
//                 <p className="text-sm font-medium uppercase text-gray-800 dark:text-white">
//                   Students
//                 </p>
//                 <p className="text-xl font-bold text-black dark:text-white">
//                   {instructorStudentsCount}
//                 </p>
//               </div>
//               <Separator orientation="vertical" />
//               <div>
//                 <p className="text-sm font-medium uppercase text-gray-800 dark:text-white">
//                   Reviews
//                 </p>
//                 <p className="text-xl font-bold text-black dark:text-white">
//                   {instructorTotalReviewsCount}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default InstructorCard;

//! WAY 2
type InstructorCardProps = {
  instructorProfilePicUrl: string;
  instructorName: string;
  instructorTag: string;
  aboutInstructor: string;
  instructorCreatedCourses: any;
  instructorStudentsCount: number;
  instructorAverageStarRating: number;
};

const InstructorCard = ({
  instructorProfilePicUrl,
  instructorName,
  instructorTag,
  aboutInstructor,
  instructorCreatedCourses,
  instructorStudentsCount,
  instructorAverageStarRating,
}: InstructorCardProps) => {
  return (
    <div className="my-4 flex max-w-7xl flex-col justify-start md:mb-0 md:mt-4">
      <div className="mb-6 flex flex-col items-start justify-start rounded-xl md:flex-row">
        <div className="flex flex-col space-y-2">
          <Image
            src={
              instructorProfilePicUrl ||
              "https://wcgwzdehnxpexussrkni.supabase.co/storage/v1/object/public/assets/green-3d.jpg"
            }
            alt={`Image`}
            height={150}
            width={150}
            objectFit="cover"
            quality={100}
            className="flex h-[10rem] w-[16rem] items-center justify-start rounded-xl object-cover ring-1 ring-white"
          />

          <div className="flex w-full max-w-[16rem] flex-col items-start text-start text-base">
            <p className="line-clamp-1 text-lg font-semibold tracking-tight text-gray-800 dark:text-slate-200">
              {instructorName || "Aman Soni"}
            </p>
            <p className="line-clamp-2 text-sm font-thin tracking-tight text-gray-700 dark:text-gray-400">
              {instructorTag || "Full Stack Engineer"}
            </p>
          </div>
        </div>

        <div className="mt-4 md:ml-6 md:mt-0 md:px-6">
          <div>
            <p className="mb-1 text-lg font-semibold tracking-tight text-gray-800 dark:text-slate-200">
              About Instructor
            </p>

            <p className="md:text-md md:text-md line-clamp-3 w-full max-w-3xl text-start text-sm font-normal text-gray-700 dark:text-gray-400 md:line-clamp-4 md:text-base">
              {aboutInstructor ||
                `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos odit nam quae repellat quis cumque reiciendis autem ab expedita.`}
            </p>
          </div>

          <div className="mt-4 border-t pt-8">
            <div className="flex h-5 items-center space-x-4 text-sm">
              <div>
                <p className="text-sm font-medium uppercase text-gray-800 dark:text-white">
                  Courses
                </p>
                <p className="text-xl font-bold text-black dark:text-white">
                  {instructorCreatedCourses?.length || 0}
                </p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p className="text-sm font-medium uppercase text-gray-800 dark:text-white">
                  Students
                </p>
                <p className="text-xl font-bold text-black dark:text-white">
                  {instructorStudentsCount}
                </p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p className="text-sm font-medium uppercase text-gray-800 dark:text-white">
                  Reviews
                </p>
                <p className="text-xl font-bold text-black dark:text-white">
                  {instructorAverageStarRating.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InstructorCard;

// ? SKELETON
export const InstructorCardLoadingSkeleton = () => {
  return (
    <div className="mb-6 flex flex-col items-start justify-start rounded-xl md:flex-row">
      <div className="mb-6 flex flex-col space-y-3">
        <Skeleton className="flex h-[10rem] w-[16rem] items-center justify-start rounded-xl" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      <div className="space-y-4 md:px-6">
        <Skeleton className="h-8 w-[200px]" />

        <div className="max-w-screen w-full space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="flex items-center justify-start space-x-4 text-sm">
          <div className="space-y-1">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-8 w-[50px]" />
          </div>

          <Separator orientation="vertical" />

          <div className="space-y-1">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-8 w-[50px]" />
          </div>

          <Separator orientation="vertical" />

          <div className="space-y-1">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-8 w-[50px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
