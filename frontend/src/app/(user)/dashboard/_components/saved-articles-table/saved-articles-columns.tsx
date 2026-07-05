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
  Eye,
  FileText,
  Check,
  Heart,
  Clock,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { BlogArticle } from "@/types/blog-api-response";
import { useState } from "react";

export const savedArticlesColumns: ColumnDef<BlogArticle>[] = [
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
        className="h-3 w-3 md:h-4 md:w-4 border-border"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="h-3 w-3 md:h-4 md:w-4 border-border"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => (
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-muted-foreground" />
        <span className="font-semibold text-muted-foreground">
          ID
        </span>
      </div>
    ),
    cell: ({ row }) => {
      const id = row.getValue("id");
      return (
        <div className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md inline-block">
          {id ? String(id) : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-muted -ml-4"
      >
        <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
        <span className="font-semibold text-muted-foreground">
          Article Title
        </span>
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => {
      const title = row.getValue("title");
      return (
        <div className="max-w-md">
          <div className="font-medium text-foreground line-clamp-2">
            {title ? String(title) : "Untitled"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "readTime",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-muted -ml-4"
      >
        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
        <span className="font-semibold text-muted-foreground">
          Reading Time
        </span>
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => {
      const readingTime = row.getValue("readTime");
      return (
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {readingTime ? `${readingTime} min` : "N/A"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "_count.BlogLike",
    header: () => (
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-red-500 dark:text-red-400" />
        <span className="font-semibold text-muted-foreground">
          Likes
        </span>
      </div>
    ),
    cell: ({ row }) => {
      // Access nested like count if possible
      const count = row.original._count?.BlogLike ?? 0;
      const formatted = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;
      return (
        <div className="flex gap-2 items-center">
          <Heart className="w-3.5 h-3.5 text-red-600 dark:text-red-400 fill-red-600 dark:fill-red-400" />
          <span className="font-medium text-red-700 dark:text-red-400">
            {formatted}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "authorId",
    header: "AuthorId",
    cell: ({ row }) => (
      <div className="font-mono text-xs text-muted-foreground">
        {row.getValue("authorId")}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <span className="font-semibold text-muted-foreground">
        Actions
      </span>
    ),
    cell: ({ row }) => {
      const article = row.original;
      const [copied, setCopied] = useState(false);

      const handleCopyId = async () => {
        try {
          await navigator.clipboard.writeText(article.id);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          // Optionally handle error
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-muted rounded-lg transition-colors"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-card border border-border rounded-xl shadow-lg"
          >
            <DropdownMenuLabel className="text-foreground font-semibold px-3 py-2">
              Article Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              className="cursor-pointer px-3 py-2.5 hover:bg-muted rounded-lg mx-1 transition-colors group"
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
                <span className="text-sm font-medium text-muted-foreground">
                  {copied ? "Copied!" : "Copy Article ID"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {article.id.slice(0, 8)}...
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border" />

            <Link href={`/articles/${article.slug}`}>
              <DropdownMenuItem className="cursor-pointer px-3 py-2 hover:bg-muted rounded-lg mx-1 transition-colors group">
                <Eye className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                <span className="text-muted-foreground group-hover:text-foreground">
                  View Article
                </span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
