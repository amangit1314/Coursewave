import { ArticleCard } from "@/app/(browseArticles)/articles/_components/article-card";
import { db } from "@/lib/db";
import { Blog } from "@prisma/client";

const RecommendedFromCoursewave = async () => {
  const articles = await db.blog.findMany({
    where: {
      isRecommended: true,
    },
  });

  return (
    <div className="space-y-8">
      <p className="text-base text-zinc-800 dark:text-white font-semibold tracking-tight">
        Recommended from{" "}
        <span className="font-bold text-blue-500">CourseWave</span>
      </p>

      <div>
        {articles && articles.length ? (
          <div className="grid grid-cols-2 gap-8">
            {articles.map((article: Blog) => {
              return (
                <div key={article.id}>
                  <ArticleCard article={article} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid my-8 grid-cols-3 gap-8">No Recommended Articles yet</div>
        )}
      </div>
    </div>
  );
};

export default RecommendedFromCoursewave;