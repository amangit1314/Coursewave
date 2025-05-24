import { useQuery } from "@tanstack/react-query";
// import { absoluteUrl } from "../utils/utils";
// import { Blog } from "@prisma/client";

export const useArticleInfo = (articleId: string) => {
  const fetchArticleInfo = async () => {
    const articleUrl =
      process.env.ENVIRONMENT! === "DEVELOPMENT"
        ? `/api/articles/${articleId}`
        : `api/articles/${articleId}`;

    const response = await fetch(`/api/articles/${articleId}`);

    if (!response.ok) {
      throw new Error(`Failed to get article info from ${articleUrl} ...`);
    }

    return await response.json();
  };

  // const { data, error, isLoading } =
  return useQuery({
    queryKey: ["article", articleId],
    queryFn: fetchArticleInfo,
    staleTime: 4,
  });

  // const article: Blog = data?.data! as Blog;

  // return { article, error, isLoading };
};
