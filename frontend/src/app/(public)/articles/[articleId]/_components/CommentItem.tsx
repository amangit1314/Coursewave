"use client";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Reply,
} from "lucide-react";
import { Comment } from "@/types/comment";
import { formatDistanceToNow } from "date-fns";
import { useCommentMutations } from "@/hooks/useComments";
import { CommentForm } from "./CommentForm";
import classNames from "classnames";
import { IMAGES } from "@/constants/images";

interface CommentItemProps {
  comment: Comment;
  articleId: string;
  isReply?: boolean;
}

export function CommentItem({
  comment,
  articleId,
  isReply = false,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const {
    addComment,
    updateComment,
    deleteComment,
    toggleLike,
    isAdding,
    isUpdating,
    isDeleting,
    isTogglingLike,
  } = useCommentMutations();

  const handleReply = async (content: string) => {
    try {
      await addComment({
        articleId,
        content,
        parentId: comment.id,
      });
      setIsReplying(false);
    } catch (error) {
      // toast.error("Failed to respond");
    }
  };

  const handleEdit = async (content: string) => {
    try {
      await updateComment({
        articleId,
        commentId: comment.id,
        content,
      });
      setIsEditing(false);
    } catch (error) {}
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment({
          articleId,
          commentId: comment.id,
        });
      } catch (error) {}
    }
  };

  const handleLike = async () => {
    try {
      await toggleLike({
        articleId,
        commentId: comment.id,
      });
    } catch (error) {}
  };

  const replyCount = comment.replies?.length || 0;

  // Avatar rendering (with fallback)
  const avatarContent =
    comment.author && comment.author.avatar ? (
      <img
        src={comment.author.avatar || IMAGES.SAMPLE_PERSON_1}
        alt={comment.author.name || "User"}
        className="w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
        loading="lazy"
      />
    ) : (
      <span className="font-bold text-lg text-primary">
        {comment.author && comment.author.name
          ? comment.author.name.charAt(0).toUpperCase()
          : "?"}
      </span>
    );

  return (
    <div
      className={classNames(
        isReply && "ml-7 border-l-2 border-zinc-200 dark:border-zinc-700 pl-5"
      )}
    >
      <div
        className={classNames(
          "relative group bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-700 transition ring-0 ring-primary/30 focus-within:ring-2",
          isReply ? "mt-2" : "mt-6"
        )}
      >
        {/* Top: header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0 ring-1 ring-white/30 overflow-hidden">
              {avatarContent}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {comment.author?.name || "Unknown"}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  ·{" "}
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              {/* {comment.isEdited && (
                <span className="text-[11px] ml-1 px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded transition">
                  Edited
                </span>
              )} */}
            </div>
          </div>

          {/* Action menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className={classNames(
                "flex items-center justify-center h-8 w-8 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
              )}
              disabled={isDeleting || isUpdating}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 z-50 w-36 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  disabled={isUpdating}
                  className="flex items-center w-full px-4 py-2 text-sm text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg group"
                >
                  <Edit className="h-4 w-4 mr-2 text-zinc-600 dark:text-zinc-400 group-hover:text-primary" />
                  {isUpdating ? "Updating..." : "Edit"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  disabled={isDeleting}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/25 rounded-lg group"
                >
                  <Trash2 className="h-4 w-4 mr-2 text-red-500 group-hover:text-red-700" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <CommentForm
            initialContent={comment.content}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
            submitLabel={isUpdating ? "Updating..." : "Update"}
          />
        ) : (
          <div className="prose dark:prose-invert prose-sm max-w-none select-text px-0 py-2 text-zinc-900 dark:text-zinc-200 whitespace-pre-wrap break-words">
            {comment.content}
          </div>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center justify-between mt-6 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLike}
                disabled={isTogglingLike}
                className={classNames(
                  "flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold bg-gradient-to-r border transition focus:ring-2 focus:ring-blue-400",
                  comment.isLiked
                    ? "text-pink-600 border-pink-100 dark:border-pink-700 bg-pink-50 dark:bg-pink-900/15"
                    : "text-zinc-500 hover:text-pink-600 border-zinc-200 dark:border-zinc-700 hover:border-pink-400 bg-transparent"
                )}
              >
                <Heart
                  className={classNames(
                    "h-4 w-4",
                    comment.isLiked && "fill-pink-600"
                  )}
                />
                <span>{isTogglingLike ? "…" : comment.likes || 0}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsReplying((r) => !r)}
                disabled={isAdding}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm text-zinc-500 hover:text-blue-600 bg-transparent border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 transition focus:ring-2 focus:ring-blue-400"
              >
                <Reply className="h-4 w-4" />
                <span>Reply</span>
              </button>
            </div>
            {replyCount > 0 && (
              <button
                type="button"
                onClick={() => setShowReplies((val) => !val)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm text-zinc-500 hover:text-green-600 border border-zinc-200 dark:border-zinc-700 hover:border-green-500 bg-transparent transition focus:ring-2 focus:ring-blue-400"
              >
                <MessageCircle className="h-4 w-4" />
                <span>
                  {replyCount} {replyCount === 1 ? "reply" : "replies"}
                </span>
              </button>
            )}
          </div>
        )}
        {isReplying && !isEditing && (
          <div className="mt-4">
            <CommentForm
              onSubmit={handleReply}
              onCancel={() => setIsReplying(false)}
              submitLabel={isAdding ? "Posting..." : "Reply"}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Replies thread */}
      {showReplies && replyCount > 0 && (
        <div className="mt-3 space-y-4">
          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              articleId={articleId}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
