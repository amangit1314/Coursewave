"use client";

import { useParams } from "next/navigation";
import { ArticleHeader } from "./_components/ArticleHeader";
import { ArticleContent } from "./_components/ArticleContent";
import { ArticleSidebar } from "./_components/ArticleSidebar";
import { ArticleFooter } from "./_components/ArticleFooter";
import { ArticleLoadingSkeleton } from "./_components/skeletons/article-loading-skeleton";
import {
  useArticleBySlug,
  useIncrementArticleViewCount,
} from "@/hooks/useArticles";

export default function ArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();
  const {
    data: article,
    isLoading,
    isError,
    error,
  } = useArticleBySlug(articleId);

  // Always call the hook. Use `enabled` so it fires only when article.id is ready.
  // useIncrementArticleViewCount(article?.id ?? "", articleId);

  if (isLoading) {
    return <ArticleLoadingSkeleton />;
  }

  console.log("Article data in page:", article);

  if (isError || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8">
        <div>
          <h1 className="text-2xl font-semibold text-red-500">
            Article Not Found
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 mt-2">
            We couldn’t find the article you’re looking for.
          </p>
          <p className="text-zinc-600 dark:text-zinc-300 mt-2">
            Error: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
      {/* Header */}
      <ArticleHeader article={article} />

      {/* Main Content */}
      <main className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
            {/* Content */}
            <div className="lg:col-span-8">
              <ArticleContent article={article} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <ArticleSidebar article={article as any} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
