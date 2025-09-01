import { articleService } from "@/lib/api/services";
import { useQuery } from "@tanstack/react-query";

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
