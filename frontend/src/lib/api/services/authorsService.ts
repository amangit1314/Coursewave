// src/services/authorsService.ts

import { apiManager, ApiResponse } from "../api-manager";

// Define Author and Course types as needed for strong typing
export interface Author {
  id: string;
  name: string;
  slug: string;
  profileImageUrl?: string;
  about?: string;
  authoredBlogs?: Article[];
  instructorProfile?: InstructorProfile | null;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  coverImage?: string;
  excerpt?: string;
  publishedAt?: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  imageUrl?: string;
}

export interface InstructorProfile {
  bio?: string;
  expertise?: string[];
  courses: Course[];
}

export const authorsService = {
  // Get all authors (optionally search by name/slug)
  async getAuthors(query?: string): Promise<Author[]> {
    const url = query ? `/authors?q=${encodeURIComponent(query)}` : "/authors";
    const res = await apiManager.get<Author[]>(url);
    return res.data;
  },

  // Get author by ID
  async getAuthorById(authorId: string): Promise<Author> {
    const res = await apiManager.get<Author>(`/authors/${authorId}`);
    return res.data;
  },

  // Get author by Slug
  async getAuthorBySlug(slug: string): Promise<Author> {
    const res = await apiManager.get<Author>(`/authors/slug/${slug}`);
    return res.data;
  },

  // Get articles by author
  async getArticlesByAuthor(authorId: string): Promise<Article[]> {
    const res = await apiManager.get<Article[]>(
      `/authors/${authorId}/articles`
    );
    return res.data;
  },

  // Get courses by author (if instructor)
  async getCoursesByAuthor(authorId: string): Promise<Course[]> {
    const res = await apiManager.get<Course[]>(`/authors/${authorId}/courses`);
    return res.data;
  },
};

export default authorsService;
