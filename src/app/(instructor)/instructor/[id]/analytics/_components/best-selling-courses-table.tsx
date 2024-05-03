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
import { Course } from "@prisma/client";

export default function BestSellingCourses({ courses}: { courses: Course[]}) {
  const data = [
    {
      name: "Viola Amherd",
      published: "3 months ago",
      sales: "19,408",
      enrolles: "180987",
      status: "active",
    },
    {
      name: "Simonetta Sommaruga",
      published: "this month",
      sales: "18, 308",
      enrolles: "186897",
      status: "active",
    },
    {
      name: "Alain Berset",
      published: "1 month ago",
      sales: "18, 308",
      enrolles: "104963",
      status: "active",
    },
    {
      name: "Ignazio Cassis",
      published: "2 month ago",
      sales: "18, 308",
      enrolles: "40823",
      status: "active",
    },
    {
      name: "Karin Keller-Sutter",
      published: "this month",
      sales: "14,890",
      enrolles: "828923",
      status: "active",
    },
    {
      name: "Guy Parmelin",
      published: "5 months ago",
      sales: "14,890",
      enrolles: "450831",
      status: "active",
    },
    {
      name: "Elisabeth Baume-Schneider",
      published: "this month",
      sales: "14,890",
      enrolles: "09871",
      status: "active",
    },
  ];

  return (
    <div className="w-[22rem] my-[25px] border  border-stroke  rounded-lg justify-start items-center py-auto overflow-hidden">
      <Title className="flex justify-between px-4 pt-4">
        <div>
          <p className="text-base tracking-tight text-zinc-800 dark:text-white font-medium">
            Best Selling Courses
          </p>
          <p className="text-xs dark:text-zinc-400 text-zinc-600">All Time</p>
        </div>

        <Badge color="blue" className="text-xs cursor-pointer" icon={FaSort}>
          sort
        </Badge>
      </Title>

      <Table className="mt-5">
        <TableHead>
          <TableRow>
            <TableHeaderCell className="text-xs dark:text-zinc-400 text-zinc-600">
              Name
            </TableHeaderCell>
            <TableHeaderCell className="text-xs dark:text-zinc-400 text-zinc-600">
              Published
            </TableHeaderCell>
            <TableHeaderCell className="text-xs dark:text-zinc-400 text-zinc-600">
              Total Sales
            </TableHeaderCell>
            <TableHeaderCell className="text-xs dark:text-zinc-400 text-zinc-600">
              Enrollements
            </TableHeaderCell>
            <TableHeaderCell className="text-xs dark:text-zinc-400 text-zinc-600">
              Status
            </TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {/* {data.map((item: any) => (
            <TableRow key={item.name}>
              <TableCell className="text-xs">{item.name}</TableCell>
              <TableCell className="text-xs">{item.published}</TableCell>
              <TableCell>
                <div className="text-xs">{item.sales}</div>
              </TableCell>
              <TableCell>
                <div className="text-xs">{item.enrolles}</div>
              </TableCell>
              <TableCell>
                <Badge
                  color="purple"
                  className="bg-purple-400 rounded-full dark:text-purple-300 dark:bg-purple-700 text-purple-700 text-xs py-1"
                  icon={RiRadioButtonLine}
                >
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))} */}
          {courses.map(
            (
              course: Course // Use the correct type from Prisma
            ) => (
              <TableRow key={course.courseId!}>
                {" "}
                {/* Use a unique identifier for key */}
                <TableCell className="text-xs">{course.courseTitle}</TableCell>
                <TableCell className="text-xs">
                  {course.createdAt?.toLocaleDateString() || "N/A"}
                </TableCell>{" "}
                {/* Handle potential null value for publishedAt */}
                <TableCell>
                  <div className="text-xs">{course.avgStarRatings || "N/A"}</div>{" "}
                  {/* Handle potential null value for totalSales */}
                </TableCell>
                <TableCell>
                  <div className="text-xs">{course.instructorName || "N/A"}</div>{" "}
                  {/* Handle potential null value for enrollments */}
                </TableCell>
                <TableCell>
                  <Badge
                    color="purple"
                    className="bg-purple-400 rounded-full dark:text-purple-300 dark:bg-purple-700 text-purple-700 text-xs py-1"
                    icon={RiRadioButtonLine}
                  >
                    {course.isPublished || "N/A"}
                    {/* Handle potential null value for status */}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}
