// "use client";

import React from "react";
import { RiRadioButtonLine } from "react-icons/ri";
import {
  LineChart,
  Flex,
  Switch,
  Badge,
  BadgeDelta,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import { FaSort } from "react-icons/fa";
import { Course } from "@/types";

// export default function BestSellingCourses({ courses }: { courses: Course[] }) {
//   return (
//     <div className="border-stroke py-auto my-[25px] w-[22rem] items-center justify-start overflow-hidden rounded-lg border">
//       <Title className="flex justify-between px-4 pt-4">
//         <div>
//           <p className="text-base font-medium tracking-tight text-zinc-800 dark:text-white">
//             Best Selling Courses
//           </p>
//           <p className="text-xs text-zinc-600 dark:text-zinc-400">All Time</p>
//         </div>

//         <Badge color="blue" className="cursor-pointer text-xs" icon={FaSort}>
//           sort
//         </Badge>
//       </Title>

//       <Table className="mt-5">
//         <TableHead>
//           <TableRow>
//             <TableHeaderCell className="text-xs text-zinc-600 dark:text-zinc-400">
//               Name
//             </TableHeaderCell>
//             <TableHeaderCell className="text-xs text-zinc-600 dark:text-zinc-400">
//               Published
//             </TableHeaderCell>
//             <TableHeaderCell className="text-xs text-zinc-600 dark:text-zinc-400">
//               Price
//             </TableHeaderCell>
//             <TableHeaderCell className="text-xs text-zinc-600 dark:text-zinc-400">
//               Students
//             </TableHeaderCell>
//             <TableHeaderCell className="text-xs text-zinc-600 dark:text-zinc-400">
//               Status
//             </TableHeaderCell>
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {courses.map((course: Course) => (
//             <TableRow key={course.id}>
//               <TableCell className="text-xs">{course.title}</TableCell>
//               <TableCell className="text-xs">
//                 {new Date(course.createdAt).toLocaleDateString()}
//               </TableCell>
//               <TableCell>
//                 <div className="text-xs">
//                   ${parseFloat(course.price.toString()).toFixed(2)}
//                 </div>
//               </TableCell>
//               {/* <TableCell>
//                 <div className="text-xs">
//                   {course.totalStudents}
//                 </div>
//               </TableCell> */}
//               <TableCell>
//                 <Badge
//                   color="purple"
//                   className="rounded-full bg-purple-400 py-1 text-xs text-purple-700 dark:bg-purple-700 dark:text-purple-300"
//                   icon={RiRadioButtonLine}
//                 >
//                   {course.isPublished ? "Published" : "Draft"}
//                 </Badge>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

interface BestSellingCoursesProps {
  courses: Course[];
}

export const BestSellingCourses: React.FC<BestSellingCoursesProps> = ({
  courses,
}) => {
  const [sortBy, setSortBy] = React.useState<"price" | "date" | "students">(
    "price"
  );

  const sortedCourses = [...courses].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return b.price - a.price;
      case "date":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      // case 'students':
      //   return (b.totalStudents || 0) - (a.totalStudents || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Best Selling Courses
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Top performing courses
            </p>
          </div>

          {/* <div className="flex items-center space-x-2">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-md border border-zinc-300 bg-white px-1 py-1 text-xs font-medium text-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="price">Sort by Price</option>
              <option value="date">Sort by Date</option>
              <option value="students">Sort by Students</option>
            </select>
          </div> */}

          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-md border border-zinc-300 bg-white px-1 py-1 text-xs font-medium text-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="price">Sort by Price</option>
              <option value="date">Sort by Date</option>
              <option value="students">Sort by Students</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow className="border-b border-zinc-100 dark:border-zinc-800">
              <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                Course Name
              </TableHeaderCell>
              <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                Published
              </TableHeaderCell>
              <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                Price
              </TableHeaderCell>
              <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                Students
              </TableHeaderCell>
              <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                Status
              </TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {sortedCourses.map((course: Course) => (
              <TableRow
                key={course.id}
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <TableCell className="px-6 py-4">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    {course.title.length > 30
                      ? course.title.substring(0, 30) + "..."
                      : course.title}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {new Date(course.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    ${parseFloat(course.price.toString()).toFixed(2)}
                  </span>
                </TableCell>
                {/* <TableCell className="px-6 py-4">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {course.totalStudents || Math.floor(Math.random() * 50) + 5}
                  </span>
                </TableCell> */}
                <TableCell className="px-6 py-4">
                  <Badge
                    color={course.isPublished ? "green" : "yellow"}
                    className="inline-flex items-center"
                    icon={RiRadioButtonLine}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedCourses.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No courses found
          </p>
        </div>
      )}
    </div>
  );
};
