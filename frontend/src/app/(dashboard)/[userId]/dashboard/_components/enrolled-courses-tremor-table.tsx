import {
  Badge,
  Card,
  Legend,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import Link from "next/link";
import { Course, User } from "@prisma/client";
import { RiFlag2Line, RiCheckLine, RiPlayFill } from "react-icons/ri";
import React from "react";

type EnrolledCourse = {
  enrollmentId: string;
  userId: string;
  courseId: string;
  enrollmentDate: string;
  completionStatus: string;
  user: User;
  course: Course;
};

export function EnrolledCoursesTremorTable({
  data,
}: {
  data: EnrolledCourse[];
}) {
  const [copiedText, setCopiedText] = React.useState("");
  return (
    <div className="border-stroke overflow-hidden rounded-3xl border dark:border dark:border-transparent dark:bg-zinc-800">
      {/* <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong  font-semibold">
        User Enrolled Courses
      </h3> */}
      <Table className="rounded-3xl p-5">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Course Name</TableHeaderCell>
            <TableHeaderCell>Enrollment Date</TableHeaderCell>
            <TableHeaderCell>Progress</TableHeaderCell>
            <TableHeaderCell>Certificate</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Validity</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.enrollmentId}>
              {/* <TableCell>
                <div className="h-8 w-8 cursor-pointer hover:bg-zinc-950 dark:hover:bg-zinc-600 hover:text-white p-2 hover:rounded-full hover:flex hover:justify-center hover:items-center transition-all duration-300">
                  <CopyToClipboard
                    text={copiedText}
                    onCopy={() => setCopiedText(item.enrollmentId)}
                  >
                    <AiTwotoneCopy
                      size={18}
                      className="text-zinc-950  dark:text-white "
                    />
                  </CopyToClipboard>
                </div>
              </TableCell> */}
              <TableCell>
                <Link
                  className="cursor-pointer transition-all duration-300 hover:text-blue-500"
                  href={`/courses/${item.course.courseId}/courseContent`}
                >
                  {item.course.courseTitle}
                </Link>
              </TableCell>
              <TableCell>{item.enrollmentDate.substring(0, 16)}</TableCell>
              <TableCell>
                <CourseProgressItem item={item} />
              </TableCell>
              <TableCell>
                <Link
                  className="cursor-pointer transition-all duration-300 hover:text-blue-500"
                  href={""}
                >
                  Certificate
                </Link>
              </TableCell>
              <TableCell>
                <Legend categories={["Active"]} colors={["green", "indigo"]}>
                  Active
                </Legend>
              </TableCell>
              <TableCell>
                <p>Life Time</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const CourseProgressItem = ({ item, progress }: any) => {
  return <div>{75}%</div>;
};

const ColoredBadgeComponent = ({ item }: any) => {
  let badgeColor;
  let badgeIcon;

  switch (item.completionStatus) {
    case "Started":
      badgeColor = "indigo";
      badgeIcon = RiPlayFill;
      break;
    case "InProgress":
      badgeColor = "orange";
      badgeIcon = RiFlag2Line; // Reuse existing flag icon
      break;
    case "Completed":
      badgeColor = "emerald";
      badgeIcon = RiCheckLine;
      break;
    default:
      badgeColor = "gray"; // Or any default color you prefer
      badgeIcon = RiFlag2Line; // Use flag icon for unknown status
  }

  return (
    <Badge color={badgeColor} icon={badgeIcon}>
      {item.completionStatus}
    </Badge>
  );
};
