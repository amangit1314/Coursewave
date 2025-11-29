import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ratingService } from "@/lib/api/services/ratingService";
import { toast } from "sonner";

// Rate an article
export const useRateArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ blogId, rating }: { blogId: string; rating: number }) =>
            ratingService.rateArticle(blogId, rating),
        onSuccess: (_, { blogId }) => {
            // Invalidate rating queries
            queryClient.invalidateQueries({ queryKey: ["rating", "user", blogId] });
            queryClient.invalidateQueries({ queryKey: ["rating", "average", blogId] });
            toast.success("Article rated successfully!");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to rate article");
        },
    });
};

// Get user's rating for an article
export const useGetUserRating = (blogId: string) => {
    return useQuery({
        queryKey: ["rating", "user", blogId],
        queryFn: async () => {
            const response = await ratingService.getUserRating(blogId);
            return response.data.rating;
        },
        enabled: !!blogId,
    });
};

// Get average rating for an article
export const useGetAverageRating = (blogId: string) => {
    return useQuery({
        queryKey: ["rating", "average", blogId],
        queryFn: async () => {
            const response = await ratingService.getAverageRating(blogId);
            return response.data;
        },
        enabled: !!blogId,
    });
};
