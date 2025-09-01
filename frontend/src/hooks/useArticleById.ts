// hooks/useArticleById.ts
import { useQuery } from "@tanstack/react-query";
import { articleService } from "@/lib/api/services/articlesService";
import { BlogArticle } from "@/types/blog-api-response";

export const useArticleById = (articleId: string) => {
  return useQuery<BlogArticle | null>({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const response = await articleService.getArticleById(articleId);
      const article = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      return article || null;
    },
    enabled: !!articleId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};
