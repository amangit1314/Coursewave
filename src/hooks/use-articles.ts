import { useQuery } from "@tanstack/react-query";
import { absoluteUrl } from "../utils/utils";
import { Blog } from "@prisma/client";


const useArticles = () => {
    type BlogComment = {
        id: string;
        blogId: string;
        content: string;
        authorId: string;
        writtenOn: Date | null;
        editedOn: Date | null;
      };
      
      type BlogWithComments = {
        id: string;
        title: string;
        shortDescription: string | null;
        content: string;
        estimatedReadingTime: string;
        clapsCount: number;
        authorId: string;
        categoryName: string | null;
        comments: BlogComment[];
        thumbnailUrl: string | null;
        isRecommended: boolean;
        createdAt: Date | null;
        updatedAt: Date | null;
      };

    const fetchArticles = async ()  => {
        const articlesUrl = (`/api/articles`);
        const response = await fetch(articlesUrl);

        if (!response.ok) {
            throw new Error(`Failed to get articles info from ${articlesUrl} ...`);
        }

        return await response.json();
    };

    const { data, error, isLoading } = useQuery({
        queryKey: ["articles"],
        queryFn: fetchArticles,
        staleTime: 4,
    });

    const articles: BlogWithComments[] = data?.data;

    return { articles, error, isLoading };
};

export default useArticles;