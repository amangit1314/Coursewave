// ==================================================== BLOG SERVICE =====================================================

// For creating a new category
export interface CreateCategoryRequest {
  name: string; // The name of the category, e.g., "Technology"
  slug?: string; // Optional URL-friendly identifier, e.g., "technology"
  description?: string; // Optional description of the category
}

// For updating an existing category
export interface UpdateCategoryRequest {
  name?: string; // Optional, if you want to update the name
  slug?: string; // Optional, if you want to update the slug
  description?: string; // Optional, if you want to update the description
}

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
  type: "LIKE" | "LOVE" | "INSIGHTFUL" | "HELPFUL";
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
  sortBy?: "newest" | "popular" | "trending";
  sortOrder?: "asc" | "desc";
}

export interface CreateBlogRequest {
  // title: string;
  // content: string;
  // excerpt?: string;
  // categoryIds: string[];
  // isPublished?: boolean;

  title: string;
  content: string;
  excerpt?: string;
  categoryIds?: string[];
  thumbnailUrl: string | null;
  estimatedReadingTime: string;
  authorId: string;
  isPublished?: boolean;
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {
  coverImage?: string;
}

export interface CreateCommentRequest {
  content: string;
  parentId?: string;
}
