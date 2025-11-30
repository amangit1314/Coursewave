// import React from 'react';
// import { useInstructorDashboard } from '@/hooks/useInstructorDashboard';
// import { useUserStore } from '@/zustand/userStore';
// import AnalyticsStats from '../instructor/analytics/_components/AnalyticsStats';
// // import AnalyticsStats from './_components/AnalyticsStats';

// /**
//  * Instructor Analytics Page
//  * Shows analytics, earnings, and student count with real‑time polling.
//  */
// const InstructorAnalyticsPage = () => {
//     const { user } = useUserStore();
//     const instructorId = user?.id ?? '';

//     const { analytics, earnings, studentsCount, loading, error } =
//         useInstructorDashboard(instructorId);

//     if (loading) return <div className="p-4">Loading dashboard...</div>;
//     if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

//     return (
//         <div className="p-6 space-y-6">
//             <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
//             <AnalyticsStats
//                 totalEarning={earnings?.toString() ?? "0"}
//                 totalStudents={studentsCount ?? 0}
//                 totalCourses={analytics?.totalCourses ?? 0}
//             />
//         </div>
//     );
// };

// export default InstructorAnalyticsPage;

"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React from "react";
import { useInstructorDashboard } from "@/hooks/useInstructorDashboard";
import { useUserStore } from "@/zustand/userStore";
import AnalyticsStats from "../instructor/analytics/_components/AnalyticsStats";

const InstructorAnalyticsPage = () => {
  const { user } = useUserStore();
  const instructorId = user?.id ?? "";

  const { analytics, earnings, studentsCount, loading, error } =
    useInstructorDashboard(instructorId);

  if (loading) return <div className="p-4">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
      <AnalyticsStats
        totalEarning={earnings?.toString() ?? "0"}
        totalStudents={studentsCount ?? 0}
        totalCourses={analytics?.totalCourses ?? 0}
      />
    </div>
  );
};

export default InstructorAnalyticsPage;

