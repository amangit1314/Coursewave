// author.routes.ts

import { Router } from "express";
import {
  getAuthorById,
  getAuthorBySlug,
  getAuthors,
  getAuthorArticles,
  getAuthorCourses,
} from "./authors.controller";

const router = Router();

// GET all authors (optional, for listing or search)
router.get("/", getAuthors); // ?q=search

// GET author by ID (main public profile)
router.get("/:authorId", getAuthorById);

// GET author by slug (optional; friendlier URLs)
router.get("/slug/:slug", getAuthorBySlug);

// GET articles by authorId
router.get("/:authorId/articles", getAuthorArticles);

// GET courses by authorId (if the author is an instructor)
router.get("/:authorId/courses", getAuthorCourses);

export default router;
