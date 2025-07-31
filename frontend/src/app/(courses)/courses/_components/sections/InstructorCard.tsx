/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import "swiper/css";
import { useInstructorInfo } from "@/hooks/useInstructorInfo";
import { Separator } from "@/components/ui/separator";
import { Callout } from "@tremor/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useInstructorStore } from "@/zustand/instructorStore";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FaStar, 
  FaUsers, 
  FaBookOpen, 
  FaGraduationCap,
  FaLinkedin,
  FaGlobe,
  FaTwitter
} from "react-icons/fa";
import { Button } from "@/components/ui/button";

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
//             <p className="line-clamp-1 text-lg font-semibold tracking-tight text-zinc-800 dark:text-slate-200">
//               {instructor ? instructor.instructorName : "Aman Soni"}
//             </p>
//             <p className="line-clamp-2 text-sm font-thin tracking-tight text-zinc-700 dark:text-zinc-400">
//               {instructor ? instructor.instructorTag : "Full Stack Engineer"}
//             </p>
//           </div>
//         </div>

//         <div className="mt-4 md:ml-6 md:mt-0 md:px-6">
//           <div>
//             <p className="mb-1 text-lg font-semibold tracking-tight text-zinc-800 dark:text-slate-200">
//               About Instructor
//             </p>

//             <p className="md:text-md md:text-md line-clamp-3 w-full max-w-3xl text-start text-sm font-normal text-zinc-700 dark:text-zinc-400 md:line-clamp-4 md:text-base">
//               {instructor
//                 ? instructor.aboutInstructor
//                 : `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos odit nam quae repellat quis cumque reiciendis autem ab expedita Provident eos odit nam quae repellat. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos odit nam quae repellat quis cumque reiciendis autem ab expedita Provident eos odit nam quae repellat.`}
//             </p>
//           </div>

//           <div className="mt-4 border-t pt-8">
//             <div className="flex h-5 items-center space-x-4 text-sm">
//               <div>
//                 <p className="text-sm font-medium uppercase text-zinc-800 dark:text-white">
//                   Courses
//                 </p>
//                 <p className="text-xl font-bold text-black dark:text-white">
//                   {instructorCreatedCourses.length}
//                 </p>
//               </div>
//               <Separator orientation="vertical" />
//               <div>
//                 <p className="text-sm font-medium uppercase text-zinc-800 dark:text-white">
//                   Students
//                 </p>
//                 <p className="text-xl font-bold text-black dark:text-white">
//                   {instructorStudentsCount}
//                 </p>
//               </div>
//               <Separator orientation="vertical" />
//               <div>
//                 <p className="text-sm font-medium uppercase text-zinc-800 dark:text-white">
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
  instructorCreatedCourses?: any;
  instructorStudentsCount?: number;
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
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 rounded-2xl" />
      
      <div className="relative p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Instructor Profile Section */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Profile Image with gradient border */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-1 animate-pulse"></div>
                <Image
                  src={
                    instructorProfilePicUrl ||
                    "https://wcgwzdehnxpexussrkni.supabase.co/storage/v1/object/public/assets/green-3d.jpg"
                  }
                  alt={`${instructorName} profile`}
                  height={120}
                  width={120}
                  className="relative rounded-full object-cover ring-4 ring-white dark:ring-zinc-800"
                />
              </div>

              {/* Instructor Info */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {instructorName || "Aman Soni"}
                </h3>
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                  <FaGraduationCap className="w-3 h-3 mr-1" />
                  {instructorTag || "Full Stack Engineer"}
                </Badge>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3">
                <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
                  <FaLinkedin className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
                  <FaGlobe className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
                  <FaTwitter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 flex items-center">
                <FaBookOpen className="w-5 h-5 mr-2 text-blue-500" />
                About Instructor
              </h4>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-base">
                {aboutInstructor ||
                  `Passionate educator with years of experience in software development and teaching. 
                  Committed to helping students master modern web technologies through practical, 
                  hands-on learning experiences.`}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-3">
                    <FaBookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {instructorCreatedCourses?.length || 0}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                    Courses Created
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-3">
                    <FaUsers className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {instructorStudentsCount?.toLocaleString() || "0"}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                    Students Enrolled
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mx-auto mb-3">
                    <FaStar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {instructorAverageStarRating?.toFixed(1) || "4.9"}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                    Average Rating
                  </p>
                </CardContent>
              </Card>
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
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 rounded-2xl" />
      
      <div className="relative p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section Skeleton */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center text-center space-y-6">
              <Skeleton className="w-32 h-32 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="flex space-x-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
              </div>
            </div>
          </div>

          {/* Content Section Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Skeleton className="h-6 w-48 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-0 shadow-sm">
                  <CardContent className="p-4 text-center">
                    <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
