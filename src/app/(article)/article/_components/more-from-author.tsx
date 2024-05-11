import { ArticleCard } from "@/app/(browseArticles)/articles/_components/article-card";
import { db } from "@/lib/db";
import { Blog } from "@prisma/client";

const MoreFromAuthor = async ({ authorId }: { authorId: string }) => {
  const articles = await db.blog.findMany({
    where: {
      authorId: authorId,
    },
  });

  return (
    <div className="space-y-8">
      <p className="text-base text-zinc-800 dark:text-white font-semibold tracking-tight">
        More from <span className="font-bold text-blue-500">Author Name</span>
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
          <div className="grid my-8 grid-cols-3 gap-8">No Articles yet</div>
        )}
      </div>
    </div>
  );
};

export default MoreFromAuthor;