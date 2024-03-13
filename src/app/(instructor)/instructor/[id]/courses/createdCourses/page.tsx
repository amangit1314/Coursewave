"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect } from "react";
import { Course } from "@prisma/client";
import useUserInfo from "@/lib/hooks/use-user-info";
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

export default function CreatedCourses() {
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
          // https://localhost:3000
          `/api/instructor/${user.user?.id}/dashboard/courses`
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
  }, [user.user?.id]);

  return (
    <div className="pt-[80px] px-[2rem] h-full">
      <Card className="">
        <Toaster />
        <Flex>
          <MultiSelect
            onValueChange={setSelectedNames}
            placeholder="Select Course..."
            className="max-w-xs"
          >
            {createdCourses.map((item) => (
              <MultiSelectItem key={item.courseTitle} value={item.courseTitle}>
                {item.courseTitle}
              </MultiSelectItem>
            ))}
          </MultiSelect>

          <CreateCourseButton />
        </Flex>
        <Table className="mt-6">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Image</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell className="text-right">
                Price ($)
              </TableHeaderCell>
              {/* <TableHeaderCell className="text-right">
                Enrollements
              </TableHeaderCell> */}
              {/* <TableHeaderCell className="text-right">
                Total Earnings ($)
              </TableHeaderCell> */}
              <TableHeaderCell className="text-right">Status</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {createdCourses
              .filter((item) => isCourseSelected(item))
              .map((item) => (
                <TableRow key={item.courseId}>
                  <TableCell>
                    <Link
                      href={`/instructor/${user.user?.id}/courses/createdCourses/${item.courseId}`}
                    >
                      <Image
                        className="h-[40px] w-[40px] rounded-lg cursor-pointer"
                        alt={item.courseTitle}
                        src={item.courseImage}
                        height={40}
                        width={40}
                      />
                    </Link>
                  </TableCell>
                  <TableCell className="cursor-pointer hover:text-blue-500 hover:underline">
                    <Link
                      href={`/instructor/${user.user?.id}/courses/createdCourses/${item.courseId}`}
                    >
                      {item.courseTitle}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.coursePrice}
                  </TableCell>
                  {/* <TableCell className="text-right">{0}</TableCell> */}
                  <TableCell className="text-right">
                    <Badge
                      // Delta
                      // deltaType={"increase"}
                      size="xs"
                    >
                      {"published"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
