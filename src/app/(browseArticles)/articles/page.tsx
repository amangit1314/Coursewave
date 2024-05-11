import React from "react";
import { ArticleCard } from "./_components/article-card";
import { db } from "@/lib/db";
import { Blog } from "@prisma/client";

const ArticlesPage = async () => {
  const articles = await db.blog.findMany();

  return (
    <div className="px-10 py-8 max-w-7xl overflow-x-hidden">
      <p className="text-3xl text-zinc-800 dark:text-white font-bold tracking-tight">
        Articles
      </p>
      <p className="text-base text-zinc-600 dark:text-gray-300">
        Browse articles on topic you like
      </p>

      <div>
        {articles && articles.length ? (
          <div className="grid my-8 grid-cols-2 md:grid-cols-3 gap-8">
            {articles.map((article: Blog) => {
              return (
                <div key={article.id}>
                  <ArticleCard article={article}  />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="grid my-8 grid-cols-3 gap-8">
            No Articles yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
