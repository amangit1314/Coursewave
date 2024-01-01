"use client";

import React, { useEffect } from "react";
import { course } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast";
import CreateCourseButton from "../_components/create-course-button";
import CreatedCourseWidget from "../_components/created-course-widget";

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
} from "@tremor/react";

//   return (
//     <div className="pt-[80px] pb-12">
//       <div className="flex w-10/12 justify-between items-center py-auto mx-auto">
//         <SearchForm />
//         <CreateCourseButton />
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 my-6 w-10/12 justify-start mx-auto">
//         {loading
//           ? "Loading ..."
//           : courses.map((course: course) => (
//               <CreatedCourseWidget
//                 key={course.courseId}
//                 index={course.courseId}
//                 title={course.courseTitle}
//                 courseImage={course.courseImage}
//                 courseNumber={course.courseId}
//                 instructor={course.instructorID?.split("-")[0] || "Aman Soni"}
//                 instructorId={course.instructorID?.split("-")[0] || "Aman Soni"}
//                 price={course.coursePrice}
//                 categories={course.courseCategories}
//               />
//             ))}
//       </div>
//     </div>
//   );


function SearchForm() {
  return (
    <form className="w-3xl rounded-lg">
      {/* <div className="flex">
        <label
          htmlFor="search-dropdown"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Your Email
        </label>
        <button
          id="dropdown-button"
          data-dropdown-toggle="dropdown"
          className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
          type="button"
        >
          All categories
          <svg
            className="w-2.5 h-2.5 ms-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        <div
          id="dropdown"
          className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdown-button"
          >
            <li>
              <button
                type="button"
                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Mockups
              </button>
            </li>
            <li>
              <button
                type="button"
                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Templates
              </button>
            </li>
            <li>
              <button
                type="button"
                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Design
              </button>
            </li>
            <li>
              <button
                type="button"
                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Logos
              </button>
            </li>
          </ul>
        </div>
        <div className="relative w-3xl">
          <input
            type="search"
            id="search-dropdown"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="Search Courses..."
            required
          />
          <button
            type="submit"
            className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div> */}
      <div className="relative w-full">
        <input
          type="search"
          id="search-dropdown"
          className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
          placeholder="Search Courses..."
          required
        />
        <button
          type="submit"
          className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span className="sr-only">Search</span>
        </button>
      </div>
    </form>
  );
}

const salesPeople = [
  {
    name: "Peter Doe",
    leads: 45,
    sales: "1,000,000",
    quota: "1,200,000",
    variance: "low",
    region: "Region A",
    status: "overperforming",
    deltaType: "moderateIncrease",
  },
  {
    name: "Lena Whitehouse",
    leads: 35,
    sales: "900,000",
    quota: "1,000,000",
    variance: "low",
    region: "Region B",
    status: "average",
    deltaType: "unchanged",
  },
  {
    name: "Phil Less",
    leads: 52,
    sales: "930,000",
    quota: "1,000,000",
    variance: "medium",
    region: "Region C",
    status: "underperforming",
    deltaType: "moderateDecrease",
  },
  {
    name: "John Camper",
    leads: 22,
    sales: "390,000",
    quota: "250,000",
    variance: "low",
    region: "Region A",
    status: "overperforming",
    deltaType: "increase",
  },
  {
    name: "Max Balmoore",
    leads: 49,
    sales: "860,000",
    quota: "750,000",
    variance: "low",
    region: "Region B",
    status: "overperforming",
    deltaType: "increase",
  },
  {
    name: "Peter Moore",
    leads: 82,
    sales: "1,460,000",
    quota: "1,500,000",
    variance: "low",
    region: "Region A",
    status: "average",
    deltaType: "unchanged",
  },
  {
    name: "Joe Sachs",
    leads: 49,
    sales: "1,230,000",
    quota: "1,800,000",
    variance: "medium",
    region: "Region B",
    status: "underperforming",
    deltaType: "moderateDecrease",
  },
];

export default function CreatedCourses() {
  const [selectedNames, setSelectedNames] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [createdCourses, setCreatedCourses] = React.useState<course[]>([]);

  const isSalesPersonSelected = (salesPerson: any) =>
    selectedNames.includes(salesPerson.name) || selectedNames.length === 0;

    useEffect(() => {
      fetch(
        "https://localhost:3001/api/instructor/4675e19e-432b-4135-b285-cc0953095f9d/dashboard/courses"
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Failed to fetch created courses");
          }
        })
        .then((data) => {
          console.log(data); // Check the data in the console

          // Assuming your data.data is an array of courses
          setCreatedCourses(data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);
          setLoading(false);
        });
    }, []);

  return (
    <div className="pt-[80px] px-[2rem] h-full">
      <Card className="">
        <Flex>
          <MultiSelect
            onValueChange={setSelectedNames}
            placeholder="Select Salespeople..."
            className="max-w-xs"
          >
            {salesPeople.map((item) => (
              <MultiSelectItem key={item.name} value={item.name}>
                {item.name}
              </MultiSelectItem>
            ))}
          </MultiSelect>

          <CreateCourseButton />
        </Flex>
        <Table className="mt-6">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell className="text-right">
                Price ($)
              </TableHeaderCell>
              <TableHeaderCell className="text-right">
                Enrollements
              </TableHeaderCell>
              <TableHeaderCell className="text-right">
                Total Sales ($)
              </TableHeaderCell>
              <TableHeaderCell className="text-right">
                Popularity
              </TableHeaderCell>
              <TableHeaderCell className="text-right">Region</TableHeaderCell>
              <TableHeaderCell className="text-right">
                Performance Status
              </TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {createdCourses
              .filter((item) => isSalesPersonSelected(item))
              .map((item) => (
                <TableRow key={item.courseId}>
                  <TableCell>{item.courseTitle}</TableCell>
                  <TableCell className="text-right">{item.coursePrice}</TableCell>
                  {/* <TableCell className="text-right">{item.sales}</TableCell>
                  <TableCell className="text-right">{item.quota}</TableCell>
                  <TableCell className="text-right">{item.variance}</TableCell>
                  <TableCell className="text-right">{item.region}</TableCell> */}
                  <TableCell className="text-right">
                    <BadgeDelta deltaType={'moderateIncrease'} size="xs">
                      {'overperforming'}
                    </BadgeDelta>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

