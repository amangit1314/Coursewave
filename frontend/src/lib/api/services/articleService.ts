import {
  Blog,
  BlogCategory,
  BlogComment,
  BlogQueryParams,
  CreateBlogRequest,
  CreateCommentRequest,
  Reaction,
  UpdateBlogRequest,
} from "@/types/blog.service.types";
import { BlogArticle } from "@/types/blog-api-response";
import { apiManager, ApiResponse, PaginatedResponse } from "../api-manager";

class ArticleService {
  private static instance: ArticleService;
  private api = apiManager;

  private constructor() { }

  public static getInstance(): ArticleService {
    if (!ArticleService.instance) {
      ArticleService.instance = new ArticleService();
    }
    return ArticleService.instance;
  }

  private buildQueryString(params?: Record<string, any>): string {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return queryParams.toString();
  }

  // ====================== ARTICLES ======================
  async getArticles(params?: BlogQueryParams): Promise<BlogArticle[]> {
    try {
      const query = this.buildQueryString(params);
      console.log("🔍 Making API request to /blogs");

      const response = await this.api.get<any>(
        `/blogs${query ? `?${query}` : ""}`
      );

      console.log("📦 Full response:", response);
      console.log("🎯 Response data:", response.data);

      // The response.data is already the array, so return it directly
      if (Array.isArray(response.data)) {
        console.log("✅ Successfully got articles array");
        return response.data;
      } else {
        console.error("❌ Expected array but got:", typeof response.data);
        throw new Error("Expected array of articles");
      }
    } catch (error) {
      console.error("🚨 Service error:", error);
      throw error;
    }
  }

  async getArticleById(id: string): Promise<Blog> {
    const res = await this.api.get<Blog>(`/blogs/${id}`);
    return res.data;
  }

  async getArticleBySlug(slug: string): Promise<Blog> {
    const res = await this.api.get<Blog>(`/blogs/slug/${slug}`);
    return res.data;
  }

  async createArticle(data: CreateBlogRequest): Promise<ApiResponse<Blog>> {
    return this.api.post<Blog>("/blogs", data);
  }

  async updateArticle(
    id: string,
    data: UpdateBlogRequest
  ): Promise<ApiResponse<Blog>> {
    return this.api.put<Blog>(`/blogs/${id}`, data);
  }

  async deleteArticle(id: string): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/blogs/${id}`);
  }

  // ====================== ARTICLE INTERACTIONS ======================
  async likeUnlikeArticle(
    articleId: string
  ): Promise<ApiResponse<{ liked: boolean }>> {
    return this.api.post<{ liked: boolean }>(`/blogs/${articleId}/like`);
  }

  // ====================== AUTHOR FOLLOW ======================

  async checkArticleLikeStatus(
    articleId: string
  ): Promise<{ isLiked: boolean }> {
    const response = await apiManager.get(`/blogs/${articleId}/like-status`);
    // ✅ Defensive return for missing/malformed payloads
    return response?.data ?? { isLiked: false };
  }

  async followUnfollowAuthor(blogId: string): Promise<
    ApiResponse<{
      action: "followed" | "unfollowed";
      author: { id: string; name: string; email: string };
      followerCount: number;
      followingCount: number;
      isFollowing: boolean;
    }>
  > {
    return this.api.post<{
      action: "followed" | "unfollowed";
      author: { id: string; name: string; email: string };
      followerCount: number;
      followingCount: number;
      isFollowing: boolean;
    }>(`/blogs/${blogId}/author/follow`);
  }

  async checkFollowingStatus(blogId: string): Promise<
    ApiResponse<{
      isFollowing: boolean;
      authorId: string;
    }>
  > {
    return this.api.get<{
      isFollowing: boolean;
      authorId: string;
    }>(`/blogs/${blogId}/author/following-status`);
  }

  async getAuthorFollowers(
    blogId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<
    ApiResponse<{
      followers: Array<{
        id: string;
        name: string;
        email: string;
        profileImageUrl: string;
        about: string;
        slug: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>
  > {
    const query = this.buildQueryString({ page, limit });
    return this.api.get<{
      followers: Array<{
        id: string;
        name: string;
        email: string;
        profileImageUrl: string;
        about: string;
        slug: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/blogs/${blogId}/author/followers${query ? `?${query}` : ""}`);
  }

  async getAuthorFollowerCount(blogId: string): Promise<
    ApiResponse<{
      followerCount: number;
      authorId: string;
    }>
  > {
    return this.api.get<{
      followerCount: number;
      authorId: string;
    }>(`/blogs/${blogId}/author/follower-count`);
  }

  async getUserFollowing(
    page: number = 1,
    limit: number = 20
  ): Promise<
    ApiResponse<{
      following: Array<{
        id: string;
        name: string;
        email: string;
        profileImageUrl: string;
        about: string;
        slug: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>
  > {
    const query = this.buildQueryString({ page, limit });
    return this.api.get<{
      following: Array<{
        id: string;
        name: string;
        email: string;
        profileImageUrl: string;
        about: string;
        slug: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/blogs/user/following/list${query ? `?${query}` : ""}`);
  }

  async getUserFollowingCount(): Promise<
    ApiResponse<{
      followingCount: number;
    }>
  > {
    return this.api.get<{
      followingCount: number;
    }>("/blogs/user/following/count");
  }

  // ====================== ARTICLE COMMENTS ======================
  async addArticleComment(
    articleId: string,
    comment: CreateCommentRequest
  ): Promise<ApiResponse<BlogComment>> {
    return this.api.post<BlogComment>(`/blogs/${articleId}/comments`, comment);
  }

  async likeUnlikeComment(
    commentId: string
  ): Promise<ApiResponse<{ liked: boolean }>> {
    return this.api.post<{ liked: boolean }>(
      `/blogs/comments/${commentId}/like`
    );
  }

  async deleteComment(commentId: string): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/blogs/comments/${commentId}`);
  }

  // ====================== SAVED ARTICLES ======================
  async getSavedArticles(): Promise<ApiResponse<any>> {
    return this.api.get<BlogArticle[]>("/users/articles/saved");
  }

  async saveArticle(articleId: string): Promise<ApiResponse<void>> {
    return this.api.post<void>(`/users/articles/saved/${articleId}`);
  }

  async removeSavedArticle(articleId: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete<void>(
      `/users/articles/saved/${articleId}`
    );
    console.log("Removed saved article response:", JSON.stringify(response));
    return response;
  }

  async checkArticleSaved(
    articleId: string
  ): Promise<ApiResponse<{ isSaved: boolean }>> {
    // If you have a specific check endpoint, use it, otherwise you can check from the saved articles list
    return this.api.get<{ isSaved: boolean }>(
      `/users/articles/saved/${articleId}/check`
    );
    // OR if you don't have a specific check endpoint, you can implement it like this:
    // const savedArticles = await this.getSavedArticles();
    // const isSaved = savedArticles.data.some(article => article.id === articleId);
    // return { data: { isSaved }, success: true };
  }

  // ====================== CATEGORIES & SEARCH ======================
  async getCategories(): Promise<ApiResponse<BlogCategory[]>> {
    return this.api.get<BlogCategory[]>("/blogs/categories");
  }

  async searchArticles(
    query: string,
    params?: BlogQueryParams
  ): Promise<PaginatedResponse<Blog>> {
    const queryString = this.buildQueryString({ q: query, ...params });
    const response = await this.api.get<PaginatedResponse<Blog>>(
      `/blogs/search?${queryString}`
    );
    return response.data;
  }

  // ====================== AUTHOR ARTICLES ======================
  async getArticlesByAuthor(
    authorId: string,
    params?: BlogQueryParams
  ): Promise<PaginatedResponse<Blog>> {
    const query = this.buildQueryString(params);
    const response = await this.api.get<PaginatedResponse<Blog>>(
      `/blogs/author/${authorId}${query ? `?${query}` : ""}`
    );
    return response.data;
  }

  async getMyArticles(): Promise<ApiResponse<Blog[]>> {
    return this.api.get<Blog[]>("/blogs/author");
  }

  // ====================== CATEGORY ARTICLES ======================
  async getArticlesByCategory(
    categorySlug: string,
    params?: BlogQueryParams
  ): Promise<PaginatedResponse<Blog>> {
    const query = this.buildQueryString(params);
    const response = await this.api.get<PaginatedResponse<Blog>>(
      `/blogs/category/${categorySlug}${query ? `?${query}` : ""}`
    );
    return response.data;
  }

  async reportArticle(
    articleId: string,
    reason: string
  ): Promise<ApiResponse<{ reported: boolean }>> {
    return this.api.post<{ reported: boolean }>(`/blogs/${articleId}/report`, {
      reason,
    });
  }

  // async incrementArticleView(id: string): Promise<ApiResponse<void>> {
  //   return this.api.post<void>(`/blogs/${id}/view`);
  // }

  async incrementArticleView(
    id: string
  ): Promise<ApiResponse<{ viewCount: number }>> {
    return this.api.post<{ viewCount: number }>(`/blogs/${id}/view`);
  }

  /// <====================== COMMENTS & REACTIONS ======================>

  // async getArticleComments(articleId: string): Promise<ApiResponse<BlogComment[]>> {
  //   return this.api.get<BlogComment[]>(`/blogs/${articleId}/comments`);
  // }

  // async updateArticleComment(
  //   articleId: string,
  //   commentId: string,
  //   content: string
  // ): Promise<ApiResponse<BlogComment>> {
  //   return this.api.put<BlogComment>(
  //     `/blogs/${articleId}/comments/${commentId}`,
  //     { content }
  //   );
  // }

  // async deleteArticleComment(
  //   articleId: string,
  //   commentId: string
  // ): Promise<ApiResponse<void>> {
  //   return this.api.delete<void>(`/blogs/${articleId}/comments/${commentId}`);
  // }

  // async addArticleReaction(
  //   articleId: string,
  //   type: Reaction["type"]
  // ): Promise<ApiResponse<Reaction>> {
  //   return this.api.post<Reaction>(`/blogs/${articleId}/reactions`, { type });
  // }

  // async removeArticleReaction(articleId: string): Promise<ApiResponse<void>> {
  //   return this.api.delete<void>(`/blogs/${articleId}/reactions`);
  // }

  // async addCommentReaction(
  //   commentId: string,
  //   type: Reaction["type"]
  // ): Promise<ApiResponse<Reaction>> {
  //   return this.api.post<Reaction>(`/comments/${commentId}/reactions`, {
  //     type,
  //   });
  // }

  // async removeCommentReaction(commentId: string): Promise<ApiResponse<void>> {
  //   return this.api.delete<void>(`/comments/${commentId}/reactions`);
  // }

  /// <====================== DEPRECATED/REMOVED METHODS ======================>
  // These methods don't have corresponding routes in your backend

  // async getArticleById(id: string): Promise<ApiResponse<Blog>> {
  //   return this.api.get<Blog>(`/blogs/${id}`);
  // }

  // async publishArticle(id: string): Promise<ApiResponse<Blog>> {
  //   return this.api.patch<Blog>(`/blogs/${id}/publish`);
  // }

  // async unpublishArticle(id: string): Promise<ApiResponse<Blog>> {
  //   return this.api.patch<Blog>(`/blogs/${id}/unpublish`);
  // }

  // async getTrendingArticles(limit: number = 10): Promise<ApiResponse<Blog[]>> {
  //   return this.api.get<Blog[]>(`/blogs/trending?limit=${limit}`);
  // }

  // async getPopularArticles(limit: number = 10): Promise<ApiResponse<Blog[]>> {
  //   return this.api.get<Blog[]>(`/blogs/popular?limit=${limit}`);
  // }

  // async uploadArticleCoverImage(
  //   articleId: string,
  //   file: File,
  //   onProgress?: (progress: number) => void
  // ): Promise<ApiResponse<{ coverImage: string }>> {
  //   return this.api.upload<{ coverImage: string }>(
  //     `/blogs/${articleId}/cover`,
  //     file,
  //     onProgress
  //   );
  // }
}

export const articleService = ArticleService.getInstance();
