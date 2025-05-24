import React from "react";
import { db } from "@/lib/db";
import { BlogWithComments } from "@/types/blog-with-comments";
import { ArticleCard } from "@/app/(articles)/articles/_components/article-card";

const ArticlesPage = async () => {
  // TODO: use useArticles zustand store here in place of directly accessing it from db
  const articles: BlogWithComments[] = await db.blog.findMany({
    include: {
      comments: true,
    },
  });

  return (
    <div className="max-w-7xl overflow-x-hidden px-10 py-8">
      <p className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-white">
        Articles
      </p>
      <p className="text-base text-zinc-600 dark:text-gray-300">
        Browse articles on topic you like
      </p>

      <div>
        {articles && articles.length ? (
          <div className="my-8 grid grid-cols-2 gap-8 md:grid-cols-3">
            {articles.map((article: BlogWithComments) => {
              return (
                <div key={article.id}>
                  <ArticleCard article={article} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="my-8 grid grid-cols-3 gap-8">No Articles yet</div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
