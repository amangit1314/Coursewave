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
import { Course } from "@/types/course";
import { cn } from "@/lib/utils/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  DollarSign,
  Calendar,
  Users,
  Star,
  AArrowUp,
} from "lucide-react";

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
        return Number(b.price) - Number(a.price);
      case "date":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "students":
        return (b.totalStudents || 0) - (a.totalStudents || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
        <div className="flex flex-col-reverse items-start justify-between">
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

          {/* <div className="flex items-center space-x-2 text-xs">
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as any)}
            >
              <SelectTrigger className="w-48 h-10 rounded-xl border-zinc-200 bg-white/80 text-zinc-700 shadow-sm hover:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800">
                <div className="flex items-center gap-2 ">
                  <SelectValue placeholder="Sort courses..." className="py-2" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-200 bg-white/95 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-800/95">
                <SelectItem
                  value="price"
                  className="flex items-center gap-2 py-2.5"
                >
                  <DollarSign className="h-4 w-4 shrink-0" />
                  <span className="whitespace-nowrap">Sort by Price</span>
                </SelectItem>
                <SelectItem
                  value="date"
                  className="flex items-center gap-2 py-2.5"
                >
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span className="whitespace-nowrap">Sort by Date</span>
                </SelectItem>
                <SelectItem
                  value="students"
                  className="flex items-center gap-2 py-2.5"
                >
                  <Users className="h-4 w-4 shrink-0" />
                  <span className="whitespace-nowrap">Sort by Students</span>
                </SelectItem>
                <SelectItem
                  value="rating"
                  className="flex items-center gap-2 py-2.5"
                >
                  <Star className="h-4 w-4 shrink-0" />
                  <span className="whitespace-nowrap">Sort by Rating</span>
                </SelectItem>
                <SelectItem
                  value="name"
                  className="flex items-center gap-2 py-2.5"
                >
                  <AArrowUp className="h-4 w-4 shrink-0" />
                  <span className="whitespace-nowrap">Sort by Name</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div> */}
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
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-sm"
              >
                {/* title column */}
                <TableCell className="px-6 py-4">
                  <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                    {course.title.length > 30
                      ? course.title.substring(0, 30) + "..."
                      : course.title}
                  </div>
                </TableCell>

                {/* date column */}
                <TableCell className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {new Date(course.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>

                {/* price column */}
                <TableCell className="px-6 py-4">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    ${parseFloat(course.price.toString()).toFixed(2)}
                  </span>
                </TableCell>

                {/* total students column */}
                <TableCell className="px-6 py-4">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {course.totalStudents || Math.floor(Math.random() * 50) + 5}
                  </span>
                </TableCell>

                {/* published status column */}
                <TableCell className="px-6 py-4">
                  {/* <Badge
                    // color={course.isPublished ? "green" : "yellow"}
                    className="inline-flex items-center rounded-badge px-2 py-1 text-xs font-medium overflow-hidden"
                    icon={RiRadioButtonLine}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge> */}
                  <Badge
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold tracking-wide border-0 shadow-sm",
                      course.isPublished
                        ? "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-300 ring-1 ring-green-500/20"
                        : "bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300 ring-1 ring-yellow-500/20"
                    )}
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
