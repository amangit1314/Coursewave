"use client";

import React, { useEffect } from "react";
import { Course } from "@prisma/client";
import { useUserInfo } from "@/hooks/useUserInfo";
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

type CreatedCourseProps = {
  id: string;
  instructorId: string;
  image: string;
  name: string;
  href: string;
  price: any;
  status: "published" | "draft";
};

const CreatedCourses = ({ params }: { params: { id: string } }) => {
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
          `/api/instructor/${instructorId}/dashboard/courses`,
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
        id: course.courseId,
        instructorId: course.instructorID!,
        image: course.courseImage || "",
        href: `/instructor/${instructorId}/courses/createdCourses/courses/${course.courseId}`,
        name: course.courseTitle,
        price: course.coursePrice!,
        status: course.isPublished ? "published" : "draft",
      };
    };
    return createdCourses.map(toCreatedCourseProps);
  }, [createdCourses, instructorId]);

  return (
    <div className="h-full px-[2rem] pb-6 pt-[80px] dark:bg-zinc-900">
      <div className="my-4 overflow-hidden rounded-3xl dark:border-none dark:bg-zinc-800">
        <Toaster />
        <Flex className="px-5 pb-8 pt-4">
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
};

export default CreatedCourses;
