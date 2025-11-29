import { apiManager, ApiResponse } from "../api-manager";

class RatingService {
    private static instance: RatingService;
    private api = apiManager;

    private constructor() { }

    public static getInstance(): RatingService {
        if (!RatingService.instance) {
            RatingService.instance = new RatingService();
        }
        return RatingService.instance;
    }

    // ====================== ARTICLE RATING ======================
    async rateArticle(
        articleId: string,
        rating: number
    ): Promise<ApiResponse<{ rating: number }>> {
        return this.api.post<{ rating: number }>(`/blogs/${articleId}/rate`, {
            rating,
        });
    }

    async getUserRating(
        articleId: string
    ): Promise<ApiResponse<{ rating: number | null }>> {
        return this.api.get<{ rating: number | null }>(
            `/blogs/${articleId}/rating/user`
        );
    }

    async getAverageRating(articleId: string): Promise<
        ApiResponse<{
            average: number;
            count: number;
            distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
        }>
    > {
        return this.api.get<{
            average: number;
            count: number;
            distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
        }>(`/blogs/${articleId}/rating/average`);
    }
}

export const ratingService = RatingService.getInstance();
