// File: /app/(articles)/articles/[articleId]/page.tsx

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { articleService } from "@/lib/api/articles";
import { ArticleFooter } from "./_components/article-footer";
import { ArticleContent } from "./_components/article-content";
import { ArticleSidebar } from "./_components/article-sidebar";
import { ArticleLoadingSkeleton } from "./_components/article-loading-skeleton";
import { ArticleHeader } from "./_components/article-header";
// import { ArticleHeader } from "./_components/article-header";
// import { ArticleContent } from "./_components/article-content";
// import { ArticleSidebar } from "./_components/article-sidebar";
// import { ArticleFooter } from "./_components/article-footer";
// import { ArticleLoadingSkeleton } from "./_components/article-loading-skeleton";

interface ArticlePageProps {
  params: {
    articleId: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const response = await articleService.getArticleById(params.articleId);
    const article = Array.isArray(response.data) ? response.data[0] : response.data;
    
    if (!article) {
      return {
        title: "Article Not Found | Coursewave",
        description: "The requested article could not be found.",
      };
    }

    return {
      title: `${article.title} | Coursewave`,
      description: article.excerpt || article.content?.substring(0, 160) || "Read this article on Coursewave",
      openGraph: {
        title: article.title,
        description: article.excerpt || article.content?.substring(0, 160),
        images: article.coverImage ? [article.coverImage] : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.excerpt || article.content?.substring(0, 160),
        images: article.coverImage ? [article.coverImage] : [],
      },
    };
  } catch (error) {
    return {
      title: "Article | Coursewave",
      description: "Read articles on Coursewave",
    };
  }
}

// Fetch article data on the server
async function getArticle(articleId: string) {
  try {
    const response = await articleService.getArticleById(articleId);
    const article = Array.isArray(response.data) ? response.data[0] : response.data;
    
    if (!article) {
      return null;
    }
    
    return article;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.articleId);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <ArticleHeader article={article} />
      
      {/* Main Content */}
      <main className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
            {/* Article Content */}
            <div className="lg:col-span-8">
              <Suspense fallback={<ArticleLoadingSkeleton />}>
                <ArticleContent article={article} />
              </Suspense>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <Suspense fallback={<div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />}>
                  <ArticleSidebar article={article} />
                </Suspense>
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
