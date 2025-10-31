// src/hooks/useArticles.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { articleService } from "@/lib/api/services/articleService";
import { BlogArticle } from "@/types/blog-api-response";
import { userService } from "@/lib/api/services";
import { Blog } from "@/types/blog.service.types";
import { useQueries } from "@tanstack/react-query";

export const useArticles = () => {
  return useQuery<BlogArticle[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      console.log("🔄 Fetching articles...");
      const response = await articleService.getArticles();
      console.log("📦 Raw response from service:", response);
      console.log("📊 Response type:", typeof response);
      console.log("🔢 Response length:", response?.length);
      return response;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useCreatedArticles = () => {
  const fetchCreatedArticles = async () => {
    const articles = await userService.getCreatedArticles();
    console.log("Created articles response:", articles);
    return articles;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["createdArticles"],
    queryFn: fetchCreatedArticles,
    staleTime: 4,
  });

  return { data, isLoading, error };
};

export const useArticle = (articleId: string) => {
  const fetchCreatedArticles = async () => {
    const articles = (await userService.getCreatedArticles()) as Promise<
      BlogArticle[]
    >;
    console.log("Created articles response:", articles);
    return articles;
  };
  return useQuery<Blog>({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const response = await articleService.getArticleById(articleId);
      return response;
      // return Array.isArray(response?.data) ? response.data[0] : response.data;
    },
    enabled: !!articleId,
    staleTime: 1 * 60 * 1000, // 1 minutes
  });
};

export const useArticleBySlug = (slug: string) => {
  return useQuery<BlogArticle | null>({
    queryKey: ["article", slug],
    queryFn: async () => {
      const article = await articleService.getArticleBySlug(slug);
      console.log("Article fetched by slug:", article);
      return Array.isArray(article) ? article[0] : article || null;
    },
    enabled: !!slug,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      title: string;
      content: string;
      excerpt?: string;
      categoryIds?: string[];
      thumbnailUrl: string | null;
      estimatedReadingTime: string;
      authorId: string;
    }) => {
      // Process content to reduce size
      const processedPayload = {
        ...payload,
        content: processContent(payload.content),
      };

      console.log(
        "Processed payload for article creation:",
        JSON.stringify(processedPayload)
      );
      return articleService.createArticle(processedPayload);
    },
    onMutate: async (newArticle) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["articles"] });
      await queryClient.cancelQueries({ queryKey: ["createdArticles"] });

      // Store previous data
      const previousArticles = queryClient.getQueryData(["articles"]);
      const previousCreatedArticles = queryClient.getQueryData([
        "createdArticles",
      ]);

      return { previousArticles, previousCreatedArticles };
    },
    onError: (err, newArticle, context) => {
      // Rollback on error
      if (context?.previousArticles) {
        queryClient.setQueryData(["articles"], context.previousArticles);
      }
      if (context?.previousCreatedArticles) {
        queryClient.setQueryData(
          ["createdArticles"],
          context.previousCreatedArticles
        );
      }

      console.error("Error creating article:", err);
    },
    onSuccess: (createdArticle) => {
      // Optimistically add the new article to both queries
      queryClient.setQueryData(["articles"], (old: any) => {
        return old ? [createdArticle, ...old] : [createdArticle];
      });

      queryClient.setQueryData(["createdArticles"], (old: any) => {
        return old ? [createdArticle, ...old] : [createdArticle];
      });
    },
    onSettled: () => {
      // Invalidate both queries to ensure they're in sync
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["createdArticles"] });
    },
  });
};

// Helper function to process content
const processContent = (content: string): string => {
  // Remove large base64 images and replace with placeholders
  const processedContent = content.replace(
    /data:image\/(png|jpg|jpeg|gif);base64,[^"]+/g,
    "[IMAGE_REMOVED_FOR_UPLOAD]"
  );

  // Or compress the content
  return compressHTML(processedContent);
};

const compressHTML = (html: string): string => {
  return html
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/>\s+</g, "><") // Remove spaces between tags
    .trim();
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      id: string;
      title?: string;
      content?: string;
      excerpt?: string;
      coverImage?: string;
      readTime?: number;
      categoryId?: string;
      isPublished?: boolean;
      tags?: any;
    }) => {
      const { id, ...data } = payload;
      return articleService.updateArticle(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["article", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["createdArticles"] });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) => articleService.deleteArticle(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["savedArticles"] });
    },
  });
};

// ====================== ARTICLES LIKE HOOKS ======================

// export const useArticleLikeStatus = (articleId: string) => {
//   return useQuery({
//     queryKey: ["article-like-status", articleId],
//     queryFn: () => articleService.checkArticleLikeStatus(articleId),
//     enabled: !!articleId,
//   });
// };

export const useArticleLikeStatus = (articleId: string) => {
  return useQuery({
    queryKey: ["article-like-status", articleId],
    queryFn: async () => {
      try {
        const res = await articleService.checkArticleLikeStatus(articleId);

        // ✅ Always return a defined value
        // even when API returns undefined or null
        return res?.isLiked ?? false;
      } catch (error: any) {
        // ✅ Handle backend 404 or null responses gracefully
        if (error.response?.status === 404) return false;
        throw error; // Let React Query handle real errors
      }
    },
    enabled: !!articleId,
    staleTime: 0, // ensures fresh data on demand
    retry: false, // avoids infinite retries for 404
  });
};

export const useLikeUnlikeArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) =>
      articleService.likeUnlikeArticle(articleId),
    onSuccess: (_, articleId) => {
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};

// ====================== ARTICLE INTERACTION HOOKS ======================

// export const useIncrementArticleViewCount = (blogId: string, slug: string) => {
//   const queryClient = useQueryClient();

//   return useQuery({
//     queryKey: ["article-view", blogId],
//     queryFn: async () => {
//       const response = await articleService.incrementArticleView(blogId);
//       return response.data;
//     },
//     enabled: !!blogId,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     select: (data) => {
//       // Immediately update related caches so UI reflects the change right away
//       queryClient.setQueryData(["article", blogId], (old: any) => {
//         if (!old) return data;
//         const patch = typeof data === "object" && data !== null ? data : {};
//         return { ...old, ...patch };
//       });

//       // Patch by Slug (if provided)
//       if (slug) {
//         queryClient.setQueryData(["article", slug], (old: any) => {
//           if (!old) return data;
//           const patch = typeof data === "object" && data !== null ? data : {};
//           return { ...old, ...patch };
//         });
//       }

//       queryClient.setQueryData(["articles"], (old: any) => {
//         if (!Array.isArray(old)) return old;
//         const patch = typeof data === "object" && data !== null ? data : {};
//         return old.map((a: any) => (a.id === blogId ? { ...a, ...patch } : a));
//       });
//       return data;
//     },
//   });
// };

export const useIncrementArticleViewCount = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { viewCount: number },
    Error,
    { blogId: string; slug?: string }
  >({
    mutationFn: async ({ blogId }) => {
      const response = await articleService.incrementArticleView(blogId);
      return response.data;
    },
    onSuccess: (data, variables) => {
        const { blogId, slug } = variables as { blogId: string; slug?: string };
        queryClient.setQueryData(["article", blogId], (old: any) =>
          old ? { ...old, ...data } : data
        );
        if (slug) {
          queryClient.setQueryData(["article", slug], (old: any) =>
            old ? { ...old, ...data } : data
          );
        }
        queryClient.setQueryData(["articles"], (old: any) =>
          Array.isArray(old)
            ? old.map((a: any) => (a.id === blogId ? { ...a, ...data } : a))
            : old
        );
      },
    }
  );
};

export const useReportArticle = (blogId: string, reason: string) => {
  return useQuery({
    queryKey: ["article-report", blogId],
    queryFn: async () => {
      const response = await articleService.reportArticle(blogId, reason);
      return response;
    },
    enabled: !!blogId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useFollowUnfollowAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blogId: string) => articleService.followUnfollowAuthor(blogId),
    onSuccess: (response, blogId) => {
      // Access the data from the ApiResponse wrapper
      const data = response.data;

      // Invalidate all related queries
      queryClient.invalidateQueries({
        queryKey: ["author-following-status", blogId],
      });
      queryClient.invalidateQueries({ queryKey: ["author-followers", blogId] });
      queryClient.invalidateQueries({
        queryKey: ["author-follower-count", blogId],
      });
      queryClient.invalidateQueries({ queryKey: ["user-following"] });
      queryClient.invalidateQueries({ queryKey: ["user-following-count"] });

      // Update the cache optimistically if needed
      queryClient.setQueryData(["author-following-status", blogId], {
        isFollowing: data.isFollowing,
        authorId: data.author.id,
      });
    },
  });
};

export const useCheckFollowingStatus = (blogId: string) => {
  return useQuery({
    queryKey: ["author-following-status", blogId],
    queryFn: async () => {
      const response = await articleService.checkFollowingStatus(blogId);
      return response.data;
    },
    enabled: !!blogId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAuthorFollowers = (
  blogId: string,
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ["author-followers", blogId, page, limit],
    queryFn: async () => {
      const response = await articleService.getAuthorFollowers(
        blogId,
        page,
        limit
      );
      return response.data;
    },
    enabled: !!blogId,
    // keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
  });
};

export const useAuthorFollowerCount = (blogId: string) => {
  return useQuery({
    queryKey: ["author-follower-count", blogId],
    queryFn: async () => {
      const response = await articleService.getAuthorFollowerCount(blogId);
      return response.data;
    },
    enabled: !!blogId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUserFollowing = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ["user-following", page, limit],
    queryFn: async () => {
      const response = await articleService.getUserFollowing(page, limit);
      return response.data;
    },
    // keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUserFollowingCount = () => {
  return useQuery({
    queryKey: ["user-following-count"],
    queryFn: async () => {
      const response = await articleService.getUserFollowingCount();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

// ====================== COMMENT HOOKS ======================

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      articleId: string;
      content: string;
      authorId: string;
    }) => articleService.addArticleComment(payload.articleId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["article-comments", variables.articleId],
      });
    },
  });
};

export const useLikeUnlikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) =>
      articleService.likeUnlikeComment(commentId),
    onSuccess: (_, commentId) => {
      // Invalidate comments for all articles since comment IDs are unique
      queryClient.invalidateQueries({ queryKey: ["article-comments"] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => articleService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article-comments"] });
    },
  });
};

// ====================== SAVE ARTICLE HOOKS ======================

export const useArticlesData = () => {
  const results = useQueries({
    queries: [
      { queryKey: ["created-articles"], queryFn: useCreatedArticles },
      { queryKey: ["saved-articles"], queryFn: useSavedArticles },
    ],
  });

  const [createdQuery, savedQuery] = results;

  const isLoading = createdQuery.isLoading || savedQuery.isLoading;
  const isError = createdQuery.isError || savedQuery.isError;

  return {
    createdArticles: createdQuery.data ?? ([] as BlogArticle[]),
    savedArticles: savedQuery.data ?? ([] as BlogArticle[]),
    isLoading,
    isError,
    createdError: createdQuery.error,
    savedError: savedQuery.error,
  };
};

export const useSavedArticles = () => {
  const fetchSavedArticles = async () => {
    const articles = await articleService.getSavedArticles();
    console.log("Saved articles response:", articles);
    return articles;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["savedArticles"],
    queryFn: fetchSavedArticles,
    staleTime: 2 * 60 * 1000,
  });

  return { data, isLoading, error };
};

export const useCheckArticleSaved = (articleId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["article-saved-status", articleId],
    queryFn: async () => {
      try {
        const response = await articleService.checkArticleSaved(articleId);

        // ✅ Return a plain boolean for predictable state
        // Backend expected response shape: { isSaved: boolean }
        return Boolean(response?.data?.isSaved);
      } catch (error: any) {
        // ✅ Handle 'not saved' safely (404 = not found)
        if (error.response?.status === 404) {
          queryClient.setQueryData(["article-saved-status", articleId], false);
          return false;
        }
        throw error;
      }
    },
    enabled: !!articleId,
    staleTime: 0, // Always fresh
    retry: false,
  });
};

export const useSaveArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) => articleService.saveArticle(articleId),

    onMutate: async (articleId) => {
      await queryClient.cancelQueries({
        queryKey: ["article-saved-status", articleId],
      });

      const previousStatus = queryClient.getQueryData([
        "article-saved-status",
        articleId,
      ]);

      // Instant optimistic UI
      queryClient.setQueryData(["article-saved-status", articleId], true);

      return { previousStatus, articleId };
    },

    onError: (err, articleId, context) => {
      // Rollback if something failed
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(
          ["article-saved-status", articleId],
          context.previousStatus
        );
      }
    },

    onSuccess: (_, articleId) => {
      // ✅ Confirm UI state
      queryClient.setQueryData(["article-saved-status", articleId], true);

      // Update saved articles list
      queryClient.invalidateQueries({
        queryKey: ["savedArticles"],
      });
    },

    onSettled: (_, __, articleId) => {
      // ✅ Finalize sync
      queryClient.invalidateQueries({
        queryKey: ["article-saved-status", articleId],
      });
    },
  });
};

export const useUnsaveArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) =>
      articleService.removeSavedArticle(articleId),

    onMutate: async (articleId) => {
      // Stop concurrent refetches
      await queryClient.cancelQueries({
        queryKey: ["article-saved-status", articleId],
      });

      const previousStatus = queryClient.getQueryData([
        "article-saved-status",
        articleId,
      ]);

      // ✅ Instant UI feedback
      queryClient.setQueryData(["article-saved-status", articleId], false);

      return { previousStatus, articleId };
    },

    onError: (err, articleId, context) => {
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(
          ["article-saved-status", articleId],
          context.previousStatus
        );
      }
    },

    onSuccess: async (_, articleId) => {
      // ✅ Wait a bit to let backend finish removing
      await new Promise((r) => setTimeout(r, 300));

      queryClient.invalidateQueries({
        queryKey: ["article-saved-status", articleId],
        refetchType: "active",
      });

      queryClient.invalidateQueries({
        queryKey: ["savedArticles"],
      });
    },
  });
};

// ====================== CATEGORY & SEARCH HOOKS ======================

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await articleService.getCategories();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useArticlesByCategory = (categorySlug: string, params?: any) => {
  return useQuery({
    queryKey: ["articles-by-category", categorySlug, params],
    queryFn: async () => {
      const response = await articleService.getArticlesByCategory(
        categorySlug,
        params
      );
      return response;
    },
    enabled: !!categorySlug,
    staleTime: 2 * 60 * 1000,
  });
};

export const useArticlesByAuthor = (authorId: string, params?: any) => {
  return useQuery({
    queryKey: ["articles-by-author", authorId, params],
    queryFn: async () => {
      const response = await articleService.getArticlesByAuthor(
        authorId,
        params
      );
      return response;
    },
    enabled: !!authorId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useSearchArticles = (query: string, params?: any) => {
  return useQuery({
    queryKey: ["search-articles", query, params],
    queryFn: async () => {
      const response = await articleService.searchArticles(query, params);
      return response;
    },
    enabled: !!query,
    staleTime: 2 * 60 * 1000,
  });
};

// ====================== MY ARTICLES HOOKS ======================

export const useMyArticles = () => {
  return useQuery({
    queryKey: ["my-articles"],
    queryFn: async () => {
      const response = await articleService.getMyArticles();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
};
