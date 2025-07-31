// "use client";

// import React from "react";
// import Analytics from "./_components/analytics-main-content";
// import { Course } from "@/types/course";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useQuery } from "@tanstack/react-query";
// import { instructorService } from "@/lib/api/services/instructor-service";
// import { toast } from "react-hot-toast";
// import { useUserInfo } from "@/hooks/useUserInfo";

// interface AnalyticsData {
//   totalEarning: string;
//   totalStudents: number;
//   totalCourses: number;
//   createdCourses: Course[];
// }

// const AnalyticsPage = ({ params }: { params: Promise<{ id: string }> }) => {
//   const [instructorId, setInstructorId] = React.useState<string | null>(null);
//   const { user } = useUserInfo();

//   // Handle async params
//   React.useEffect(() => {
//     const getParams = async () => {
//       const resolvedParams = await params;
//       setInstructorId(resolvedParams.id);
//     };
//     getParams();
//   }, [params]);

//   // First, verify the instructor exists and belongs to the current user
//   const { data: instructor, isLoading: instructorLoading, error: instructorError } = useQuery({
//     queryKey: ["instructorVerification", user?.id],
//     queryFn: async () => {
//       if (!user?.id) throw new Error("User not authenticated");
//       console.log("Verifying instructor for user:", user.id);
//       const instructorData = await instructorService.getInstructorByUserId(user.id);
//       console.log("Instructor verification result:", instructorData);
//       return instructorData;
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     enabled: !!user?.id,
//   });

//   // Then fetch analytics data using the verified instructor ID
//   const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useQuery({
//     queryKey: ["instructorAnalytics", instructor?.id],
//     queryFn: async () => {
//       if (!instructor?.id) throw new Error("No verified instructor ID");
//       console.log("Fetching analytics data for instructor:", instructor.id);
//       const data = await instructorService.getInstructorAnalytics(instructor.id);
//       console.log("Analytics data received:", data);
//       return data;
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     enabled: !!instructor?.id,
//   });

//   // Handle errors
//   React.useEffect(() => {
//     if (instructorError) {
//       console.error("Error verifying instructor:", instructorError);
//       if (instructorError instanceof Error) {
//         if (instructorError.message.includes("Instructor not found")) {
//           toast.error("You don't have an instructor profile. Please become an instructor first.");
//         } else {
//           toast.error(`Failed to verify instructor: ${instructorError.message}`);
//         }
//       } else {
//         toast.error("Failed to verify instructor");
//       }
//     }

//     if (analyticsError) {
//       console.error("Error fetching analytics data:", analyticsError);
//       if (analyticsError instanceof Error) {
//         toast.error(`Failed to fetch analytics data: ${analyticsError.message}`);
//       } else {
//         toast.error("Failed to fetch analytics data");
//       }
//     }
//   }, [instructorError, analyticsError]);

//   // Check if the URL instructor ID matches the verified instructor ID
//   const isAuthorized = instructorId === instructor?.id;

//   if (!user?.id) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px] p-6">
//         <div className="text-center max-w-md">
//           <div className="mb-4">
//             <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
//               <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//             </div>
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
//             Authentication Required
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-4">
//             Please log in to access the instructor dashboard.
//           </p>
//           <button
//             onClick={() => window.location.href = '/login'}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (instructorLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px] p-6">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400">Loading instructor profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (instructorError || !instructor) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px] p-6">
//         <div className="text-center max-w-md">
//           <div className="mb-4">
//             <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
//               <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//             </div>
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
//             Instructor Profile Not Found
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-4">
//             You don't have an instructor profile. Please become an instructor first.
//           </p>
//           <button
//             onClick={() => window.location.href = `/profile/${user.id}`}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Become Instructor
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthorized) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px] p-6">
//         <div className="text-center max-w-md">
//           <div className="mb-4">
//             <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
//               <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//               </svg>
//             </div>
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
//             Unauthorized Access
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-4">
//             You can only access your own instructor dashboard.
//           </p>
//           <button
//             onClick={() => window.location.href = `/instructor/${instructor.id}/analytics`}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Go to My Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (analyticsLoading) {
//     return (
// <div className="p-6">
//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//     <Skeleton className="h-24" />
//     <Skeleton className="h-24" />
//     <Skeleton className="h-24" />
//   </div>
//   <Skeleton className="h-96" />
// </div>
//     );
//   }

//   if (!analyticsData) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px] p-6">
//         <div className="text-center max-w-md">
//           <div className="mb-4">
//             <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
//               <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//             </div>
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
//             No Analytics Data Available
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-4">
//             Start creating courses to see your analytics data.
//           </p>
//           <button
//             onClick={() => window.location.href = `/instructor/${instructor.id}/courses/createCourse`}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Create Your First Course
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <Analytics
//       totalEarning={analyticsData.totalEarning}
//       totalStudents={analyticsData.totalStudents}
//       totalCourses={analyticsData.totalCourses}
//       createdCourses={analyticsData.createdCourses}
//     />
//   );
// };

// export default AnalyticsPage;

"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import Analytics from "./_components/analytics-main-content";
import { Skeleton } from "@/components/ui/skeleton";
import { instructorService } from "@/lib/api/services/instructor-service";
import { useUserInfo } from "@/hooks/useUserInfo";
import { Course } from "@/types/course";
import { useUserStore } from "@/zustand/userStore";

interface AnalyticsData {
  totalEarning: string;
  totalStudents: number;
  totalCourses: number;
  createdCourses: Course[];
}

interface AnalyticsPageProps {
  params: { id: string };
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ params }) => {
  const [instructorId, setInstructorId] = useState<string | null>(null);
  const { user } = useUserStore();

  useEffect(() => {
    if (params?.id) {
      setInstructorId(params.id);
    }
  }, [params?.id]);

  const {
    data: instructor,
    isLoading: instructorLoading,
    error: instructorError,
  } = useQuery({
    queryKey: ["instructorVerification", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      return instructorService.getInstructorByUserId(user.id);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery({
    queryKey: ["instructorAnalytics", instructor?.userId],
    queryFn: async () => {
      if (!instructor?.userId) throw new Error("No verified instructor ID");
      return instructorService.getInstructorAnalytics(instructor.userId);
    },
    enabled: !!instructor?.userId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (instructorError instanceof Error) {
      const msg = instructorError.message.includes("Instructor not found")
        ? "You don't have an instructor profile. Please become an instructor first."
        : `Failed to verify instructor: ${instructorError.message}`;
      toast.error(msg);
    } else if (instructorError) {
      toast.error("Failed to verify instructor");
    }

    if (analyticsError instanceof Error) {
      toast.error(`Failed to fetch analytics data: ${analyticsError.message}`);
    } else if (analyticsError) {
      toast.error("Failed to fetch analytics data");
    }
  }, [instructorError, analyticsError]);

  const isAuthorized = instructorId === instructor?.userId;

  if (!user?.id) {
    return <AuthRequiredFallback />;
  }

  if (instructorLoading) {
    return;
    <LoadingFallback title="Loading" message="Loading instructor profile..." />;
  }

  if (instructorError || !instructor) {
    return <InstructorNotFound userId={user.id} />;
  }

  if (!isAuthorized) {
    return <UnauthorizedFallback instructorId={instructor.userId} />;
  }

  if (analyticsLoading) {
    return <AnalyticsSkeleton />;
  }

  if (!analyticsData) {
    return <NoAnalyticsData instructorId={instructor.id} />;
  }

  return <Analytics {...analyticsData} />;
};

export default AnalyticsPage;

// ---- Reusable UI States ----

const AuthRequiredFallback = () => (
  <FallbackContainer
    iconName="shield-exclamation"
    title="Authentication Required"
    message="Please log in to access the instructor dashboard."
    buttonText="Go to Login"
    buttonLink="/login"
  />
);

const InstructorNotFound = ({ userId }: { userId: string }) => (
  <FallbackContainer
    iconName="exclamation-triangle"
    title="Instructor Profile Not Found"
    message="You don't have an instructor profile. Please become an instructor first."
    buttonText="Become Instructor"
    buttonLink={`/profile/${userId}`}
  />
);

const LoadingFallback = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => (
  <FallbackContainer
    iconName="exclamation-triangle"
    title={title}
    message={message}
    buttonText="Loading ..."
    buttonLink={``}
  />
);

const UnauthorizedFallback = ({ instructorId }: { instructorId: string }) => (
  <FallbackContainer
    iconName="lock-closed"
    title="Unauthorized Access"
    message="You can only access your own instructor dashboard."
    buttonText="Go to My Dashboard"
    buttonLink={`/instructor/${instructorId}/analytics`}
  />
);

const NoAnalyticsData = ({ instructorId }: { instructorId: string }) => (
  <FallbackContainer
    iconName="chart-bar"
    title="No Analytics Data Available"
    message="Start creating courses to see your analytics data."
    buttonText="Create Your First Course"
    buttonLink={`/instructor/${instructorId}/courses/createCourse`}
  />
);

const FallbackContainer = ({
  iconName,
  title,
  message,
  buttonText,
  buttonLink,
}: {
  iconName: string;
  title: string;
  message: string;
  buttonText: string;
  buttonLink: string;
}) => (
  <div className="flex items-center justify-center min-h-[400px] p-6">
    <div className="text-center max-w-md">
      <div className="mb-4">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <use href={`#${iconName}`} />
          </svg>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
      <button
        onClick={() => (window.location.href = buttonLink)}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  </div>
);

const AnalyticsSkeleton = () => (
  <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
    </div>
    <Skeleton className="h-96" />
  </div>
);
