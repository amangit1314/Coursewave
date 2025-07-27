import { useQuery } from "@tanstack/react-query";
import { BlogWithComments } from "@/types/blog-with-comments";
import { articleService } from "@/lib/api/articles";
import { BlogArticle } from "@/types/blog-api-response";

const fetchArticles = async () => {
  // const articlesUrl =
  //   process.env.ENVIRONMENT! === "DEVELOPMENT"
  //     ? `/api/articles`
  //     : `api/articles`;

  // const response = await fetch(articlesUrl);

  // if (!response.ok) {
  //   throw new Error(`Failed to get articles info from ${articlesUrl} ...`);
  // }

  // return await response.json();

   const data = await articleService.getArticles();

   return data;
};

export const useArticles = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
    staleTime: 4,
  });

  const articles: BlogArticle[] = data?.data! as BlogArticle[];

  return { articles, error, isLoading };
};
