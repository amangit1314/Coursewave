// "use client";

// import { Button } from "@/components/ui/button";
// import { ColumnDef } from "@tanstack/react-table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   ArrowUpDown,
//   Check,
//   Copy,
//   Edit,
//   ExternalLink,
//   FileText,
//   MoreHorizontal,
//   Trash2,
//   User,
// } from "lucide-react";
// import { Checkbox } from "@/components/ui/checkbox";
// import Link from "next/link";
// import { useState } from "react";

// type CreatedCourseProps = {
//   id: string;
//   instructorId: string;
//   // image: string;
//   name: string;
//   price: string;
//   status: "published" | "draft";
// };

// export const columns: ColumnDef<CreatedCourseProps>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "id",
//     header: "Id",
//   },
//   {
//     accessorKey: "name",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Name
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//   },
//   {
//     accessorKey: "price",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Price
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue("price"));
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//       }).format(amount);

//       return <div className="text-right font-medium">{formatted}</div>;
//     },
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const course = row.original;
//       const [copied, setCopied] = useState(false);

//       const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

//       const handleDelete = () => {
//         setDeleteDialogOpen(true);
//       };

//       const confirmDelete = () => {
//         console.log("Deleting course:", course.id);
//         deleteCourse(course.id);
//         setDeleteDialogOpen(false);
//       };

//       const handleCopyId = async () => {
//         try {
//           await navigator.clipboard.writeText(course.id);
//           setCopied(true);
//           setTimeout(() => setCopied(false), 2000);
//         } catch (err) {
//           console.error("Failed to copy:", err);
//         }
//       };

//       const handleEditRedirection = () => {
//         window.location.href = `/instructor/courses/${course.id}`;
//       };

//       return (
//         <>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className="h-9 w-9 p-0 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 group"
//               >
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//               align="end"
//               className="w-56 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl shadow-black/5 p-2"
//             >
//               {/* Header */}
//               <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
//                 <DropdownMenuLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//                   Course Actions
//                 </DropdownMenuLabel>
//               </div>

//               {/* Copy ID with feedback */}
//               <DropdownMenuItem
//                 className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 group/item"
//                 onClick={handleCopyId}
//               >
//                 <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 dark:bg-blue-500/20 group-hover/item:bg-blue-200 dark:group-hover/item:bg-blue-500/30 transition-colors">
//                   {copied ? (
//                     <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
//                   ) : (
//                     <Copy className="h-3 w-3 text-blue-600 dark:text-blue-400" />
//                   )}
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium">
//                     {copied ? "Copied!" : "Copy Course ID"}
//                   </span>
//                   <span className="text-xs text-gray-500 dark:text-gray-400">
//                     {course.id.slice(0, 8)}...
//                   </span>
//                 </div>
//               </DropdownMenuItem>

//               <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-800" />

//               {/* Quick Actions Section */}
//               <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-800" />

//               <div className="px-3 py-2">
//                 <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//                   Quick Actions
//                 </span>
//               </div>

//               {/* Additional Actions */}
//               <DropdownMenuItem
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 group/item"
//                 onClick={handleEditRedirection}
//               >
//                 <div className="flex items-center justify-center h-5 w-5 rounded-md bg-gray-100 dark:bg-gray-800 group-hover/item:bg-gray-200 dark:group-hover/item:bg-gray-700 transition-colors">
//                   <Edit className="h-3 w-3 text-gray-600 dark:text-gray-400" />
//                 </div>
//                 <span className="text-sm">Edit Course</span>
//               </DropdownMenuItem>

//               <DropdownMenuItem
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 group/item"
//                 onClick={handleDelete}
//               >
//                 <div className="flex items-center justify-center h-5 w-5 rounded-md bg-red-100 dark:bg-red-500/20 group-hover/item:bg-red-200 dark:group-hover/item:red-500/30 transition-colors">
//                   <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
//                 </div>
//                 <span className="text-sm">Delete Course</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {/* Delete Confirmation Dialog */}
//           <DeleteConfirmationDialog
//             isOpen={deleteDialogOpen}
//             onClose={() => setDeleteDialogOpen(false)}
//             onConfirm={confirmDelete}
//             courseTitle={course.name}
//           />
//         </>
//       );
//     },
//   },
// ];

// // Add these components at the top level of your file
// const DeleteConfirmationDialog = ({
//   isOpen,
//   onClose,
//   onConfirm,
//   courseTitle,
// }: any) => {
//   return (
//     <div
//       className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? "block" : "hidden"}`}
//     >
//       <div
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//         onClick={onClose}
//       />
//       <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md w-full p-6">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-500/20">
//             <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//               Delete Course
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               This action cannot be undone
//             </p>
//           </div>
//         </div>

//         <p className="text-gray-600 dark:text-gray-300 mb-6">
//           Are you sure you want to delete{" "}
//           <span className="font-semibold text-gray-900 dark:text-white">
//             "{courseTitle}"
//           </span>
//           ? All course data, including student progress and analytics, will be
//           permanently removed.
//         </p>

//         <div className="flex gap-3 justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors rounded-lg flex items-center gap-2"
//           >
//             <Trash2 className="h-4 w-4" />
//             Delete Course
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

/// ==============================================================================

"use client";

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
import {
  ArrowUpDown,
  Check,
  Copy,
  Edit,
  ExternalLink,
  FileText,
  MoreHorizontal,
  Trash2,
  User,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState } from "react";
import { useDeleteCourse } from "@/hooks/useCourses"; // Import the hook
import toast from "react-hot-toast"; // Import toast for notifications

type CreatedCourseProps = {
  id: string;
  instructorId: string;
  // image: string;
  name: string;
  price: string;
  status: "published" | "draft";
};

export const columns: ColumnDef<CreatedCourseProps>[] = [
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
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;
      const [copied, setCopied] = useState(false);
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

      // Use the delete course hook
      const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

      const handleDelete = () => {
        setDeleteDialogOpen(true);
      };

      const confirmDelete = () => {
        deleteCourse(course.id, {
          onSuccess: () => {
            toast.success("Course deleted successfully!");
            setDeleteDialogOpen(false);
          },
          onError: (error) => {
            toast.error("Failed to delete course. Please try again.");
            console.error("Delete course error:", error);
          },
        });
      };

      const handleCopyId = async () => {
        try {
          await navigator.clipboard.writeText(course.id);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
      };

      const handleEditRedirection = () => {
        window.location.href = `/instructor/courses/${course.id}`;
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 w-9 p-0 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 group"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl shadow-black/5 p-2"
            >
              {/* Header */}
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                <DropdownMenuLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Course Actions
                </DropdownMenuLabel>
              </div>

              {/* Copy ID with feedback */}
              <DropdownMenuItem
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 group/item"
                onClick={handleCopyId}
              >
                <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 dark:bg-blue-500/20 group-hover/item:bg-blue-200 dark:group-hover/item:bg-blue-500/30 transition-colors">
                  {copied ? (
                    <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Copy className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {copied ? "Copied!" : "Copy Course ID"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {course.id.slice(0, 8)}...
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-800" />

              {/* Quick Actions Section */}
              <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-800" />

              <div className="px-3 py-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Quick Actions
                </span>
              </div>

              {/* Additional Actions */}
              <DropdownMenuItem
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 group/item"
                onClick={handleEditRedirection}
              >
                <div className="flex items-center justify-center h-5 w-5 rounded-md bg-gray-100 dark:bg-gray-800 group-hover/item:bg-gray-200 dark:group-hover/item:bg-gray-700 transition-colors">
                  <Edit className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="text-sm">Edit Course</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 group/item"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <div className="flex items-center justify-center h-5 w-5 rounded-md bg-red-100 dark:bg-red-500/20 group-hover/item:bg-red-200 dark:group-hover/item:red-500/30 transition-colors">
                  {isDeleting ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                  ) : (
                    <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <span className="text-sm">
                  {isDeleting ? "Deleting..." : "Delete Course"}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Delete Confirmation Dialog */}
          <DeleteConfirmationDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={confirmDelete}
            courseTitle={course.name}
            isDeleting={isDeleting}
          />
        </>
      );
    },
  },
];

// Updated DeleteConfirmationDialog component with loading state
const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  courseTitle,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  courseTitle: string;
  isDeleting: boolean;
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? "block" : "hidden"}`}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-500/20">
            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Course
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This action cannot be undone
            </p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            "{courseTitle}"
          </span>
          ? All course data, including student progress and analytics, will be
          permanently removed.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Course
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
