import React from "react";
import { ArticleCard } from "./_components/article-card";

const ArticlesPage = () => {
  return (
    <div className="px-10 py-8 max-w-7xl overflow-x-hidden">
      <p className="text-3xl text-zinc-800 dark:text-white font-bold tracking-tight">
        Articles
      </p>
      <p className="text-base text-zinc-600 dark:text-gray-300">
        Browse articles on topic you like
      </p>

      <div className="grid my-8 grid-cols-3 gap-8">
        <ArticleCard articleId="130fhd3" />
        <ArticleCard articleId="1da0d16" />
        <ArticleCard articleId="sdyf268" />
      </div>
    </div>
  );
};

export default ArticlesPage;


