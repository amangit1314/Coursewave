import { useQuery } from "@tanstack/react-query";
import { authorService } from "@/lib/api/services/authorService";

export const useAuthorProfile = (authorId: string) => {
    return useQuery({
        queryKey: ["author", authorId],
        queryFn: async () => {
            const response = await authorService.getAuthorById(authorId);
            return response.data;
        },
        enabled: !!authorId,
    });
};

export const useAuthorArticles = (authorId: string) => {
    return useQuery({
        queryKey: ["author", authorId, "articles"],
        queryFn: async () => {
            const response = await authorService.getAuthorArticles(authorId);
            return response.data;
        },
        enabled: !!authorId,
    });
};

export const useAuthorCourses = (authorId: string) => {
    return useQuery({
        queryKey: ["author", authorId, "courses"],
        queryFn: async () => {
            const response = await authorService.getAuthorCourses(authorId);
            return response.data;
        },
        enabled: !!authorId,
    });
};
