"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect } from "react";
import { Course } from "@prisma/client";
import useUserInfo from "@/hooks/use-user-info";
import toast, { Toaster } from "react-hot-toast";
import CreateCourseButton from "../_components/create-course-button";
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
} from "@tremor/react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

export default function CreatedCourses({ params }: { params: { id: string } }) {
  const instructorId = params?.id!;

  const [selectedNames, setSelectedNames] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [createdCourses, setCreatedCourses] = React.useState<Course[]>([]);
  const user = useUserInfo();

  const isCourseSelected = (Course: Course) =>
    selectedNames.includes(Course.courseTitle) || selectedNames.length === 0;

  const courseStatus = (Course: Course) => "published";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `api/instructor/${instructorId}/dashboard/courses`
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
    // Helper function to convert Course object to CreatedCourseProps
    const toCreatedCourseProps = (course: Course): CreatedCourseProps => {
      return {
        id: course.courseId, // Assuming `id` exists in the `Course` interface
        instructorId: course.instructorID!,
        image: course.courseImage || "", // Handle potential missing image
        href: `/instructor/${instructorId}/courses/createdCourses/courses/${course.courseId}`,
        name: course.courseTitle,
        price: course.coursePrice!, // Assuming `price` exists in the `Course` interface
        status: course.isPublished ? "published" : "draft", // Assuming all courses are published in this context
      };
    };
    return createdCourses.map(toCreatedCourseProps);
  }, [createdCourses, instructorId]);

  return (
    <div className="pt-[80px] px-[2rem] h-full dark:bg-zinc-900 pb-6">
      <div className="rounded-3xl my-4 dark:bg-zinc-800 overflow-hidden dark:border-none ">
        <Toaster />
        <Flex className="px-5 pt-4 pb-8">
          {/* <MultiSelect
            onValueChange={setSelectedNames}
            placeholder="Select Course..."
            className="max-w-xs dark:bg-zinc-800"
          >
            {createdCourses.map((item) => (
              <MultiSelectItem key={item.courseTitle} value={item.courseTitle}>
                {item.courseTitle}
              </MultiSelectItem>
            ))}
          </MultiSelect> */}

          <CreateCourseButton />
        </Flex>

        <DataTable columns={columns} data={transformedCourses} />
      </div>
    </div>
  );
}

type CreatedCourseProps = {
  id: string;
  instructorId: string;
  image: string;
  name: string;
  href: string;
  price: any;
  status: "published" | "draft";
};
