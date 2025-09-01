import { useQuery } from "@tanstack/react-query";
import { articleService } from "@/lib/api/services/articlesService";
import { BlogArticle } from "@/types/blog-api-response";
export const useArticles = () => {
  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const response = await articleService.getArticles();
      console.log("API Response:", response); // Still keep for confirmation
      return response || [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
  });

  return { data, error, isLoading, isFetching, refetch, isError };
};
