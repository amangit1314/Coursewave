"use client";

import { useParams, useRouter } from "next/navigation";
import { useArticle } from "@/hooks/useArticles";
import { Button } from "@/components/ui/button";
import { Edit, Save, X, Eye, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateArticle } from "@/hooks/useArticles";
import toast from "react-hot-toast";
import { ArticleLoadingSkeleton } from "../_components/skeletons/ArticleLoadingSkeleton";
import { ArticleContent } from "../_components/ArticleContent";
import { ArticleSidebar } from "../_components/ArticleSidebar";
import { BlogArticle } from "@/types";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";

interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  readTime: number;
}

export default function EditArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const { data: article, isLoading, isError, error } = useArticle(articleId);
  const updateArticleMutation = useUpdateArticle();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
    watch,
  } = useForm<ArticleFormData>({
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      readTime: 0,
    },
  });

  // Reset form when article data loads
  useEffect(() => {
    if (article) {
      reset({
        title: article.title || "",
        content: article.content || "",
        excerpt: article.excerpt || "",
        readTime: article.readTime || 0,
      });
    }
  }, [article, reset]);

  const onSubmit = async (data: ArticleFormData) => {
    if (!article?.id) return;

    try {
      await updateArticleMutation.mutateAsync({
        id: article.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        readTime: data.readTime,
      });
      
      toast.success("Article updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update article");
      console.error("Update error:", error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleViewPublished = () => {
    router.push(`/articles/${article?.slug}`);
  };

  const handleGoBack = () => {
    if (isDirty && isEditing) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  // Loading state
  if (isLoading) {
    return <ArticleLoadingSkeleton />;
  }

  // Error state
  if (isError || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8">
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Article Not Found
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 mb-2">
            We couldn't find the article you're looking for.
          </p>
          {error && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Error: {error instanceof Error ? error.message : "Unknown error"}
            </p>
          )}
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleGoBack}
                className="flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              
              <div className="flex items-center gap-3">
                <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Edit Article
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
                    {article.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <ThemeModeToggle />
              
              {!isEditing ? (
                <>
                  <Button
                    onClick={handleViewPublished}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View Published</span>
                  </Button>
                  <Button
                    onClick={handleEdit}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit Article</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </Button>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting || !isDirty}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
            {/* Content Area */}
            <div className="lg:col-span-8">
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Title *
                    </label>
                    <input
                      {...register("title", { 
                        required: "Title is required",
                        minLength: { value: 3, message: "Title must be at least 3 characters" }
                      })}
                      className="w-full px-4 py-3 text-2xl font-bold border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-colors"
                      placeholder="Enter article title..."
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Excerpt Input */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      {...register("excerpt")}
                      rows={3}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-colors resize-none"
                      placeholder="Brief description of your article..."
                    />
                  </div>

                  {/* Reading Time Input */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Estimated Reading Time (minutes) *
                    </label>
                    <input
                      {...register("readTime", {
                        required: "Reading time is required",
                        min: { value: 1, message: "Reading time must be at least 1 minute" },
                        valueAsNumber: true,
                      })}
                      type="number"
                      min="1"
                      className="w-32 px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-colors"
                      placeholder="5"
                    />
                    {errors.readTime && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.readTime.message}
                      </p>
                    )}
                  </div>

                  {/* Content Input */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Content *
                    </label>
                    <textarea
                      {...register("content", {
                        required: "Content is required",
                        minLength: { value: 50, message: "Content must be at least 50 characters" }
                      })}
                      rows={20}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-sm transition-colors resize-none"
                      placeholder="Start writing your article content..."
                    />
                    {errors.content && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.content.message}
                      </p>
                    )}
                  </div>
                </form>
              ) : (
                <ArticleContent article={article as unknown as BlogArticle} />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <ArticleSidebar article={article as any} />

                {/* Article Metadata */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-3">
                    Article Information
                  </h3>
                  <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        article.isPublished 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {article.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ID:</span>
                      <code className="text-xs font-mono bg-zinc-200 dark:bg-zinc-700 px-1 rounded">
                        {article.id.slice(0, 8)}...
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span>Slug:</span>
                      <code className="text-xs font-mono bg-zinc-200 dark:bg-zinc-700 px-1 rounded">
                        {article.slug}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated:</span>
                      <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
