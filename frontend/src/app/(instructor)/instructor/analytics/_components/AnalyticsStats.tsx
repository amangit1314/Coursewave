import React from "react";
import { BsPersonVideo2 } from "react-icons/bs";
import { TbMoneybag } from "react-icons/tb";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CardDataStats from "@/components/CardDataStats";
import {
  Users,
  GraduationCap,
  Star,
  FileText,
  TrendingUp,
  CheckCircle,
  BookOpen,
  MessageSquare,
} from "lucide-react";

type AnalyticsStats = {
  // totalEarning: string;
  // totalStudents: number;
  // totalCourses: number;
  totalEarning: string;
  totalStudents: number;
  totalCourses: number;
  totalEnrollments?: number;
  averageRating?: number;
  totalReviews?: number;
  completionRate?: number;
  totalProjects?: number;
  pendingSubmissions?: number;
  totalBlogs?: number;
  blogViews?: number;
  activeStudents?: number;
  earningsTrend?: number; // percentage change
  studentsTrend?: number;
  coursesTrend?: number;
};

export default function AnalyticsStats({
  // totalEarning,
  // totalStudents,
  // totalCourses,
  totalEarning,
  totalStudents,
  totalCourses,
  totalEnrollments,
  averageRating,
  totalReviews,
  completionRate,
  totalProjects,
  pendingSubmissions,
  totalBlogs,
  blogViews,
  activeStudents,
  earningsTrend,
  studentsTrend,
  coursesTrend,
}: AnalyticsStats) {
  return (
    // max-w-[559px]
    <ScrollArea className="w-full max-w-7xl  overflow-hidden rounded-lg">
      <div className="flex space-x-4">
        {/* Total Earnings */}
        {/* <div className="w-[240px]">
          <CardDataStats
            title="Total Earnings"
            total={`$ ${totalEarning ? totalEarning : 0}`}
            // rate="4.35%"
            // levelUp
          >
            <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-zinc-200 bg-opacity-30 p-1.5 dark:bg-zinc-700">
              <TbMoneybag size={22} />
            </div>
          </CardDataStats>
        </div> */}
        <div className="w-[240px]">
          <CardDataStats
            title="Total Earnings"
            total={`$ ${totalEarning ? totalEarning : 0}`}
            rate={earningsTrend ? `${earningsTrend}%` : undefined}
            levelUp={earningsTrend ? earningsTrend > 0 : undefined}
          >
            <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 p-1.5">
              <TbMoneybag
                size={22}
                className="text-green-600 dark:text-green-400"
              />
            </div>
          </CardDataStats>
        </div>

        {/* Total Courses */}
        {/* <div className="w-[240px]">
          <CardDataStats
            title="Total Courses"
            total={totalCourses ? totalCourses.toString() : "0"}
            // rate="2.59%"
            // levelUp
          >
            <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-zinc-200 bg-opacity-30 p-1.5 dark:bg-zinc-800">
              <BsPersonVideo2 size={22} />
            </div>
          </CardDataStats>
        </div> */}
        <div className="w-[240px]">
          <CardDataStats
            title="Total Courses"
            total={totalCourses ? totalCourses.toString() : "0"}
            rate={coursesTrend ? `${coursesTrend}%` : undefined}
            levelUp={coursesTrend ? coursesTrend > 0 : undefined}
          >
            <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 p-1.5">
              <BsPersonVideo2
                size={22}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
          </CardDataStats>
        </div>

        {/* Total Students */}
        {/* <div className="w-[240px]">
          <CardDataStats
            title="Total Students"
            total={totalStudents ? totalStudents.toString() : "0"}
            // rate="0.95%"
            // levelDown
          >
            <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-zinc-200 bg-opacity-30 p-1.5 dark:bg-zinc-700">
              <svg
                className="fill-zinc-900 dark:fill-white"
                width="22"
                height="18"
                viewBox="0 0 22 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                  fill=""
                />
                <path
                  d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                  fill=""
                />
                <path
                  d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                  fill=""
                />
              </svg>
            </div>
          </CardDataStats>
        </div> */}
        <div className="w-[240px]">
          <CardDataStats
            title="Total Students"
            total={totalStudents ? totalStudents.toString() : "0"}
            rate={studentsTrend ? `${studentsTrend}%` : undefined}
            levelUp={studentsTrend ? studentsTrend > 0 : undefined}
          >
            <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 p-1.5">
              <Users
                size={22}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
          </CardDataStats>
        </div>

        {totalEnrollments !== undefined && (
          <div className="w-[240px]">
            <CardDataStats
              title="Total Enrollments"
              total={totalEnrollments.toString()}
            >
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 p-1.5">
                <GraduationCap
                  size={22}
                  className="text-orange-600 dark:text-orange-400"
                />
              </div>
            </CardDataStats>
          </div>
        )}

        {/* Average Rating */}
        {averageRating !== undefined && (
          <div className="w-[240px]">
            <CardDataStats
              title="Average Rating"
              total={averageRating.toFixed(1)}
            >
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-1.5">
                <Star
                  size={22}
                  className="text-yellow-600 dark:text-yellow-400"
                />
              </div>
            </CardDataStats>
          </div>
        )}

        {/* Total Reviews */}
        {totalReviews !== undefined && (
          <div className="w-[240px]">
            <CardDataStats
              title="Total Reviews"
              total={totalReviews.toString()}
            >
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30 p-1.5">
                <MessageSquare
                  size={22}
                  className="text-pink-600 dark:text-pink-400"
                />
              </div>
            </CardDataStats>
          </div>
        )}

        {/* Completion Rate */}
        {completionRate !== undefined && (
          <div className="w-[240px]">
            <CardDataStats
              title="Completion Rate"
              total={`${completionRate.toFixed(0)}%`}
            >
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30 p-1.5">
                <CheckCircle
                  size={22}
                  className="text-teal-600 dark:text-teal-400"
                />
              </div>
            </CardDataStats>
          </div>
        )}

        {/* Active Students */}
        {activeStudents !== undefined && (
          <div className="w-[240px]">
            <CardDataStats
              title="Active Students"
              total={activeStudents.toString()}
            >
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-1.5">
                <TrendingUp
                  size={22}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              </div>
            </CardDataStats>
          </div>
        )}

        {/* Total Projects */}
        {totalProjects !== undefined && (
          <div className="w-[240px]">
            <CardDataStats
              title="Total Projects"
              total={totalProjects.toString()}
            >
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/30 p-1.5">
                <FileText
                  size={22}
                  className="text-cyan-600 dark:text-cyan-400"
                />
              </div>
            </CardDataStats>
          </div>
        )}

        {/* Pending Submissions */}
        {pendingSubmissions !== undefined && (
          <div className="w-[240px]">
            <CardDataStats
              title="Pending Reviews"
              total={pendingSubmissions.toString()}
            >
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 p-1.5">
                <FileText
                  size={22}
                  className="text-red-600 dark:text-red-400"
                />
              </div>
            </CardDataStats>
          </div>
        )}

        {/* Total Blogs */}
        {totalBlogs !== undefined && (
          <div className="w-[240px]">
            <CardDataStats title="Total Blogs" total={totalBlogs.toString()}>
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 p-1.5">
                <BookOpen
                  size={22}
                  className="text-violet-600 dark:text-violet-400"
                />
              </div>
            </CardDataStats>
          </div>
        )}

        {/* Blog Views */}
        {blogViews !== undefined && (
          <div className="w-[240px]">
            <CardDataStats
              title="Blog Views"
              total={blogViews.toLocaleString()}
            >
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-1.5">
                <TrendingUp
                  size={22}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              </div>
            </CardDataStats>
          </div>
        )}
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

/// ==========================================================================

// import React from "react";
// import { BsPersonVideo2 } from "react-icons/bs";
// import { TbMoneybag } from "react-icons/tb";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import CardDataStats from "@/components/CardDataStats";
// import {
//   Users,
//   GraduationCap,
//   Star,
//   FileText,
//   TrendingUp,
//   CheckCircle,
//   BookOpen,
//   MessageSquare,
// } from "lucide-react";

// type AnalyticsStats = {
// totalEarning: string;
// totalStudents: number;
// totalCourses: number;
// totalEnrollments?: number;
// averageRating?: number;
// totalReviews?: number;
// completionRate?: number;
// totalProjects?: number;
// pendingSubmissions?: number;
// totalBlogs?: number;
// blogViews?: number;
// activeStudents?: number;
// earningsTrend?: number; // percentage change
// studentsTrend?: number;
// coursesTrend?: number;
// };

// export default function AnalyticsStats({
// totalEarning,
// totalStudents,
// totalCourses,
// totalEnrollments,
// averageRating,
// totalReviews,
// completionRate,
// totalProjects,
// pendingSubmissions,
// totalBlogs,
// blogViews,
// activeStudents,
// earningsTrend,
// studentsTrend,
// coursesTrend,
// }: AnalyticsStats) {
//   return (
//     <ScrollArea className="w-full overflow-hidden rounded-lg">
//       <div className="flex space-x-4 pb-4">
//         {/* Total Earnings */}
// <div className="w-[240px]">
//   <CardDataStats
//     title="Total Earnings"
//     total={`$ ${totalEarning ? totalEarning : 0}`}
//     rate={earningsTrend ? `${earningsTrend}%` : undefined}
//     levelUp={earningsTrend ? earningsTrend > 0 : undefined}
//   >
//     <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 p-1.5">
//       <TbMoneybag
//         size={22}
//         className="text-green-600 dark:text-green-400"
//       />
//     </div>
//   </CardDataStats>
// </div>

//         {/* Total Courses */}
// <div className="w-[240px]">
//   <CardDataStats
//     title="Total Courses"
//     total={totalCourses ? totalCourses.toString() : "0"}
//     rate={coursesTrend ? `${coursesTrend}%` : undefined}
//     levelUp={coursesTrend ? coursesTrend > 0 : undefined}
//   >
//     <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 p-1.5">
//       <BsPersonVideo2
//         size={22}
//         className="text-blue-600 dark:text-blue-400"
//       />
//     </div>
//   </CardDataStats>
// </div>

//         {/* Total Students */}
// <div className="w-[240px]">
//   <CardDataStats
//     title="Total Students"
//     total={totalStudents ? totalStudents.toString() : "0"}
//     rate={studentsTrend ? `${studentsTrend}%` : undefined}
//     levelUp={studentsTrend ? studentsTrend > 0 : undefined}
//   >
//     <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 p-1.5">
//       <Users
//         size={22}
//         className="text-purple-600 dark:text-purple-400"
//       />
//     </div>
//   </CardDataStats>
// </div>

//         {/* Total Enrollments */}
// {/* {totalEnrollments !== undefined && (
//   <div className="w-[240px]">
//     <CardDataStats
//       title="Total Enrollments"
//       total={totalEnrollments.toString()}
//     >
//       <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 p-1.5">
//         <GraduationCap
//           size={22}
//           className="text-orange-600 dark:text-orange-400"
//         />
//       </div>
//     </CardDataStats>
//   </div>
// )} */}

// {/* Average Rating */}
// {/* {averageRating !== undefined && (
//   <div className="w-[240px]">
//     <CardDataStats
//       title="Average Rating"
//       total={averageRating.toFixed(1)}
//     >
//       <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-1.5">
//         <Star
//           size={22}
//           className="text-yellow-600 dark:text-yellow-400"
//         />
//       </div>
//     </CardDataStats>
//   </div>
// )} */}

// {/* Total Reviews */}
// {/* {totalReviews !== undefined && (
//   <div className="w-[240px]">
//     <CardDataStats
//       title="Total Reviews"
//       total={totalReviews.toString()}
//     >
//       <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30 p-1.5">
//         <MessageSquare
//           size={22}
//           className="text-pink-600 dark:text-pink-400"
//         />
//       </div>
//     </CardDataStats>
//   </div>
// )} */}

// {/* Completion Rate */}
// {/* {completionRate !== undefined && (
//   <div className="w-[240px]">
//     <CardDataStats
//       title="Completion Rate"
//       total={`${completionRate.toFixed(0)}%`}
//     >
//       <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30 p-1.5">
//         <CheckCircle
//           size={22}
//           className="text-teal-600 dark:text-teal-400"
//         />
//       </div>
//     </CardDataStats>
//   </div>
// )} */}

// {/* Active Students */}
// {/* {activeStudents !== undefined && (
//   <div className="w-[240px]">
//     <CardDataStats
//       title="Active Students"
//       total={activeStudents.toString()}
//     >
//       <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-1.5">
//         <TrendingUp
//           size={22}
//           className="text-indigo-600 dark:text-indigo-400"
//         />
//       </div>
//     </CardDataStats>
//   </div>
// )} */}

// {/* Total Projects */}
// {/* {totalProjects !== undefined && (
//   <div className="w-[240px]">
//     <CardDataStats
//       title="Total Projects"
//       total={totalProjects.toString()}
//     >
//       <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/30 p-1.5">
//         <FileText
//           size={22}
//           className="text-cyan-600 dark:text-cyan-400"
//         />
//       </div>
//     </CardDataStats>
//   </div>
// )} */}

// {/* Pending Submissions */}
// {/* {pendingSubmissions !== undefined && (
//   <div className="w-[240px]">
//     <CardDataStats
//       title="Pending Reviews"
//       total={pendingSubmissions.toString()}
//     >
//       <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 p-1.5">
//         <FileText
//           size={22}
//           className="text-red-600 dark:text-red-400"
//         />
//       </div>
//     </CardDataStats>
//   </div>
// )} */}

// {/* Total Blogs */}
// {/* {totalBlogs !== undefined && (
//   <div className="w-[240px]">
//     <CardDataStats title="Total Blogs" total={totalBlogs.toString()}>
//       <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 p-1.5">
//         <BookOpen
//           size={22}
//           className="text-violet-600 dark:text-violet-400"
//         />
//       </div>
//     </CardDataStats>
//   </div>
// )} */}

// {/* Blog Views */}
// {/* {blogViews !== undefined && (
//   <div className="w-[240px]">
//     <CardDataStats
//       title="Blog Views"
//       total={blogViews.toLocaleString()}
//     >
//       <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-1.5">
//         <TrendingUp
//           size={22}
//           className="text-emerald-600 dark:text-emerald-400"
//         />
//       </div>
//     </CardDataStats>
//   </div>
// )} */}
//       </div>

//       <ScrollBar orientation="horizontal" />
//     </ScrollArea>
//   );
// }

/// =====================================================================================

// import React from "react";
// import { BsPersonVideo2 } from "react-icons/bs";
// import { TbMoneybag } from "react-icons/tb";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import CardDataStats from "@/components/CardDataStats";

// type AnalyticsStats = {
//   totalEarning: string;
//   totalStudents: number;
//   totalCourses: number;
// };

// export default function AnalyticsStats({
//   totalEarning,
//   totalStudents,
//   totalCourses,
// }: AnalyticsStats) {
//   return (
//     <ScrollArea className="w-full max-w-[559px] overflow-hidden rounded-lg">
//       <div className="flex space-x-4">
//         <div className="w-[240px]">
//           <CardDataStats
//             title="Total Earnings"
//             total={`$ ${totalEarning ? totalEarning : 0}`}
//             // rate="4.35%"
//             // levelUp
//           >
//             <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-zinc-200 bg-opacity-30 p-1.5 dark:bg-zinc-700">
//               <TbMoneybag size={22} />
//             </div>
//           </CardDataStats>
//         </div>

//         <div className="w-[240px]">
//           <CardDataStats
//             title="Total Courses"
//             total={totalCourses ? totalCourses.toString() : "0"}
//             // rate="2.59%"
//             // levelUp
//           >
//             <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-zinc-200 bg-opacity-30 p-1.5 dark:bg-zinc-800">
//               <BsPersonVideo2 size={22} />
//             </div>
//           </CardDataStats>
//         </div>

//         <div className="w-[240px]">
//           <CardDataStats
//             title="Total Students"
//             total={totalStudents ? totalStudents.toString() : "0"}
//             // rate="0.95%"
//             // levelDown
//           >
//             <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-zinc-200 bg-opacity-30 p-1.5 dark:bg-zinc-700">
//               <svg
//                 className="fill-zinc-900 dark:fill-white"
//                 width="22"
//                 height="18"
//                 viewBox="0 0 22 18"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
//                   fill=""
//                 />
//                 <path
//                   d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
//                   fill=""
//                 />
//                 <path
//                   d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
//                   fill=""
//                 />
//               </svg>
//             </div>
//           </CardDataStats>
//         </div>
//       </div>

//       <ScrollBar orientation="horizontal" />
//     </ScrollArea>
//   );
// }
