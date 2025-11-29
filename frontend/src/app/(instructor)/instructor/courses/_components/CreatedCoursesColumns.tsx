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
import { useRouter } from "next/navigation";

type CreatedCourseProps = {
  id: string;
  instructorId: string;
  image: string;
  name: string;
  price: string;
  status: "published" | "draft";
};

const router = useRouter();

export const columns: ColumnDef<CreatedCourseProps>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return (
        <span
          className="inline-block px-2 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-200 tracking-widest border border-gray-200 dark:border-zinc-700"
          title={id}
        >
          {id.slice(0, 8)}...
        </span>
      );
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const [showPreview, setShowPreview] = useState(false);
      const imageUrl = row.getValue("image") as string;
      return (
        <>
          <Button
            variant="ghost"
            onClick={() => setShowPreview(true)}
            className="p-1 rounded-full"
          >
            <img
              src={imageUrl}
              alt="Thumbnail"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 dark:border-zinc-700 shadow-sm"
              style={{
                minWidth: "2.5rem",
                minHeight: "2.5rem",
                background: "#fff",
              }}
            />
          </Button>
          {showPreview && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
              onClick={() => setShowPreview(false)}
            >
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border-4 border-white"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </>
      );
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <span
          className="inline-block px-3 py-1 font-semibold text-zinc-800 dark:text-zinc-100 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm whitespace-nowrap max-w-64 overflow-hidden overflow-ellipsis"
          title={name}
        >
          {name}
        </span>
      );
    },
  },

  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") as string);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);

      return (
        <div className="flex justify-end">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-700 shadow-sm">
            {formatted}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      // Style variants
      const badgeProps =
        status === "published"
          ? {
              label: "Published",
              className:
                "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border border-green-300 dark:border-green-700",
            }
          : {
              label: "Draft",
              className:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700",
            };

      return (
        <span
          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold shadow ${badgeProps.className}`}
        >
          {badgeProps.label}
        </span>
      );
    },
  },

  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const course = row.original;
  //     const [copied, setCopied] = useState(false);
  //     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  //     // Use the delete course hook
  //     const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  //     const handleDelete = () => {
  //       setDeleteDialogOpen(true);
  //     };

  //     const confirmDelete = () => {
  //       deleteCourse(course.id, {
  //         onSuccess: () => {
  //           toast.success("Course deleted successfully!");
  //           setDeleteDialogOpen(false);
  //         },
  //         onError: (error) => {
  //           toast.error("Failed to delete course. Please try again.");
  //           console.error("Delete course error:", error);
  //         },
  //       });
  //     };

  //     const handleCopyId = async () => {
  //       try {
  //         await navigator.clipboard.writeText(course.id);
  //         setCopied(true);
  //         setTimeout(() => setCopied(false), 2000);
  //       } catch (err) {
  //         console.error("Failed to copy:", err);
  //       }
  //     };

  //     const handleEditRedirection = () => {
  //       router.push( = `/instructor/courses/${course.id}`;
  //     };

  //     return (
  //       <>
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button
  //               variant="ghost"
  //               className="h-9 w-9 p-0 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 group"
  //             >
  //               <span className="sr-only">Open menu</span>
  //               <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent
  //             align="end"
  //             className="w-56 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl shadow-black/5 p-2"
  //           >
  //             {/* Header */}
  //             <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
  //               <DropdownMenuLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
  //                 Course Actions
  //               </DropdownMenuLabel>
  //             </div>

  //             {/* Copy ID with feedback */}
  //             <DropdownMenuItem
  //               className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 group/item"
  //               onClick={handleCopyId}
  //             >
  //               <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 dark:bg-blue-500/20 group-hover/item:bg-blue-200 dark:group-hover/item:bg-blue-500/30 transition-colors">
  //                 {copied ? (
  //                   <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
  //                 ) : (
  //                   <Copy className="h-3 w-3 text-blue-600 dark:text-blue-400" />
  //                 )}
  //               </div>
  //               <div className="flex flex-col">
  //                 <span className="text-sm font-medium">
  //                   {copied ? "Copied!" : "Copy Course ID"}
  //                 </span>
  //                 <span className="text-xs text-gray-500 dark:text-gray-400">
  //                   {course.id.slice(0, 8)}...
  //                 </span>
  //               </div>
  //             </DropdownMenuItem>

  //             <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-800" />

  //             {/* Quick Actions Section */}
  //             <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-800" />

  //             <div className="px-3 py-2">
  //               <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
  //                 Quick Actions
  //               </span>
  //             </div>

  //             {/* Additional Actions */}
  //             <DropdownMenuItem
  //               className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 group/item"
  //               onClick={handleEditRedirection}
  //             >
  //               <div className="flex items-center justify-center h-5 w-5 rounded-md bg-gray-100 dark:bg-gray-800 group-hover/item:bg-gray-200 dark:group-hover/item:bg-gray-700 transition-colors">
  //                 <Edit className="h-3 w-3 text-gray-600 dark:text-gray-400" />
  //               </div>
  //               <span className="text-sm">Edit Course</span>
  //             </DropdownMenuItem>

  //             <DropdownMenuItem
  //               className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 group/item"
  //               onClick={handleDelete}
  //               disabled={isDeleting}
  //             >
  //               <div className="flex items-center justify-center h-5 w-5 rounded-md bg-red-100 dark:bg-red-500/20 group-hover/item:bg-red-200 dark:group-hover/item:red-500/30 transition-colors">
  //                 {isDeleting ? (
  //                   <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
  //                 ) : (
  //                   <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
  //                 )}
  //               </div>
  //               <span className="text-sm">
  //                 {isDeleting ? "Deleting..." : "Delete Course"}
  //               </span>
  //             </DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>

  //         {/* Delete Confirmation Dialog */}
  //         <DeleteConfirmationDialog
  //           isOpen={deleteDialogOpen}
  //           onClose={() => setDeleteDialogOpen(false)}
  //           onConfirm={confirmDelete}
  //           courseTitle={course.name}
  //           isDeleting={isDeleting}
  //         />
  //       </>
  //     );
  //   },
  // },

  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;
      const [copied, setCopied] = useState(false);
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

      const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

      const handleDelete = () => setDeleteDialogOpen(true);
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
        router.push(`/instructor/courses/${course.id}`);
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="
                h-9 w-9 p-0 rounded-full shadow
                flex items-center justify-center
                bg-gray-100 dark:bg-zinc-800
                border border-gray-200 dark:border-zinc-700
                transition-all duration-200
                hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:scale-105
                group
              "
              >
                <span className="sr-only">Actions</span>
                <MoreHorizontal className="h-5 w-5 text-zinc-500 group-hover:text-blue-700 dark:text-zinc-400 dark:group-hover:text-blue-300 transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 backdrop-blur-xl shadow-lg shadow-black/5 p-2"
            >
              {/* Header */}
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                <DropdownMenuLabel className="flex justify-center items-center text-center text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Course Actions
                </DropdownMenuLabel>
              </div>

              {/* Copy ID */}
              <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer transition-all hover:bg-blue-50 dark:hover:bg-blue-900/40 group"
                onClick={handleCopyId}
              >
                <span className="flex items-center justify-center h-7 w-7 rounded-full border border-blue-200 dark:border-blue-700 bg-blue-100 dark:bg-blue-900">
                  {copied ? (
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  ) : (
                    <Copy className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  )}
                </span>
                <span className="font-mono text-xs font-semibold text-blue-900 dark:text-blue-200 tracking-wider px-2">
                  {copied ? "Copied!" : course.id.slice(0, 8) + "..."}
                </span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2 bg-gray-100 dark:bg-zinc-800" />

              {/* Edit Action */}
              <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer transition-all hover:bg-green-50 dark:hover:bg-green-900/40 group"
                onClick={handleEditRedirection}
              >
                <span className="flex items-center justify-center h-7 w-7 rounded-full border border-green-200 dark:border-green-700 bg-green-100 dark:bg-green-900">
                  <Edit className="h-4 w-4 text-green-600 dark:text-green-300" />
                </span>
                <span className="text-xs font-semibold text-green-700 dark:text-green-300 px-2">
                  Edit Course
                </span>
              </DropdownMenuItem>

              {/* Delete Action */}
              <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer transition-all hover:bg-red-50 dark:hover:bg-red-900/40 group"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <span className="flex items-center justify-center h-7 w-7 rounded-full border border-red-200 dark:border-red-700 bg-red-100 dark:bg-red-900">
                  {isDeleting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 dark:border-red-400 border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                </span>
                <span className="text-xs font-semibold text-red-700 dark:text-red-400 px-2">
                  {isDeleting ? "Deleting..." : "Delete"}
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
