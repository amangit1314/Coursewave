// // types/blog-api-response.ts

// // Type for the author object
// export type BlogAuthor = {
//     id: string;
//     name: string;
//     email: string;
//     profileImageUrl: string | null;
//     about: string | null;
//     shortSummary: string | null;
//   };

//   // Type for the category object
//   export type BlogCategory = {
//     id: string;
//     name: string;
//     description: string;
//     createdAt: string;
//     updatedAt: string;
//   };

//   // Type for the _count object
//   export type BlogCounts = {
//     likes: number;
//     views: number;
//     comments: number;
//   };

//   // Type for the individual blog article
//   export type BlogArticle = {
//     id: string;
//     title: string;
//     content: string;
//     slug: string;
//     excerpt: string;
//     coverImage: string;
//     readTime: number;
//     isPublished: boolean;
//     publishedAt: string;
//     tags: string[];
//     authorId: string;
//     categoryId: string;
//     createdAt: string;
//     updatedAt: string;
//     author: BlogAuthor;
//     category: BlogCategory;
//     _count: BlogCounts;
//   };

//   // Type for the API response structure
//   export type BlogApiResponse = {
//     success: boolean;
//     data: BlogArticle[];
//   };

//   // If you need a type for a single blog article response:
//   export type SingleBlogApiResponse = {
//     success: boolean;
//     data: BlogArticle;
//   };

/// ===============================================================================================

// types/blog-api-response.ts

// Type for the author object - based on actual API response
export type BlogAuthor = {
  id: string;
  name: string;
  profileImageUrl: string | null;
  shortSummary: string | null; // Note: email, about, shortSummary are not in the actual API response
};

// Type for the category object - based on actual API response
export type BlogCategory = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

// Type for the _count object - based on actual API response
export type BlogCounts = {
  BlogLike: number; // Note: Capital 'L' and specific name from API
  comments: number; // lowercase 'c' from API
  views: number; // Note: 'likes' and 'views' are not in the actual API response
};

// Type for the individual blog article - based on actual API response
export type BlogArticle = {
  id: string;
  title: string;
  content: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  readTime: number;
  isPublished: boolean;
  publishedAt: string;
  tags: string[];
  authorId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  author: BlogAuthor;
  Category: BlogCategory; // Note: Capital 'C' from API response
  _count: BlogCounts;
  averageRating?: number;
  ratingsCount?: number;
};

// Type for the API response structure
export type BlogApiResponse = {
  success: boolean;
  data: BlogArticle[];
};

// If you need a type for a single blog article response:
export type SingleBlogApiResponse = {
  success: boolean;
  data: BlogArticle;
};

// For paginated responses (if implemented later)
export interface PaginatedBlogResponse {
  success: boolean;
  data: {
    items: BlogArticle[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query parameters for articles
export interface BlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: "newest" | "oldest" | "title-asc" | "title-desc";
  tags?: string[];
  authorId?: string;
}
