// import { Suspense } from "react";
// import { notFound, useParams } from "next/navigation";
// import { Metadata } from "next";
// import { articleService } from "@/lib/api/services/articlesService";
// import { ArticleFooter } from "./_components/article-footer";
// import { ArticleContent } from "./_components/article-content";
// import { ArticleSidebar } from "./_components/article-sidebar";
// import { ArticleLoadingSkeleton } from "./_components/article-loading-skeleton";
// import { ArticleHeader } from "./_components/article-header";

// interface ArticlePageProps {
//   params: {
//     articleId: string;
//   };
// }

// // Generate metadata for SEO
// export async function generateMetadata({
//   params,
// }: ArticlePageProps): Promise<Metadata> {
//   try {
//     const response = await articleService.getArticleById(params.articleId);
//     const article = Array.isArray(response.data)
//       ? response.data[0]
//       : response.data;

//     if (!article) {
//       return {
//         title: "Article Not Found | Coursewave",
//         description: "The requested article could not be found.",
//       };
//     }

//     return {
//       title: `${article.title} | Coursewave`,
//       description:
//         article.excerpt ||
//         article.content?.substring(0, 160) ||
//         "Read this article on Coursewave",
//       openGraph: {
//         title: article.title,
//         description: article.excerpt || article.content?.substring(0, 160),
//         images: article.coverImage ? [article.coverImage] : [],
//         type: "article",
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: article.title,
//         description: article.excerpt || article.content?.substring(0, 160),
//         images: article.coverImage ? [article.coverImage] : [],
//       },
//     };
//   } catch (error) {
//     return {
//       title: "Article | Coursewave",
//       description: "Read articles on Coursewave",
//     };
//   }
// }

// // Fetch article data on the server
// async function getArticle(articleId: string) {
//   try {
//     console.log("Fetching article with ID:", articleId);
//     const response = await articleService.getArticleById(articleId);
//     const article = Array.isArray(response.data)
//       ? response.data[0]
//       : response.data;

//     if (!article) {
//       return null;
//     }

//     return article;
//   } catch (error) {
//     console.error("Error fetching article:", error);
//     return null;
//   }
// }

// export default async function ArticlePage() {
//   const params = useParams<{ articleId: string }>();
//   const { articleId } = params;
//   const article = await getArticle(articleId);

//   if (!article) {
//     notFound();
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
//       {/* Header */}
//       <ArticleHeader article={article} />

//       {/* Main Content */}
//       <main className="relative">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
//             {/* Article Content */}
//             <div className="lg:col-span-8">
//               <Suspense fallback={<ArticleLoadingSkeleton />}>
//                 <ArticleContent article={article} />
//               </Suspense>
//             </div>

//             {/* Sidebar */}
//             <div className="lg:col-span-4">
//               <div className="sticky top-24">
//                 <Suspense
//                   fallback={
//                     <div className="h-96 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
//                   }
//                 >
//                   <ArticleSidebar article={article} />
//                 </Suspense>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <ArticleFooter article={article} />
//     </div>
//   );
// }

// app/blog/[articleId]/page.tsx (client)
"use client";

import { useParams } from "next/navigation";
import { ArticleHeader } from "./_components/ArticleHeader";
import { ArticleContent } from "./_components/ArticleContent";
import { ArticleSidebar } from "./_components/ArticleSidebar";
import { ArticleFooter } from "./_components/ArticleFooter";
import { ArticleLoadingSkeleton } from "./_components/skeletons/article-loading-skeleton";
import { useArticleBySlug } from "@/hooks/useArticles";

export default function ArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();
  // const {slug} = useParams<{ slug: string }>();
  const {
    data: article,
    isLoading,
    isError,
    error,
  } = useArticleBySlug(articleId);

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
                <ArticleSidebar article={article} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <ArticleFooter article={article} />
    </div>
  );
}
