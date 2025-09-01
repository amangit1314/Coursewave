"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ArticleCard } from "./_components/ArticleCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, RefreshCw, AlertTriangle, FileText } from "lucide-react";
import { BlogArticle } from "@/types";
import { useArticles } from "@/hooks/useArticles";

const ArticlesPage = () => {
  const [search, setSearch] = useState("");
  const [isReloading, setIsReloading] = useState(false);
  const { data, isLoading, error, isError, refetch } = useArticles();

  const articles = data ?? [];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // or return a fallback

  // Use useMemo instead of useEffect to prevent infinite loops
  // const filtered = useMemo(() => {
  //   if (!search) return articles;
  //   return articles.filter((a: { title: string }) =>
  //     a.title.toLowerCase().includes(search.toLowerCase())
  //   );
  // }, [search, articles]);

  // Loading skeletons
  if (isLoading) {
    return (
      <div className="max-w-7xl overflow-x-hidden px-10 py-8">
        <p className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-white mb-2">
          Articles
        </p>
        <p className="text-base text-zinc-600 dark:text-gray-300 mb-8">
          Browse articles on topics you like
        </p>
        <div className="mb-8 flex items-center gap-3">
          <Skeleton className="h-10 w-72 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-6 w-2/3 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-4 w-1/3 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError && error) {
    return (
      <div className="max-w-7xl overflow-x-hidden px-10 py-16 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400 mb-4 animate-bounce" />
        <p className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">
          Failed to load articles
        </p>
        <p className="text-base text-red-500 dark:text-red-400 mb-6">
          {error.message}
        </p>
        <Button
          onClick={() => refetch()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  console.log("Articles in page.tsx:", articles);

  return (
    <div className="max-w-7xl overflow-x-hidden px-10 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-white">
            Articles
          </p>
          <p className="text-base text-zinc-600 dark:text-gray-300">
            Browse articles on topics you like
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
          </div>
          <Button variant="outline" onClick={() => setSearch("")}>
            Clear
          </Button>
        </div>
      </div>

      <div>
        {articles && articles.length > 0 ? (
          <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {articles.map((article: BlogArticle) => (
              <div key={article.id}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <div className="my-16 flex flex-col items-center justify-center text-center">
            <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-xl font-semibold text-zinc-700 dark:text-gray-200 mb-2">
              No articles found
            </p>
            <p className="text-base text-zinc-500 dark:text-gray-400 mb-4">
              Try a different search or check back later.
            </p>
            <Button
              onClick={() => {
                setIsReloading(true);
                refetch().finally(() => setIsReloading(false));
              }}
              variant="outline"
              className="group"
              disabled={isReloading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isReloading ? "animate-spin" : ""}`}
              />
              Reload
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
