import { useQuery } from "@tanstack/react-query";
import { absoluteUrl } from "../utils/utils";
import { Blog } from "@prisma/client";

const useArticleInfo = (articleId: string) => {
  const fetchArticleInfo = async () => {
    const articleUrl = `/api/articles/${articleId}`;
    const response = await fetch(`/api/articles/${articleId}`);

    if (!response.ok) {
      throw new Error(`Failed to get article info from ${articleUrl} ...`);
    }

    return await response.json();
  }

  // const { data, error, isLoading } =
   return useQuery({
    queryKey: ["article", articleId],
    queryFn: fetchArticleInfo,
    staleTime: 4,
  });

  // const article: Blog = data?.data!;

  // return { article, error, isLoading };
};

export default useArticleInfo;