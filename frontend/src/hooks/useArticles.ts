// src/hooks/useArticles.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { articleService } from "@/lib/api/services/articleService";
import { BlogArticle } from "@/types/blog-api-response";
import { userService } from "@/lib/api/services";

export const useArticles = () => {
  return useQuery<BlogArticle[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      const response = await articleService.getArticles();
      return response.data || [];
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

export const useSavedArticles = () => {
  const fetchSavedArticles = async () => {
    const articles = await articleService.getSavedArticles();
    console.log("Saved articles response:", articles);
    return articles;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["savedArticles"],
    queryFn: fetchSavedArticles,
    staleTime: 4,
  });

  return { data, isLoading, error };
};

export const useArticle = (articleId: string) => {
  return useQuery<BlogArticle>({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const response = await articleService.getArticleById(articleId);
      return Array.isArray(response?.data) ? response.data[0] : response.data;
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
    mutationFn: (payload: {
      title: string;
      content: string;
      excerpt?: string;
      categoryIds?: string[];
      thumbnailUrl: string | null;
      estimatedReadingTime: string;
      authorId: string;
      isPublished?: boolean;
    }) => articleService.createArticle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};

//todo: edit Article, delete article
export const useArticleComments = (articleId: string) => {
  return useQuery({
    queryKey: ["article-comments", articleId],
    queryFn: async () => {
      const response = await articleService.getArticleComments(articleId);
      return response?.data || [];
    },
    enabled: !!articleId,
  });
};

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
