// components/comment-list.tsx
"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { CommentItem } from "./CommentItem";
import { Comment as CommentType } from "@/types/comment";
import { useComments } from "@/hooks/useComments";

interface CommentListProps {
  articleId: string;
}

export function CommentList({ articleId }: CommentListProps) {
  const { data: comments, isLoading, error } = useComments(articleId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        Failed to load comments
      </div>
    );
  }

  if (!(comments as unknown as CommentType[]) || (comments as unknown as CommentType[]).length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  const topLevelComments = (comments as unknown as CommentType[]).filter(
    (comment) => !comment.parentId
  );

  return (
    <div className="space-y-6">
      {topLevelComments.map((comment: CommentType) => (
        <CommentItem key={comment.id} comment={comment} articleId={articleId} />
      ))}
    </div>
  );
}
