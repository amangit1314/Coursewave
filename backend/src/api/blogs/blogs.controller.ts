import { Request, Response } from "express";
import { BlogsService } from "./blogs.service";
import {
  asyncHandler,
  sendSuccess,
  AppError,
} from "../../core/middleware/errorHandler";

const requireUserId = (req: Request): string => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  return userId;
};

export const getAllBlogs = asyncHandler(async (_req: Request, res: Response) => {
  const blogs = await BlogsService.getAllBlogs();
  sendSuccess(res, blogs);
});

export const getBlogById = asyncHandler(async (req: Request, res: Response) => {
  const { blogId } = req.params;
  const blog = await BlogsService.getBlogById(blogId);
  sendSuccess(res, blog);
});

export const getBlogBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const blog = await BlogsService.getBlogBySlug(slug);
  sendSuccess(res, blog);
});

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, excerpt, coverImage, readTime, categoryId } = req.body;
  const blog = await BlogsService.createBlog(requireUserId(req), {
    title,
    content,
    excerpt,
    coverImage,
    readTime,
    categoryId,
  });
  sendSuccess(res, blog, "Blog created successfully", 201);
});

export const reportBlog = asyncHandler(async (req: Request, res: Response) => {
  const { blogId } = req.params;
  const { reason } = req.body;
  await BlogsService.reportBlog(blogId, requireUserId(req), reason);
  sendSuccess(res, null, "Blog reported successfully");
});

export const incrementBlogViewCount = asyncHandler(
  async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const result = await BlogsService.incrementBlogViewCount(blogId);
    sendSuccess(
      res,
      { viewCount: result.viewCount },
      "Blog view count incremented successfully"
    );
  }
);

export const followUnfollowAuthor = asyncHandler(
  async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const result = await BlogsService.followUnfollowAuthor(
      blogId,
      requireUserId(req)
    );
    sendSuccess(
      res,
      result,
      `Successfully ${result.action} ${result.author.name}`
    );
  }
);

export const checkFollowingStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const userId = requireUserId(req);
    const blog = await BlogsService.getBlogById(blogId);
    const isFollowing = await BlogsService.isFollowingAuthor(blog.authorId, userId);
    sendSuccess(res, { isFollowing, authorId: blog.authorId });
  }
);

export const getAuthorFollowers = asyncHandler(
  async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const blog = await BlogsService.getBlogById(blogId);
    const result = await BlogsService.getAuthorFollowers(
      blog.authorId,
      parseInt(page as string),
      parseInt(limit as string)
    );
    sendSuccess(res, result);
  }
);

export const getUserFollowing = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = 1, limit = 20 } = req.query;
    const result = await BlogsService.getUserFollowing(
      requireUserId(req),
      parseInt(page as string),
      parseInt(limit as string)
    );
    sendSuccess(res, result);
  }
);

export const getAuthorFollowerCount = asyncHandler(
  async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const blog = await BlogsService.getBlogById(blogId);
    const followerCount = await BlogsService.getFollowerCount(blog.authorId);
    sendSuccess(res, { followerCount, authorId: blog.authorId });
  }
);

export const getUserFollowingCount = asyncHandler(
  async (req: Request, res: Response) => {
    const followingCount = await BlogsService.getFollowingCount(requireUserId(req));
    sendSuccess(res, { followingCount });
  }
);

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, excerpt, coverImage, readTime, categoryId, isPublished } =
    req.body;
  const updatedBlog = await BlogsService.updateBlog(id, requireUserId(req), {
    title,
    content,
    excerpt,
    coverImage,
    readTime,
    isPublished,
    categoryId,
  });
  sendSuccess(res, updatedBlog, "Blog updated successfully");
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await BlogsService.deleteBlog(id, requireUserId(req));
  sendSuccess(res, null, "Blog deleted successfully");
});

// Preserves legacy response shape: { success, message, liked } — `liked` at root
export const likeUnlikeBlog = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { liked } = await BlogsService.likeUnlikeBlog(id, requireUserId(req));
    res.status(200).json({
      success: true,
      message: liked ? "Blog liked successfully" : "Blog unliked successfully",
      liked,
    });
  }
);

// Preserves legacy response shape: { success, isLiked } — `isLiked` at root
export const checkLikeStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const isLiked = await BlogsService.checkLikeStatus(blogId, requireUserId(req));
    res.status(200).json({
      success: true,
      isLiked,
    });
  }
);

export const getArticleComments = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const comments = await BlogsService.getComments(id);
    sendSuccess(res, comments);
  }
);

export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, parentId } = req.body;
  const comment = await BlogsService.addComment(
    id,
    requireUserId(req),
    content,
    parentId
  );
  sendSuccess(res, comment, "Comment added successfully", 201);
});

export const updateComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await BlogsService.updateComment(id, requireUserId(req), content);
    sendSuccess(res, comment, "Comment updated successfully");
  }
);

// Preserves legacy response shape: { success, message, liked } — `liked` at root
export const likeUnlikeComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { liked } = await BlogsService.likeUnlikeComment(id, requireUserId(req));
    res.status(200).json({
      success: true,
      message: liked
        ? "Comment liked successfully"
        : "Comment unliked successfully",
      liked,
    });
  }
);

export const rateArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating } = req.body;
  const result = await BlogsService.rateArticle(id, requireUserId(req), rating);
  sendSuccess(res, result, "Article rated successfully");
});

export const getUserRating = asyncHandler(async (req: Request, res: Response) => {
  const { blogId } = req.params;
  const rating = await BlogsService.getUserRating(blogId, requireUserId(req));
  sendSuccess(res, { rating });
});

export const getAverageRating = asyncHandler(
  async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const ratingData = await BlogsService.getAverageRating(blogId);
    sendSuccess(res, ratingData);
  }
);

export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await BlogsService.deleteComment(id, requireUserId(req));
    sendSuccess(res, null, "Comment deleted successfully");
  }
);

export const getUserOwnBlogs = asyncHandler(
  async (req: Request, res: Response) => {
    const blogs = await BlogsService.getUserOwnBlogs(requireUserId(req));
    sendSuccess(res, blogs, "Articles fetched successfully");
  }
);
