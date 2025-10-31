import express, { Request, Response } from "express";
import { Router } from "express";
import { verifyToken } from "../../core/middleware";
import {
  addComment,
  checkFollowingStatus,
  checkLikeStatus,
  createBlog,
  deleteBlog,
  deleteComment,
  followUnfollowAuthor,
  getAllBlogs,
  getArticleComments,
  getAuthorFollowerCount,
  getAuthorFollowers,
  getBlogById,
  getBlogBySlug,
  getUserFollowing,
  getUserFollowingCount,
  incrementBlogViewCount,
  likeUnlikeBlog,
  likeUnlikeComment,
  reportBlog,
  updateBlog,
} from "./blogs.controller";
import { report } from "process";

const router: Router = express.Router();

// Get all blogs (public)
router.get("/", getAllBlogs);

// Get blog by slug (public)
router.get("/:blogId", getBlogById);

// Get blog by slug (public)
router.get("/slug/:slug", getBlogBySlug);

// Report blog
router.post("/:blogId/report", verifyToken, reportBlog);

// Increment blog view count
router.post("/:blogId/view", incrementBlogViewCount);

// Create blog (private)
router.post("/", verifyToken, createBlog);

// Follow / unfollow author (private) - Updated to use blogId
router.post("/:blogId/author/follow", verifyToken, followUnfollowAuthor);

// Check if user is following blog author (private)
router.get(
  "/:blogId/author/following-status",
  verifyToken,
  checkFollowingStatus
);

// Get author's followers list (private)
router.get("/:blogId/author/followers", verifyToken, getAuthorFollowers);

// Get author's follower count (public or private)
router.get("/:blogId/author/follower-count", getAuthorFollowerCount);

// Get user's following list (private)
router.get("/user/following/list", verifyToken, getUserFollowing);

// Get user's following count (private)
router.get("/user/following/count", verifyToken, getUserFollowingCount);

// Update blog (private)
router.put("/:id", verifyToken, updateBlog);

// Delete blog (private)
router.delete("/:id", verifyToken, deleteBlog);

// Like/Unlike blog
router.post("/:id/like", verifyToken, likeUnlikeBlog);

// Check if user have liked blog (private)
router.get("/:blogId/like-status", verifyToken, checkLikeStatus);

// Add comment to blog (public)
router.get("/:id/comments", getArticleComments);

// Add comment to blog (private)
router.post("/:id/comments", verifyToken, addComment);

// Like comment (private)
router.post("/comments/:id/like", verifyToken, likeUnlikeComment);

// Delete comment (private)
router.delete("/comments/:id", verifyToken, deleteComment);

export default router;
