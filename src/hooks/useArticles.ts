import { useQuery } from "@tanstack/react-query";
import { BlogWithComments } from "@/types/blog-with-comments";

const fetchArticles = async () => {
  const articlesUrl =
    process.env.ENVIRONMENT! === "DEVELOPMENT"
      ? `/api/articles`
      : `api/articles`;

  const response = await fetch(articlesUrl);

  if (!response.ok) {
    throw new Error(`Failed to get articles info from ${articlesUrl} ...`);
  }

  return await response.json();
};

export const useArticles = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
    staleTime: 4,
  });

  const articles: BlogWithComments[] = data?.data! as BlogWithComments[];

  return { articles, error, isLoading };
};
