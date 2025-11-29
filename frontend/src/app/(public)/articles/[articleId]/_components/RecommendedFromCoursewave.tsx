"use client";

import { useArticles } from "@/hooks/useArticles";
import { Callout } from "@tremor/react";
import { ArticleCard } from "../../_components/ArticleCard";
import { BlogArticle } from "@/types/blog-api-response";
import { useParams } from "next/dist/client/components/navigation";
import RecommendedFromCoursewaveLoadingSkeleton from "./skeletons/RecommendedFromCoursewaveLoadingSkeleton";

const RecommendedFromCoursewave = () => {
  const articlesData = useArticles();
  const params = useParams<{ articleId: string }>();
  const articleId = params.articleId;

  if (articlesData.isLoading) {
    return <RecommendedFromCoursewaveLoadingSkeleton />;
  }

  if (articlesData.error) {
    return (
      <div className="w-7xl mx-auto flex items-center justify-center align-middle">
        <Callout
          className=""
          title="Failed to Fetch Author Info 🚨❌"
          color="red"
        >
          <span>ERROR: {articlesData.error.message} 🚨❌ ...</span>
        </Callout>
      </div>
    );
  }

  console.log(
  "Articles in the recommended from coursewave before filtering: ",
    articlesData.data
  );

const articles = articlesData.data?.filter(
  (article: BlogArticle) => article.id !== articleId
);

return (
  <div className="space-y-8">
    <p className="text-base font-semibold tracking-tight text-zinc-800 dark:text-white">
      Recommended from{" "}
      <span className="font-bold text-blue-500">CourseWave</span>
    </p>

    <div>
      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-2 gap-8">
          {articles.map((article: BlogArticle) => {
            return (
              <div key={article.id}>
                <ArticleCard article={article} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="my-8 gap-8">No Recommended Articles yet</div>
      )}
    </div>
  </div>
);
};

export default RecommendedFromCoursewave;
