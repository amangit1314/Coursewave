// hooks/useArticleById.ts
import { useQuery } from "@tanstack/react-query";
import { articleService } from "@/lib/api/services/articlesService";
import { BlogArticle } from "@/types/blog-api-response";

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
