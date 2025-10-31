"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Eye, Heart, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { CreatedArticleProps } from "../page";

export const columns: ColumnDef<CreatedArticleProps>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const href = row.original.href;

      return (
        <Link
          href={href}
          className="font-medium hover:text-blue-600 transition-colors"
        >
          {title}
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as "published" | "draft";

      return (
        <Badge
          className={
            status === "published"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
          }
        >
          {status === "published" ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "readTime",
    header: "Read Time",
    cell: ({ row }) => {
      const readTime = row.getValue("readTime") as number;
      return (
        <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          <Clock className="h-4 w-4" />
          {readTime} min
        </div>
      );
    },
  },
  {
    accessorKey: "views",
    header: "Views",
    cell: ({ row }) => {
      const views = (row.getValue("views") as number) || 0;
      return (
        <div className="flex items-center gap-1 text-sm">
          <Eye className="h-4 w-4 text-zinc-500" />
          {views}
        </div>
      );
    },
  },
  {
    accessorKey: "likes",
    header: "Likes",
    cell: ({ row }) => {
      const likes = (row.getValue("likes") as number) || 0;
      return (
        <div className="flex items-center gap-1 text-sm">
          <Heart className="h-4 w-4 text-red-500" />
          {likes}
        </div>
      );
    },
  },
  {
    accessorKey: "publishedAt",
    header: "Published",
    cell: ({ row }) => {
      const publishedAt = row.getValue("publishedAt") as string;
      return publishedAt ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          {new Date(publishedAt).toLocaleDateString()}
        </div>
      ) : (
        <span className="text-sm text-zinc-400">Not published</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const article = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={article.href}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/articles/${article.id}/edit`}>Edit Article</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/articles/${article.id}`} target="_blank">
                View Live
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
