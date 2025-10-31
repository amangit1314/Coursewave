// components/article-comments.tsx
"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { CommentsSheet } from "./CommentsSheet";

interface ArticleCommentsProps {
  article: {
    _count?: {
      comments?: number;
    };
  };
  articleId: string;
}

export function ArticleComments({ article, articleId }: ArticleCommentsProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  return (
    <>
      {/* Comment count button */}
      <button
        onClick={() => setIsCommentsOpen(true)}
        className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <MessageCircle className="h-3.5 w-3.5" />
        </div>
        <span className="text-sm font-medium">
          {article._count?.comments || 0}
        </span>
      </button>

      {/* Comments sidebar */}
      <CommentsSheet
        articleId={articleId}
        open={isCommentsOpen}
        onOpenChange={setIsCommentsOpen}
      />
    </>
  );
}
