// src/controllers/authors.controller.ts

import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

/*
 * GET /api/authors
 * Optional query: ?q=nameOrSlugForSearch
 */
export async function getAuthors(req: Request, res: Response) {
  const { q } = req.query;
  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: String(q), mode: "insensitive" } },
            { slug: { contains: String(q), mode: "insensitive" } }
          ]
        }
      : {},
    select: {
      id: true,
      name: true,
      profileImageUrl: true,
      slug: true,
      about: true
      // Add more public fields if needed
    }
  });
  res.json(users);
}

/*
 * GET /api/authors/:authorId
 */
export async function getAuthorById(req: Request, res: Response) {
  const { authorId } = req.params;
  const author = await prisma.user.findUnique({
    where: { id: authorId },
    select: {
      id: true,
      slug: true,
      name: true,
      about: true,
      profileImageUrl: true,
      // Optionally include more public fields
      authoredBlogs: {
        select: {
          id: true,
          slug: true,
          title: true,
          coverImage: true,
          excerpt: true,
          publishedAt: true
        },
        orderBy: { publishedAt: "desc" }
      },
      instructorProfile: {
        select: {
          bio: true,
          expertise: true,
          courses: {
            select: {
              id: true,
              slug: true,
              title: true,
              imageUrl: true
            }
          }
        }
      }
    }
  });
  if (!author) return res.status(404).json({ error: "Author not found" });
  res.json(author);
}

/*
 * GET /api/authors/slug/:slug
 */
export async function getAuthorBySlug(req: Request, res: Response) {
  const { slug } = req.params;
  const author = await prisma.user.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      about: true,
      profileImageUrl: true,
      authoredBlogs: {
        select: {
          id: true,
          slug: true,
          title: true,
          coverImage: true,
          excerpt: true,
          publishedAt: true
        },
        orderBy: { publishedAt: "desc" }
      },
      instructorProfile: {
        select: {
          bio: true,
          expertise: true,
          courses: {
            select: {
              id: true,
              slug: true,
              title: true,
              imageUrl: true
            }
          }
        }
      }
    }
  });
  if (!author) return res.status(404).json({ error: "Author not found" });
  res.json(author);
}

/*
 * GET /api/authors/:authorId/articles
 */
export async function getAuthorArticles(req: Request, res: Response) {
  const { authorId } = req.params;
  const articles = await prisma.blog.findMany({
    where: { authorId },
    select: {
      id: true,
      slug: true,
      title: true,
      coverImage: true,
      excerpt: true,
      publishedAt: true
    },
    orderBy: { publishedAt: 'desc' }
  });
  res.json(articles);
}

/*
 * GET /api/authors/:authorId/courses
 * (returns empty array if not an instructor)
 */
export async function getAuthorCourses(req: Request, res: Response) {
  const { authorId } = req.params;
  const instructor = await prisma.instructor.findUnique({
    where: { userId: authorId },
    select: {
      courses: {
        select: {
          id: true,
          slug: true,
          title: true,
          imageUrl: true
        }
      }
    }
  });
  res.json(instructor?.courses || []);
}
