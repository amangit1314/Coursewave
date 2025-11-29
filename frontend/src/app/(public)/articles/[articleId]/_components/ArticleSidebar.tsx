"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Eye,
  Tag,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogArticle } from "@/types/blog-api-response";
import { ArticleComments } from "./ArticleComments";
import LikeButton from "./LikeButton";
import { useUserStore } from "@/zustand/userStore";
import { useState } from "react";
import { useDeleteArticle } from "@/hooks/useArticles";
import { DeleteConfirmationDialog } from "@/app/(user)/dashboard/_components/created-articles-table/created-articles-columns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ArticleSidebarProps {
  article: BlogArticle;
}

export function ArticleSidebar({ article }: ArticleSidebarProps) {
  const router = useRouter();
  const { user } = useUserStore();
  const isAuthor = article.author.id === user?.id;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Use the delete article hook
  const { mutate: deleteArticle, isPending: isDeleting } = useDeleteArticle();

  const handleEdit = () => {
    router.push(`/articles/${article.id}/edit`);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteArticle(article.id, {
      onSuccess: () => {
        toast.success("Article deleted successfully!");
        router.push("/articles");
        setDeleteDialogOpen(false);
      },
      onError: (error) => {
        toast.error("Failed to delete article. Please try again.");
        console.error("Delete article error:", error);
      },
    });
  };

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* Article Stats */}
      <Card className="border border-zinc-900 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 border-b-2 border-zinc-100 dark:border-zinc-800">
          <CardTitle className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
            Article Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Views count */}
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <Eye className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-medium">
                {article._count?.views || 0}
              </span>
            </div>

            {/* Like */}
            <LikeButton
              likes={article._count?.BlogLike || 0}
              articleId={article.id}
            />

            {/* Comments */}
            <ArticleComments article={article} articleId={article.id} />

            {/* Read Time */}
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-medium">
                {Math.ceil(article.readTime / 60)} min
              </span>
            </div>
          </div>

          <div className="pt-2 border-t-2 border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">
                {new Date(article.createdAt || Date.now()).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {/* <Card className="border border-zinc-900 dark:border-zinc-800 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-2xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold text-white tracking-tight">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          <Button className="w-full justify-start bg-white hover:bg-zinc-100 text-zinc-900 border-0 rounded-xl transition-all duration-200 hover:scale-[1.02]">
            <Bookmark className="h-4 w-4 mr-2" />
            Save Article
          </Button>
          <Button className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-[1.02]">
            <Share2 className="h-4 w-4 mr-2" />
            Share Article
          </Button>
        </CardContent>
      </Card> */}

      {/* Author Actions */}
      {isAuthor && (
        <Card className="border border-zinc-900 dark:border-zinc-800 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-white tracking-tight">
              Author Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Button
              className="w-full justify-start bg-white hover:bg-zinc-100 text-zinc-900 border-0 rounded-xl transition-all duration-200 hover:scale-[1.02]"
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Article
            </Button>
            <Button
              className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-[1.02]"
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
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        articleTitle={article.title}
        isDeleting={isDeleting}
      />

      {/* Tags */}
      <Card className="border border-zinc-900 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 border-b-2 border-zinc-100 dark:border-zinc-800">
          <CardTitle className="text-base font-bold text-zinc-900 dark:text-white flex items-center tracking-tight">
            <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg mr-2">
              <Tag className="h-4 w-4" />
            </div>
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex flex-wrap gap-2">
            {article?.tags?.map((tag: string, idx: number) => (
              <Badge
                key={`${tag}-${idx}`}
                className="group bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-300 dark:border-blue-800 rounded-full px-4 py-1.5 font-medium text-xs uppercase tracking-wide hover:bg-blue-500 hover:text-white hover:border-blue-500 dark:hover:bg-blue-600 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer "
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
