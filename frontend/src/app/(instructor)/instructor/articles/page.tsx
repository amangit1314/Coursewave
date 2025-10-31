"use client";

import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { Flex, Button } from "@tremor/react";

import { columns } from "./_components/CreatedArticlesColumns"; // You'll need to create this
import { useUserStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";
import { FileTextIcon, PencilIcon } from "lucide-react";
import { IoAddCircleOutline } from "react-icons/io5";
import { useCreatedArticles } from "@/hooks/useArticles"; // Your existing hook
import { DataTable } from "../courses/_components/DataTable";

// Types for articles (adjust based on your Blog model)
type Article = {
  id: string;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  readTime?: number;
  isPublished: boolean;
  publishedAt?: string;
  tags: string[];
  authorId: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreatedArticleProps = {
  id: string;
  authorId: string;
  image: string;
  title: string;
  href: string;
  readTime: number;
  status: "published" | "draft";
  publishedAt?: string;
  views?: number;
  likes?: number;
};

const CreatedArticles = () => {
  const { user } = useUserStore();
  const authorId = user?.id;
  const router = useRouter();

  // Use your existing hook for articles
  const {
    data: createdArticles,
    isLoading: isCreatedArticlesLoading,
    error: createdArticlesError,
  } = useCreatedArticles();

  // Transform API response into DataTable props
  const transformedArticles = React.useMemo(() => {
    if (!createdArticles) return [];
    
    const toCreatedArticleProps = (article: Article): CreatedArticleProps => ({
      id: article.id,
      authorId: article.authorId,
      image: article.coverImage || "/default-article-cover.jpg",
      title: article.title,
      href: `/instructor/articles/${article.id}`,
      readTime: article.readTime || 0,
      status: article.isPublished ? "published" : "draft",
      publishedAt: article.publishedAt,
      // You can add views and likes if you have them in your schema
      views: 0, // Replace with actual data from BlogView if available
      likes: 0, // Replace with actual data from BlogLike if available
    });
    
    return (createdArticles as Article[]).map(toCreatedArticleProps);
  }, [createdArticles, authorId]);

  // Toast notifications for error/success
  React.useEffect(() => {
    if (createdArticlesError) {
      toast.error(`Error fetching articles: ${createdArticlesError}`);
    }
    if (createdArticles && !isCreatedArticlesLoading) {
      toast.success("Articles fetched successfully 📝 ...");
    }
  }, [createdArticlesError, createdArticles, isCreatedArticlesLoading]);

  return (
    <div className="h-full pt-24 dark:bg-zinc-900">
      <div className="bg-white space-y-4 dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-4 sm:p-6">
        <Toaster />
        
        <Flex className="flex-wrap gap-4">
          {/* Header section */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex-shrink-0">
              <FileTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-white">
                Created Articles
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Manage and track the articles you've published
              </p>
            </div>
          </div>

          {/* Create button */}
          <Button
            onClick={() => router.push(`/instructor/articles/new`)}
            className="ml-auto flex items-center gap-1 border-none rounded-lg bg-blue-500 p-2 font-medium text-white shadow-xl hover:bg-blue-700 hover:font-semibold"
          >
            <IoAddCircleOutline size={22} />
            <span className="hidden sm:inline">Create Article</span>
          </Button>
        </Flex>

        {/* Table */}
        <div className="overflow-x-auto">
          {isCreatedArticlesLoading ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Loading articles...
            </p>
          ) : createdArticlesError ? (
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400">
                Error loading articles: {createdArticlesError.message ?? "Unknown error"}
              </p>
            </div>
          ) : (transformedArticles?.length || 0) > 0 ? (
            <DataTable columns={columns} data={transformedArticles} />
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <PencilIcon className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                No articles created yet
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto mb-6">
                Share your knowledge and insights by creating your first article.
              </p>
              <Button
                onClick={() => router.push(`/instructor/articles/new`)}
                className="bg-blue-500 hover:bg-blue-600 border-none text-white rounded-xl px-4 py-2 font-medium"
              >
                Create Your First Article
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatedArticles;