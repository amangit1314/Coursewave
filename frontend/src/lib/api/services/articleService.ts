/**
 * ------------------------------------------------------------------------------------------------------------
 */

// import { Blog, CreateBlogRequest, UpdateBlogRequest } from "@/types/blog.service.types";
// import  { apiManager, ApiResponse, PaginatedResponse } from "../api-manager";

// class ArticleService {
//   private static instance: ArticleService;
//   private api = apiManager;

//   private constructor() {}

//   public static getInstance(): ArticleService {
//     if (!ArticleService.instance) {
//       ArticleService.instance = new ArticleService();
//     }
//     return ArticleService.instance;
//   }

//   async getArticles(params?: Record<string, any>): Promise<PaginatedResponse<Blog>> {
//     const query = new URLSearchParams(params as any).toString();
//     return this.api.get<Blog[]>(`/blogs${query ? `?${query}` : ""}`);
//   }

//   async getArticleById(id: string): Promise<ApiResponse<Blog>> {
//     return this.api.get<Blog>(`/blogs/${id}`);
//   }

//   async createArticle(data: CreateBlogRequest): Promise<ApiResponse<Blog>> {
//     return this.api.post<Blog>("/blogs", data);
//   }

//   async updateArticle(id: string, data: UpdateBlogRequest): Promise<ApiResponse<Blog>> {
//     return this.api.put<Blog>(`/blogs/${id}`, data);
//   }

//   async deleteArticle(id: string): Promise<ApiResponse<void>> {
//     return this.api.delete<void>(`/blogs/${id}`);
//   }
// }

// export const articleService = ArticleService.getInstance();

/**
 * -----------------------------------------------------------------------------------------------------
 */

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

  private constructor() {}

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
  async getArticles(
    params?: BlogQueryParams
  ): Promise<PaginatedResponse<BlogArticle>> {
    const query = this.buildQueryString(params);
    const response = await this.api.get<PaginatedResponse<BlogArticle>>(
      `/blogs${query ? `?${query}` : ""}`
    );
    return response.data;
  }

  async getArticleById(id: string): Promise<ApiResponse<Blog>> {
    return this.api.get<Blog>(`/blogs/${id}`);
  }

  async getArticleBySlug(slug: string): Promise<ApiResponse<Blog>> {
    return this.api.get<Blog>(`/blogs/slug/${slug}`);
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

  async publishArticle(id: string): Promise<ApiResponse<Blog>> {
    return this.api.patch<Blog>(`/blogs/${id}/publish`);
  }

  async unpublishArticle(id: string): Promise<ApiResponse<Blog>> {
    return this.api.patch<Blog>(`/blogs/${id}/unpublish`);
  }

  async incrementArticleView(id: string): Promise<ApiResponse<void>> {
    return this.api.post<void>(`/blogs/${id}/view`);
  }

  async getTrendingArticles(limit: number = 10): Promise<ApiResponse<Blog[]>> {
    return this.api.get<Blog[]>(`/blogs/trending?limit=${limit}`);
  }

  async getPopularArticles(limit: number = 10): Promise<ApiResponse<Blog[]>> {
    return this.api.get<Blog[]>(`/blogs/popular?limit=${limit}`);
  }

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

  // ====================== SAVED ARTICLES ======================
  async getSavedArticles(): Promise<ApiResponse<BlogArticle[]>> {
    return this.api.get<BlogArticle[]>("/profile/savedArticles");
  }

  async saveArticle(articleId: string): Promise<ApiResponse<void>> {
    return this.api.post<void>(`/profile/savedArticles/${articleId}`);
  }

  async removeSavedArticle(articleId: string): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/profile/savedArticles/${articleId}`);
  }

  async checkArticleSaved(
    articleId: string
  ): Promise<ApiResponse<{ isSaved: boolean }>> {
    return this.api.get<{ isSaved: boolean }>(
      `/profile/savedArticles/${articleId}/check`
    );
  }

  // ====================== ARTICLE COMMENTS ======================
  async getArticleComments(
    articleId: string
  ): Promise<ApiResponse<BlogComment[]>> {
    return this.api.get<BlogComment[]>(`/blogs/${articleId}/comments`);
  }

  async addArticleComment(
    articleId: string,
    comment: CreateCommentRequest
  ): Promise<ApiResponse<BlogComment>> {
    return this.api.post<BlogComment>(`/blogs/${articleId}/comments`, comment);
  }

  async updateArticleComment(
    articleId: string,
    commentId: string,
    content: string
  ): Promise<ApiResponse<BlogComment>> {
    return this.api.put<BlogComment>(
      `/blogs/${articleId}/comments/${commentId}`,
      { content }
    );
  }

  async deleteArticleComment(
    articleId: string,
    commentId: string
  ): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/blogs/${articleId}/comments/${commentId}`);
  }

  // ====================== REACTIONS ======================
  async addArticleReaction(
    articleId: string,
    type: Reaction["type"]
  ): Promise<ApiResponse<Reaction>> {
    return this.api.post<Reaction>(`/blogs/${articleId}/reactions`, { type });
  }

  async removeArticleReaction(articleId: string): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/blogs/${articleId}/reactions`);
  }

  async addCommentReaction(
    commentId: string,
    type: Reaction["type"]
  ): Promise<ApiResponse<Reaction>> {
    return this.api.post<Reaction>(`/comments/${commentId}/reactions`, {
      type,
    });
  }

  async removeCommentReaction(commentId: string): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/comments/${commentId}/reactions`);
  }

  // ====================== COVER IMAGE ======================
  async uploadArticleCoverImage(
    articleId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ coverImage: string }>> {
    return this.api.upload<{ coverImage: string }>(
      `/blogs/${articleId}/cover`,
      file,
      onProgress
    );
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
}

export const articleService = ArticleService.getInstance();
