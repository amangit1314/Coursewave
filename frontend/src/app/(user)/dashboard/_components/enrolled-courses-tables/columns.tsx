import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import Link from "next/link";
import { EnrollementWithProgress } from "@/types/enrollment-with-progress";
import { EnrolledCourse } from "@/types/enrollments-api-response";
import { Enrollment } from "@/types/user-enrollments-api-response";

export const enrollmentColumns: ColumnDef<Enrollment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "courseTitle",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Course Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "enrollmentDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Enrollment Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "progress",
    header: "Progress (%)",
  },
  {
    accessorKey: "certificate",
    header: "Certificate",
  },
  {
    accessorKey: "enrollmentStatus",
    header: "Enrollment Status",
  },
  {
    accessorKey: "validity",
    header: "Validity",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const enrollment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-card"
          >
            <DropdownMenuLabel className="sr-only">Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer transition-all duration-200 hover:bg-muted hover:text-foreground"
              onClick={() => navigator.clipboard.writeText(enrollment.id)}
            >
              Copy enrollment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <Link href={`/courses/${enrollment.courseId}/courseContent`}>
              <DropdownMenuItem className="cursor-pointer transition-all duration-200 hover:bg-muted hover:text-foreground">
                View Course
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
