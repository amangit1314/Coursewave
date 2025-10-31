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
  MoreHorizontal,
  Copy,
  Edit,
  Eye,
  Trash2,
  Heart,
  Clock,
  FileText,
  Check,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { BlogArticle } from "@/types/blog-api-response";
import { useState } from "react";
import { useDeleteArticle } from "@/hooks/useArticles"; // Import your delete hook
import toast from "react-hot-toast";

export const createdArticlesColumns: ColumnDef<BlogArticle>[] = [
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
        className="border-zinc-300 dark:border-zinc-600"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-zinc-300 dark:border-zinc-600"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => (
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
          ID
        </span>
      </div>
    ),
    cell: ({ row }) => {
      const id = row.getValue("id");
      return (
        <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md inline-block">
          {id ? String(id) : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-zinc-100 dark:hover:bg-zinc-800 -ml-4"
        >
          <FileText className="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400" />
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            Article Title
          </span>
          <ArrowUpDown className="ml-2 h-4 w-4 text-zinc-400" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.getValue("title");
      return (
        <div className="max-w-md">
          <div className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2">
            {title ? String(title) : "Untitled"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "estimatedReadingTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-zinc-100 dark:hover:bg-zinc-800 -ml-4"
        >
          <Clock className="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400" />
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            Reading Time
          </span>
          <ArrowUpDown className="ml-2 h-4 w-4 text-zinc-400" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const readingTime = row.getValue("estimatedReadingTime");
      return (
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            {readingTime ? `${readingTime} min` : "N/A"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "clapsCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-zinc-100 dark:hover:bg-zinc-800 -ml-4"
        >
          <Heart className="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400" />
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            Likes
          </span>
          <ArrowUpDown className="ml-2 h-4 w-4 text-zinc-400" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const likes = row.getValue("clapsCount") as number | undefined;
      const safeCount = likes ?? 0;
      const formattedLikes =
        safeCount >= 1000
          ? `${(safeCount / 1000).toFixed(1)}k`
          : safeCount.toString();

      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <Heart className="w-3.5 h-3.5 text-red-600 dark:text-red-400 fill-red-600 dark:fill-red-400" />
            <span className="text-sm font-medium text-red-700 dark:text-red-400">
              {formattedLikes}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
        Actions
      </span>
    ),
    cell: ({ row }) => {
      const article = row.original;
      const [copied, setCopied] = useState(false);
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

      // Use the delete article hook
      const { mutate: deleteArticle, isPending: isDeleting } =
        useDeleteArticle();

      const handleCopyId = async () => {
        try {
          await navigator.clipboard.writeText(article.id);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
      };

      const handleDelete = () => {
        setDeleteDialogOpen(true);
      };

      const confirmDelete = () => {
        deleteArticle(article.id, {
          onSuccess: () => {
            toast.success("Article deleted successfully!");
            setDeleteDialogOpen(false);
          },
          onError: (error) => {
            toast.error("Failed to delete article. Please try again.");
            console.error("Delete article error:", error);
          },
        });
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg"
            >
              <DropdownMenuLabel className="text-zinc-900 dark:text-zinc-100 font-semibold px-3 py-2">
                Article Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />

              {/* Copy ID with feedback */}
              <DropdownMenuItem
                className="cursor-pointer px-3 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg mx-1 transition-colors group"
                onClick={handleCopyId}
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-500/20 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/30 transition-colors mr-3">
                  {copied ? (
                    <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {copied ? "Copied!" : "Copy Article ID"}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {article.id.slice(0, 8)}...
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />

              <Link href={`/articles/${article.id}/edit`}>
                <DropdownMenuItem className="cursor-pointer px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg mx-1 transition-colors group">
                  <Edit className="w-4 h-4 mr-3 text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  <span className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                    Edit Article
                  </span>
                </DropdownMenuItem>
              </Link>

              <Link href={`/articles/${article.slug}`}>
                <DropdownMenuItem className="cursor-pointer px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg mx-1 transition-colors group">
                  <Eye className="w-4 h-4 mr-3 text-zinc-500 dark:text-zinc-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                  <span className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                    View Article
                  </span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />

              <DropdownMenuItem
                className="cursor-pointer px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mx-1 transition-colors group"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-md bg-red-100 dark:bg-red-500/20 group-hover:bg-red-200 dark:group-hover:bg-red-500/30 transition-colors mr-3">
                  {isDeleting ? (
                    <div className="w-3 h-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                  ) : (
                    <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <span className="text-zinc-700 dark:text-zinc-300 group-hover:text-red-700 dark:group-hover:text-red-400">
                  {isDeleting ? "Deleting..." : "Delete Article"}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Delete Confirmation Dialog */}
          <DeleteConfirmationDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={confirmDelete}
            articleTitle={article.title}
            isDeleting={isDeleting}
          />
        </>
      );
    },
  },
];

// Delete Confirmation Dialog Component
export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  articleTitle,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  articleTitle: string;
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
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-500/20">
            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Delete Article
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              This action cannot be undone
            </p>
          </div>
        </div>

        <p className="text-zinc-600 dark:text-zinc-300 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-zinc-900 dark:text-white">
            "{articleTitle}"
          </span>
          ? All article data, including likes and comments, will be permanently
          removed.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-lg border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
                Delete Article
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
