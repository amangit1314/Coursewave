"use client";

import React from "react";
import { useUserStore } from "@/zustand/userStore";
import { Callout } from "@tremor/react";
import { ArticleCard } from "../../_components/ArticleCard";
import { BlogArticle } from "@/types/blog-api-response";
import MoreFromAuthorLoadingSkeleton from "./skeletons/MoreFromAuthorLoadingSkeleton";
import { useArticles } from "@/hooks/useArticles";
import { AlertCircle, FileText } from "lucide-react";

const MoreFromAuthor = ({ authorId }: { authorId: string }) => {
  const { user } = useUserStore();
  const { data: articles, isLoading, error } = useArticles();

  if (isLoading) {
    return <MoreFromAuthorLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full mx-auto flex items-center justify-center py-12">
        <Callout
          className="max-w-lg text-sm"
          title="Oops! Something went wrong"
          color="red"
          icon={AlertCircle}
        >
          <p className="text-red-600 dark:text-red-300">
            We couldn’t fetch more articles from this author.
            <span className="block mt-1 text-xs opacity-80">
              {error.message}
            </span>
          </p>
        </Callout>
      </div>
    );
  }

  const createdArticles = articles?.filter(
    (article: BlogArticle) => article.authorId === authorId
  );

  return (
    <div className="space-y-8">
      <p className="text-base font-semibold tracking-tight text-zinc-800 dark:text-white">
        More from{" "}
        <span className="font-bold text-blue-500">
          {user ? user.name : "(Unknown Author)"}
        </span>
      </p>

      <div>
        {createdArticles && createdArticles.length ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-8">
              {createdArticles.map((article: BlogArticle) => (
                <div key={article.id}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-start">
              <button className="border-stroke flex w-full max-w-20 cursor-pointer items-center justify-center rounded-full border border-blue-500 bg-transparent px-4 py-2 text-xs font-medium text-blue-500 transition-all duration-300 hover:border-transparent hover:bg-blue-700 hover:text-white">
                See All
              </button>
            </div>
          </div>
        ) : (
          <div className="my-12 flex flex-col items-center justify-center text-center space-y-3">
            <FileText className="h-10 w-10 text-zinc-400" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              This author hasn’t published any articles yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoreFromAuthor;
