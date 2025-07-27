"use client";

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

export default function BestSellingCourses({ courses }: { courses: Course[] }) {
  return (
    <div className="border-stroke py-auto my-[25px] w-[22rem] items-center justify-start overflow-hidden rounded-lg border">
      <Title className="flex justify-between px-4 pt-4">
        <div>
          <p className="text-base font-medium tracking-tight text-zinc-800 dark:text-white">
            Best Selling Courses
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">All Time</p>
        </div>

        <Badge color="blue" className="cursor-pointer text-xs" icon={FaSort}>
          sort
        </Badge>
      </Title>

      <Table className="mt-5">
        <TableHead>
          <TableRow>
            <TableHeaderCell className="text-xs text-zinc-600 dark:text-zinc-400">
              Name
            </TableHeaderCell>
            <TableHeaderCell className="text-xs text-zinc-600 dark:text-zinc-400">
              Published
            </TableHeaderCell>
            <TableHeaderCell className="text-xs text-zinc-600 dark:text-zinc-400">
              Price
            </TableHeaderCell>
            <TableHeaderCell className="text-xs text-zinc-600 dark:text-zinc-400">
              Students
            </TableHeaderCell>
            <TableHeaderCell className="text-xs text-zinc-600 dark:text-zinc-400">
              Status
            </TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {courses.map((course: Course) => (
            <TableRow key={course.id}>
              <TableCell className="text-xs">{course.title}</TableCell>
              <TableCell className="text-xs">
                {new Date(course.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="text-xs">
                  ${parseFloat(course.price).toFixed(2)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-xs">
                  {course.totalStudents}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  color="purple"
                  className="rounded-full bg-purple-400 py-1 text-xs text-purple-700 dark:bg-purple-700 dark:text-purple-300"
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
  );
}
