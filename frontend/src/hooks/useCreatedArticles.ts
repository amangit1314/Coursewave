import { userService } from "@/lib/api/services";
import { useQuery } from "@tanstack/react-query";

export const useCreatedArticles = () => {
  const fetchCreatedArticles = async () => {
    const articles = await userService.getCreatedArticles();
    console.log("Created articles response:", articles);
    return articles;
  };

  const {data, isLoading, error} =  useQuery({
    queryKey: ["createdArticles"],
    queryFn: fetchCreatedArticles,
    staleTime: 4,
  });

  return { data, isLoading, error };
};
