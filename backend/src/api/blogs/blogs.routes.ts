import express, { Request, Response } from "express";
import { Router } from "express";
import { verifyToken } from "../../core/middleware";
import {
  addComment,
  createBlog,
  deleteBlog,
  deleteComment,
  getAllBlogs,
  getBlogBySlug,
  likeUnlikeBlog,
  likeUnlikeComment,
  updateBlog,
} from "./blogs.controller";

const router: Router = express.Router();

// Get all blogs (public)
router.get("/", getAllBlogs);

// Get blog by slug (public)
router.get("/:slug", getBlogBySlug);

// Create blog (private)
router.post("/", verifyToken, createBlog);

// Update blog (private)
router.put("/:id", verifyToken, updateBlog);

// Delete blog (private)
router.delete("/:id", verifyToken, deleteBlog);

// Like/Unlike blog
router.post("/:id/like", verifyToken, likeUnlikeBlog);

// Add comment to blog (private)
router.post("/:id/comments", verifyToken, addComment);

// Like comment (private)
router.post("/comments/:id/like", verifyToken, likeUnlikeComment);

// Delete comment (private)
router.delete("/comments/:id", deleteComment);

export default router;
