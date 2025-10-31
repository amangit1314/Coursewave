// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useArticle, useArticleBySlug } from "@/hooks/useArticles";
// import { Button } from "@/components/ui/button";
// import { Edit, Save, X, Eye } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useUpdateArticle } from "@/hooks/useArticles";
// import toast from "react-hot-toast";
// import { ArticleLoadingSkeleton } from "../_components/skeletons/article-loading-skeleton";
// import { ArticleContent } from "../_components/ArticleContent";
// import { ArticleSidebar } from "../_components/ArticleSidebar";
// import { BlogArticle } from "@/types";
// import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";

// export default function EditArticlePage() {
//   const { articleId } = useParams<{ articleId: string }>();
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);

//   const { data: article, isLoading, isError, error } = useArticle(articleId);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isDirty },
//     reset,
//   } = useForm({
//     defaultValues: {
//       title: article?.title || "",
//       content: article?.content || "",
//       excerpt: article?.excerpt || "",
//       estimatedReadingTime: article?.readTime || "",
//     },
//   });

//   const updateArticleMutation = useUpdateArticle();

//   // Reset form when article data loads
//   useEffect(() => {
//     if (article) {
//       reset({
//         title: article.title,
//         content: article.content,
//         excerpt: article.excerpt,
//         estimatedReadingTime: article.readTime,
//       });
//     }
//   }, [article, reset]);

//   const onSubmit = async (data: any) => {
//     try {
//       await updateArticleMutation.mutateAsync({
//         id: article?.id,
//         ...data,
//       });
//       toast.success("Article updated successfully!");
//       setIsEditing(false);
//     } catch (error) {
//       toast.error("Failed to update article");
//     }
//   };

//   const handleCancel = () => {
//     reset();
//     setIsEditing(false);
//   };

//   if (isLoading) {
//     return <ArticleLoadingSkeleton />;
//   }

//   if (isError || !article) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-center p-8">
//         <div>
//           <h1 className="text-2xl font-semibold text-red-500">
//             Article Not Found
//           </h1>
//           <p className="text-zinc-600 dark:text-zinc-300 mt-2">
//             We couldn't find the article you're looking for.
//           </p>
//           <p className="text-zinc-600 dark:text-zinc-300 mt-2">
//             Error: {error instanceof Error ? error.message : "Unknown error"}
//           </p>
//           <Button onClick={() => router.back()} className="mt-4">
//             Go Back
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
//       {/* Edit Mode Header */}
//       <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between py-4">
//             <div className="flex items-center gap-3">
//               <Button
//                 variant="ghost"
//                 onClick={() => router.back()}
//                 className="flex items-center gap-2"
//               >
//                 <svg
//                   width="16"
//                   height="16"
//                   viewBox="0 0 16 16"
//                   className="w-5 h-5"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M10 12L6 8L10 4"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//                 Back
//               </Button>
//               {/* <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" /> */}
//               {/* <h1 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
//                 Edit Mode
//               </h1> */}
//               <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full">
//                 Editing: {article.title}
//               </span>
//             </div>

//             <div className="flex items-center gap-3">
//               {!isEditing ? (
//                 <>
//                   <ThemeModeToggle />
//                   <Button
//                     onClick={() => setIsEditing(true)}
//                     className="flex items-center gap-2"
//                   >
//                     <Edit className="w-4 h-4" />
//                     Edit Article
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => router.push(`/articles/${article.slug}`)}
//                     className="flex items-center gap-2"
//                   >
//                     <Eye className="w-4 h-4" />
//                     View Published
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <Button
//                     onClick={handleSubmit(onSubmit)}
//                     disabled={updateArticleMutation.isPending || !isDirty}
//                     className="flex items-center gap-2"
//                   >
//                     <Save className="w-4 h-4" />
//                     {updateArticleMutation.isPending
//                       ? "Saving..."
//                       : "Save Changes"}
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={handleCancel}
//                     disabled={updateArticleMutation.isPending}
//                   >
//                     <X className="w-4 h-4" />
//                     Cancel
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="relative">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
//             {/* Content */}
//             <div className="lg:col-span-8">
//               {isEditing ? (
//                 <div className="space-y-6">
//                   {/* Title Input */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Title *
//                     </label>
//                     <input
//                       {...register("title", { required: "Title is required" })}
//                       className="w-full px-4 py-3 text-2xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800"
//                     />
//                     {errors.title && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.title.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Excerpt Input */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Excerpt
//                     </label>
//                     <textarea
//                       {...register("excerpt")}
//                       rows={3}
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800"
//                       placeholder="Brief description of your article..."
//                     />
//                   </div>

//                   {/* Content Input */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Content *
//                     </label>
//                     <textarea
//                       {...register("content", {
//                         required: "Content is required",
//                       })}
//                       rows={20}
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 font-mono text-sm"
//                     />
//                     {errors.content && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.content.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Reading Time Input */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Estimated Reading Time (minutes) *
//                     </label>
//                     <input
//                       {...register("estimatedReadingTime", {
//                         required: "Reading time is required",
//                         pattern: {
//                           value: /^[0-9]+$/,
//                           message: "Must be a number",
//                         },
//                       })}
//                       type="number"
//                       className="w-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800"
//                     />
//                     {errors.estimatedReadingTime && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.estimatedReadingTime.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <ArticleContent article={article as unknown as BlogArticle} /> /// todo: watch for types
//               )}
//             </div>

//             {/* Sidebar */}
//             <div className="lg:col-span-4">
//               <div className="sticky top-24">
//                 <ArticleSidebar article={article as any} />

//                 {/* Edit Sidebar Info */}
//                 <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
//                   <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
//                     Article Information
//                   </h3>
//                   <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
//                     <p>ID: {article.id}</p>
//                     <p>Slug: {article.slug}</p>
//                     <p>
//                       Created:{" "}
//                       {new Date(article.createdAt).toLocaleDateString()}
//                     </p>
//                     <p>
//                       Updated:{" "}
//                       {new Date(article.updatedAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


/// ===============================================================

"use client";

import { useParams, useRouter } from "next/navigation";
import { useArticle } from "@/hooks/useArticles";
import { Button } from "@/components/ui/button";
import { Edit, Save, X, Eye, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateArticle } from "@/hooks/useArticles";
import toast from "react-hot-toast";
import { ArticleLoadingSkeleton } from "../_components/skeletons/article-loading-skeleton";
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
