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

  // Get all blogs (public)
  async getBlogs(params?: BlogQueryParams): Promise<PaginatedResponse<Blog>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/blogs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiManager.get<Blog[]>(url);
  }

  // Get blog by ID
  async getBlogById(blogId: string): Promise<ApiResponse<Blog>> {
    return await apiManager.get<Blog>(`/blogs/${blogId}`);
  }

  // Get blog by slug
  async getBlogBySlug(slug: string): Promise<ApiResponse<Blog>> {
    return await apiManager.get<Blog>(`/blogs/slug/${slug}`);
  }

  // Get blog comments
  async getBlogComments(blogId: string): Promise<ApiResponse<BlogComment[]>> {
    return await apiManager.get<BlogComment[]>(`/blogs/${blogId}/comments`);
  }

  // Add blog comment
  async addBlogComment(blogId: string, comment: CreateCommentRequest): Promise<ApiResponse<BlogComment>> {
    return await apiManager.post<BlogComment>(`/blogs/${blogId}/comments`, comment);
  }

  // Update blog comment
  async updateBlogComment(blogId: string, commentId: string, content: string): Promise<ApiResponse<BlogComment>> {
    return await apiManager.put<BlogComment>(`/blogs/${blogId}/comments/${commentId}`, { content });
  }

  // Delete blog comment
  async deleteBlogComment(blogId: string, commentId: string): Promise<ApiResponse<void>> {
    return await apiManager.delete<void>(`/blogs/${blogId}/comments/${commentId}`);
  }

  // Add reaction to blog
  async addBlogReaction(blogId: string, type: Reaction['type']): Promise<ApiResponse<Reaction>> {
    return await apiManager.post<Reaction>(`/blogs/${blogId}/reactions`, { type });
  }

  // Remove reaction from blog
  async removeBlogReaction(blogId: string): Promise<ApiResponse<void>> {
    return await apiManager.delete<void>(`/blogs/${blogId}/reactions`);
  }

  // Add reaction to comment
  async addCommentReaction(commentId: string, type: Reaction['type']): Promise<ApiResponse<Reaction>> {
    return await apiManager.post<Reaction>(`/comments/${commentId}/reactions`, { type });
  }

  // Remove reaction from comment
  async removeCommentReaction(commentId: string): Promise<ApiResponse<void>> {
    return await apiManager.delete<void>(`/comments/${commentId}/reactions`);
  }

  // Increment blog view count
  async incrementBlogView(blogId: string): Promise<ApiResponse<void>> {
    return await apiManager.post<void>(`/blogs/${blogId}/view`);
  }

  // Get blog categories
  async getBlogCategories(): Promise<ApiResponse<BlogCategory[]>> {
    return await apiManager.get<BlogCategory[]>('/blogs/categories');
  }

  // Get trending blogs
  async getTrendingBlogs(limit: number = 10): Promise<ApiResponse<Blog[]>> {
    return await apiManager.get<Blog[]>(`/blogs/trending?limit=${limit}`);
  }

  // Get popular blogs
  async getPopularBlogs(limit: number = 10): Promise<ApiResponse<Blog[]>> {
    return await apiManager.get<Blog[]>(`/blogs/popular?limit=${limit}`);
  }

  // Get blogs by author
  async getBlogsByAuthor(authorId: string, params?: BlogQueryParams): Promise<PaginatedResponse<Blog>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/blogs/author/${authorId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiManager.get<Blog[]>(url);
  }

  // Get blogs by category
  async getBlogsByCategory(categorySlug: string, params?: BlogQueryParams): Promise<PaginatedResponse<Blog>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/blogs/category/${categorySlug}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiManager.get<Blog[]>(url);
  }

  // Author methods (if user is author)
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

  // Get author blogs
  async getAuthorBlogs(): Promise<ApiResponse<Blog[]>> {
    return await apiManager.get<Blog[]>('/blogs/author');
  }

  // Get saved blogs
  async getSavedBlogs(): Promise<ApiResponse<Blog[]>> {
    return await apiManager.get<Blog[]>('/profile/savedArticles');
  }

  // Save blog
  async saveBlog(blogId: string): Promise<ApiResponse<void>> {
    return await apiManager.post<void>(`/profile/savedArticles/${blogId}`);
  }

  // Remove saved blog
  async removeSavedBlog(blogId: string): Promise<ApiResponse<void>> {
    return await apiManager.delete<void>(`/profile/savedArticles/${blogId}`);
  }

  // Check if blog is saved
  async checkBlogSaved(blogId: string): Promise<ApiResponse<{ isSaved: boolean }>> {
    return await apiManager.get<{ isSaved: boolean }>(`/profile/savedArticles/${blogId}/check`);
  }

  // Upload blog cover image
  async uploadBlogCoverImage(blogId: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ coverImage: string }>> {
    return await apiManager.upload<{ coverImage: string }>(`/blogs/${blogId}/cover`, file, onProgress);
  }

  // Search blogs
  async searchBlogs(query: string, params?: BlogQueryParams): Promise<PaginatedResponse<Blog>> {
    const queryParams = new URLSearchParams({ q: query });
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/blogs/search?${queryParams.toString()}`;
    return await apiManager.get<Blog[]>(url);
  }
}

// Export singleton instance
export const blogService = BlogService.getInstance(); 