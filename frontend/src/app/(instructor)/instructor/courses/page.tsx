// "use client";

// import React, { useEffect } from "react";

// import toast, { Toaster } from "react-hot-toast";
// import CreateCourseButton from "../_components/create-course-button";
// import {
//   Card,
//   Table,
//   TableRow,
//   TableCell,
//   TableHead,
//   TableHeaderCell,
//   TableBody,
//   BadgeDelta,
//   MultiSelect,
//   MultiSelectItem,
//   Flex,
//   Badge,
// } from "@tremor/react";
// import { DataTable } from "./_components/data-table";
// import { columns } from "./_components/columns";
// import { useUserStore } from "@/zustand/userStore";
// import { Course } from "@/types";
// import { useParams } from "next/navigation";
// import { BookOpenIcon } from "lucide-react";

// type CreatedCourseProps = {
//   id: string;
//   instructorId: string;
//   image: string;
//   name: string;
//   href: string;
//   price: any;
//   status: "published" | "draft";
// };

// const CreatedCourses = () => {
//   const params = useParams<{ id: string }>();
//   const instructorId = params?.id!;

//   const [selectedNames, setSelectedNames] = React.useState<string[]>([]);
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState<string | null>(null);
//   const [createdCourses, setCreatedCourses] = React.useState<Course[]>([]);
//   const { user } = useUserStore();

//   const isCourseSelected = (Course: Course) =>
//     selectedNames.includes(Course.title) || selectedNames.length === 0;

//   const courseStatus = (Course: Course) => "published";

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await fetch(
//           `/api/instructor/${instructorId}/dashboard/courses`
//         );

//         if (!response.ok) {
//           throw new Error(`Failed to fetch courses: ${response.statusText}`);
//         }

//         const data = await response.json();
//         const courses = data.data;
//         setCreatedCourses(courses);
//         toast.success("courses fetched successfully 🎉 ...");
//       } catch (error: any) {
//         setError(error.message);
//         console.error("Error fetching courses:", error);
//         toast.error(`Error fetching courses:, ${error}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [instructorId]);

//   const transformedCourses = React.useMemo(() => {
//     const toCreatedCourseProps = (course: Course): CreatedCourseProps => {
//       return {
//         id: course.id,
//         instructorId: course.instructorId!,
//         image: course.imageUrl || "",
//         href: `/instructor/${instructorId}/courses/createdCourses/courses/${course.id}`,
//         name: course.title,
//         price: course.price!,
//         status: course.isPublished ? "published" : "draft",
//       };
//     };
//     return createdCourses.map(toCreatedCourseProps);
//   }, [createdCourses, instructorId]);

//   return (
//     <div className="h-full px-[2rem] pb-6 pt-[80px] dark:bg-zinc-900">
//       <div className="bg-white space-y-4 dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
//         <Toaster />
//         <Flex className="">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
//                 <BookOpenIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />{" "}
//                 {/* icon updated */}
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
//                   Created Courses {/* heading updated */}
//                 </h3>
//                 <p className="text-sm text-zinc-600 dark:text-zinc-400">
//                   Manage and track the courses you’ve published{" "}
//                   {/* description updated */}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* <MultiSelect
//             onValueChange={setSelectedNames}
//             placeholder="Select Course..."
//             className="max-w-xs dark:bg-zinc-800"
//           >
//             {createdCourses.map((item) => (
//               <MultiSelectItem key={item.courseTitle} value={item.courseTitle}>
//                 {item.courseTitle}
//               </MultiSelectItem>
//             ))}
//           </MultiSelect> */}

//           <CreateCourseButton />
//         </Flex>

//         <DataTable columns={columns} data={transformedCourses} />
//       </div>
//     </div>
//   );
// };

// export default CreatedCourses;

"use client";

import React, { useEffect } from "react";

import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  BadgeDelta,
  MultiSelect,
  MultiSelectItem,
  Flex,
  Badge,
  Button,
} from "@tremor/react";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/CreatedCoursesColumns";
import { useUserStore } from "@/zustand/userStore";
import { Course } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { BookOpenIcon } from "lucide-react";
import { IoAddCircleOutline } from "react-icons/io5";

type CreatedCourseProps = {
  id: string;
  instructorId: string;
  image: string;
  name: string;
  href: string;
  price: any;
  status: "published" | "draft";
};

const CreatedCourses = () => {

  const [selectedNames, setSelectedNames] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [createdCourses, setCreatedCourses] = React.useState<Course[]>([]);
  const { user } = useUserStore();

  const instructorId = user?.id;
  const router = useRouter();

  const isCourseSelected = (Course: Course) =>
    selectedNames.includes(Course.title) || selectedNames.length === 0;

  const courseStatus = (Course: Course) => "published";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `/api/instructor/${instructorId}/dashboard/courses`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.statusText}`);
        }

        const data = await response.json();
        const courses = data.data;
        setCreatedCourses(courses);
        toast.success("courses fetched successfully 🎉 ...");
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching courses:", error);
        toast.error(`Error fetching courses:, ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [instructorId]);

  const transformedCourses = React.useMemo(() => {
    const toCreatedCourseProps = (course: Course): CreatedCourseProps => {
      return {
        id: course.id,
        instructorId: course.instructorId!,
        image: course.imageUrl || "",
        href: `/instructor/${instructorId}/courses/createdCourses/courses/${course.id}`,
        name: course.title,
        price: course.price!,
        status: course.isPublished ? "published" : "draft",
      };
    };
    return createdCourses.map(toCreatedCourseProps);
  }, [createdCourses, instructorId]);

  return (
    <div className="h-full px-4 sm:px-8 pt-24 dark:bg-zinc-900">
      <div className="bg-white space-y-4 dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-4 sm:p-6">
        <Toaster />
        <Flex className="flex-wrap gap-4">
          {/* Header section */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex-shrink-0">
              <BookOpenIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-white">
                Created Courses
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Manage and track the courses you’ve published
              </p>
            </div>
          </div>

          {/* Create button */}
          <Button
            onClick={() =>
              router.push(`/instructor/${instructorId}/courses/createCourse`)
            }
            className="ml-auto flex items-center gap-1 rounded-lg bg-blue-500 p-2 font-medium text-white shadow-xl hover:bg-blue-700 hover:font-semibold"
          >
            <IoAddCircleOutline size={22} />
            <span className="hidden sm:inline">Create Course</span>
          </Button>
        </Flex>

        {/* Table */}
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={transformedCourses} />
        </div>
      </div>
    </div>
  );
};

export default CreatedCourses;
