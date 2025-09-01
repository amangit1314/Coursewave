import { apiManager, ApiResponse, PaginatedResponse } from '../api-manager';

// Types
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  readTime?: number;
  isPublished: boolean;
  publishedAt?: string;
  author: {
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
  };
  authorId: string;
  categories: BlogCategory[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  comments: BlogComment[];
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface BlogComment {
  id: string;
  content: string;
  blogId: string;
  authorId: string;
  parentId?: string;
  author: {
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
  };
  parent?: BlogComment;
  replies: BlogComment[];
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
}

export interface Reaction {
  id: string;
  userId: string;
  type: 'LIKE' | 'LOVE' | 'INSIGHTFUL' | 'HELPFUL';
  blogId?: string;
  commentId?: string;
  lessonId?: string;
  user: {
    id: string;
    name: string;
    profileImageUrl?: string;
  };
  createdAt: string;
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  author?: string;
  sortBy?: 'newest' | 'popular' | 'trending';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  excerpt?: string;
  categoryIds: string[];
  isPublished?: boolean;
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {
  coverImage?: string;
}

export interface CreateCommentRequest {
  content: string;
  parentId?: string;
}

// Blog Service Class
export class BlogService {
  private static instance: BlogService;

  private constructor() {}

  public static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
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

  async getBlogs(params?: BlogQueryParams): Promise<PaginatedResponse<Blog>> {
    const query = this.buildQueryString(params);
    return await apiManager.get<Blog[]>(`/blogs${query ? `?${query}` : ''}`);
  }

  async getBlogById(blogId: string): Promise<ApiResponse<Blog>> {
    return await apiManager.get<Blog>(`/blogs/${blogId}`);
  }

  async getBlogBySlug(slug: string): Promise<ApiResponse<Blog>> {
    return await apiManager.get<Blog>(`/blogs/slug/${slug}`);
  }

  async getBlogComments(blogId: string): Promise<ApiResponse<BlogComment[]>> {
    return await apiManager.get<BlogComment[]>(`/blogs/${blogId}/comments`);
  }

  async addBlogComment(blogId: string, comment: CreateCommentRequest): Promise<ApiResponse<BlogComment>> {
    return await apiManager.post<BlogComment>(`/blogs/${blogId}/comments`, comment);
  }

  async updateBlogComment(blogId: string, commentId: string, content: string): Promise<ApiResponse<BlogComment>> {
    return await apiManager.put<BlogComment>(`/blogs/${blogId}/comments/${commentId}`, { content });
  }

  async deleteBlogComment(blogId: string, commentId: string): Promise<ApiResponse<void>> {
    return await apiManager.delete<void>(`/blogs/${blogId}/comments/${commentId}`);
  }

  async addBlogReaction(blogId: string, type: Reaction['type']): Promise<ApiResponse<Reaction>> {
    return await apiManager.post<Reaction>(`/blogs/${blogId}/reactions`, { type });
  }

  async removeBlogReaction(blogId: string): Promise<ApiResponse<void>> {
    return await apiManager.delete<void>(`/blogs/${blogId}/reactions`);
  }

  async addCommentReaction(commentId: string, type: Reaction['type']): Promise<ApiResponse<Reaction>> {
    return await apiManager.post<Reaction>(`/comments/${commentId}/reactions`, { type });
  }

  async removeCommentReaction(commentId: string): Promise<ApiResponse<void>> {
    return await apiManager.delete<void>(`/comments/${commentId}/reactions`);
  }

  async incrementBlogView(blogId: string): Promise<ApiResponse<void>> {
    return await apiManager.post<void>(`/blogs/${blogId}/view`);
  }

  async getBlogCategories(): Promise<ApiResponse<BlogCategory[]>> {
    return await apiManager.get<BlogCategory[]>('/blogs/categories');
  }

  async getTrendingBlogs(limit: number = 10): Promise<ApiResponse<Blog[]>> {
    return await apiManager.get<Blog[]>(`/blogs/trending?limit=${limit}`);
  }

  async getPopularBlogs(limit: number = 10): Promise<ApiResponse<Blog[]>> {
    return await apiManager.get<Blog[]>(`/blogs/popular?limit=${limit}`);
  }

  async getBlogsByAuthor(authorId: string, params?: BlogQueryParams): Promise<PaginatedResponse<Blog>> {
    const query = this.buildQueryString(params);
    return await apiManager.get<Blog[]>(`/blogs/author/${authorId}${query ? `?${query}` : ''}`);
  }

  async getBlogsByCategory(categorySlug: string, params?: BlogQueryParams): Promise<PaginatedResponse<Blog>> {
    const query = this.buildQueryString(params);
    return await apiManager.get<Blog[]>(`/blogs/category/${categorySlug}${query ? `?${query}` : ''}`);
  }

  async createBlog(blogData: CreateBlogRequest): Promise<ApiResponse<Blog>> {
    return await apiManager.post<Blog>('/blogs', blogData);
  }

  async updateBlog(blogId: string, blogData: UpdateBlogRequest): Promise<ApiResponse<Blog>> {
    return await apiManager.put<Blog>(`/blogs/${blogId}`, blogData);
  }

  async deleteBlog(blogId: string): Promise<ApiResponse<void>> {
    return await apiManager.delete<void>(`/blogs/${blogId}`);
  }

  async publishBlog(blogId: string): Promise<ApiResponse<Blog>> {
    return await apiManager.patch<Blog>(`/blogs/${blogId}/publish`);
  }

  async unpublishBlog(blogId: string): Promise<ApiResponse<Blog>> {
    return await apiManager.patch<Blog>(`/blogs/${blogId}/unpublish`);
  }

  async getAuthorBlogs(): Promise<ApiResponse<Blog[]>> {
    return await apiManager.get<Blog[]>('/blogs/author');
  }

  async getSavedBlogs(): Promise<ApiResponse<Blog[]>> {
    return await apiManager.get<Blog[]>('/profile/savedArticles');
  }

  async saveBlog(blogId: string): Promise<ApiResponse<void>> {
    return await apiManager.post<void>(`/profile/savedArticles/${blogId}`);
  }

  async removeSavedBlog(blogId: string): Promise<ApiResponse<void>> {
    return await apiManager.delete<void>(`/profile/savedArticles/${blogId}`);
  }

  async checkBlogSaved(blogId: string): Promise<ApiResponse<{ isSaved: boolean }>> {
    return await apiManager.get<{ isSaved: boolean }>(`/profile/savedArticles/${blogId}/check`);
  }

  async uploadBlogCoverImage(blogId: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ coverImage: string }>> {
    return await apiManager.upload<{ coverImage: string }>(`/blogs/${blogId}/cover`, file, onProgress);
  }

  async searchBlogs(query: string, params?: BlogQueryParams): Promise<PaginatedResponse<Blog>> {
    const queryString = this.buildQueryString({ q: query, ...params });
    return await apiManager.get<Blog[]>(`/blogs/search?${queryString}`);
  }
}

export const blogService = BlogService.getInstance();
