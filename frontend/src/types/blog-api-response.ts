// types/blog-api-response.ts

// Type for the author object
export type BlogAuthor = {
    id: string;
    name: string;
    email: string;
    profileImageUrl: string | null;
    about: string | null;
    shortSummary: string | null;
  };
  
  // Type for the category object
  export type BlogCategory = {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  
  // Type for the _count object
  export type BlogCounts = {
    likes: number;
    views: number;
    comments: number;
  };
  
  // Type for the individual blog article
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
    category: BlogCategory;
    _count: BlogCounts;
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