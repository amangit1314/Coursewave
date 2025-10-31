// src/hooks/useAuthor.ts

import authorsService, {
  Author,
  Article,
  Course,
} from "@/lib/api/services/authorsService";
import { useQuery } from "@tanstack/react-query";
// import authorsService, { Author, Article, Course } from "@/services/authorsService";

// KEY HELPERS for unique query keys
const AUTHOR = "author";
const AUTHORS = "authors";
const AUTHOR_ARTICLES = "author-articles";
const AUTHOR_COURSES = "author-courses";

/*
 * Hook: Fetch all authors (optionally search by name/slug)
 */
export function useAuthors(query?: string) {
  return useQuery<Author[]>({
    queryKey: [AUTHORS, query],
    queryFn: () => authorsService.getAuthors(query),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/*
 * Hook: Fetch single author by id
 */
export function useAuthorById(authorId: string | undefined) {
  return useQuery<Author>({
    queryKey: [AUTHOR, authorId],
    queryFn: () => authorsService.getAuthorById(authorId!),
    enabled: !!authorId,
    staleTime: 5 * 60 * 1000,
  });
}

/*
 * Hook: Fetch single author by slug
 */
export function useAuthorBySlug(slug: string | undefined) {
  return useQuery<Author>({
    queryKey: [AUTHOR, "slug", slug],
    queryFn: () => authorsService.getAuthorBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

/*
 * Hook: Fetch articles written by author
 */
export function useAuthorArticles(authorId: string | undefined) {
  return useQuery<Article[]>({
    queryKey: [AUTHOR_ARTICLES, authorId],
    queryFn: () => authorsService.getArticlesByAuthor(authorId!),
    enabled: !!authorId,
    staleTime: 5 * 60 * 1000,
  });
}

/*
 * Hook: Fetch courses by author (as instructor)
 */
export function useAuthorCourses(authorId: string | undefined) {
  return useQuery<Course[]>({
    queryKey: [AUTHOR_COURSES, authorId],
    queryFn: () => authorsService.getCoursesByAuthor(authorId!),
    enabled: !!authorId,
    staleTime: 5 * 60 * 1000,
  });
}
