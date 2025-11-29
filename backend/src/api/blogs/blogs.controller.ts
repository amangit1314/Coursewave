import { Request, Response } from "express";
import { BlogsService } from "./blogs.service";

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await BlogsService.getAllBlogs();
    console.log("BLOGS CONTROLLER BLOGS: ", blogs);
    return res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error: any) {
    console.log("ERROR in fetching blogs: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const blog = await BlogsService.getBlogById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    console.log("ERROR in fetching blog: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const blog = await BlogsService.getBlogBySlug(slug);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    console.log("ERROR in fetching blog: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, excerpt, coverImage, readTime, categoryId } =
      req.body;
    const userId = req.user?.id || "";

    const blog = await BlogsService.createBlog(userId, {
      title,
      content,
      excerpt,
      coverImage,
      readTime,
      categoryId,
    });

    return res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    console.log("ERROR in creating blog: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const reportBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const userId = req.user?.id || "";
    const { reason } = req.body;

    console.log("req.user:", JSON.stringify(req.user));

    await BlogsService.reportBlog(blogId, userId, reason);
    return res.status(200).json({
      success: true,
      message: "Blog reported successfully",
    });
  } catch (error: any) {
    console.log("ERROR in reporting blog: ", error.message);
    if (error.message === "Blog not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const incrementBlogViewCount = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    // Get the new count from the service (service method should return it)
    const result = await BlogsService.incrementBlogViewCount(blogId);

    return res.status(200).json({
      success: true,
      message: "Blog view count incremented successfully",
      data: { viewCount: result.viewCount }, // <-- WRAP in `data`
    });
  } catch (error: any) {
    console.log("ERROR in incrementing blog view count: ", error.message);
    if (error.message === "Blog not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Updated follow/unfollow author to use blogId instead of authorId
export const followUnfollowAuthor = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params; // Changed from id to blogId
    const userId = req.user?.id || "";

    const result = await BlogsService.followUnfollowAuthor(blogId, userId);

    return res.status(200).json({
      success: true,
      message: `Successfully ${result.action} ${result.author.name}`,
      data: result,
    });
  } catch (error: any) {
    console.log("ERROR in following/unfollowing author: ", error.message);
    if (
      error.message === "Blog not found" ||
      error.message === "Author not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === "You cannot follow/unfollow yourself") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// New controller to check if user is following an author of a blog
export const checkFollowingStatus = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const userId = req.user?.id || ""

    const blog = await BlogsService.getBlogById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const isFollowing = await BlogsService.isFollowingAuthor(
      blog.authorId,
      userId
    );

    res.json({
      success: true,
      data: {
        isFollowing,
        authorId: blog.authorId,
      },
    });
  } catch (error: any) {
    console.log("ERROR in checking follow status: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// New controller to get author's followers
export const getAuthorFollowers = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const blog = await BlogsService.getBlogById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const result = await BlogsService.getAuthorFollowers(
      blog.authorId,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.log("ERROR in getting author followers: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// New controller to get user's following list
export const getUserFollowing = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || ""
    const { page = 1, limit = 20 } = req.query;

    const result = await BlogsService.getUserFollowing(
      userId,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.log("ERROR in getting user following: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// New controller to get author follower count
export const getAuthorFollowerCount = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;

    const blog = await BlogsService.getBlogById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const followerCount = await BlogsService.getFollowerCount(blog.authorId);

    res.json({
      success: true,
      data: {
        followerCount,
        authorId: blog.authorId,
      },
    });
  } catch (error: any) {
    console.log("ERROR in getting follower count: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// New controller to get user following count
export const getUserFollowingCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || ""

    const followingCount = await BlogsService.getFollowingCount(userId);

    res.json({
      success: true,
      data: { followingCount },
    });
  } catch (error: any) {
    console.log("ERROR in getting following count: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      coverImage,
      readTime,
      categoryId,
      isPublished,
    } = req.body;
    const userId = req.user?.id || ""

    const updatedBlog = await BlogsService.updateBlog(id, userId, {
      title,
      content,
      excerpt,
      coverImage,
      readTime,
      isPublished,
      categoryId,
    });

    return res.status(200).json({
      success: true,
      data: updatedBlog,
    });
  } catch (error: any) {
    console.log("ERROR in updating blog: ", error.message);
    if (error.message === "Blog not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === "You are not authorized to update this blog") {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || ""

    await BlogsService.deleteBlog(id, userId);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error: any) {
    console.log("ERROR in deleting blog: ", error.message);
    if (error.message === "Blog not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === "You are not authorized to delete this blog") {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const likeUnlikeBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || ""

    const { liked } = await BlogsService.likeUnlikeBlog(id, userId);

    return res.status(200).json({
      success: true,
      message: liked ? "Blog liked successfully" : "Blog unliked successfully",
      liked,
    });
  } catch (error: any) {
    console.log("ERROR in liking/unliking blog: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const checkLikeStatus = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const userId = req.user?.id || ""

    // Assuming you have a service method to check like status
    const isLiked = await BlogsService.checkLikeStatus(blogId, userId);

    return res.status(200).json({
      success: true,
      isLiked,
    });
  } catch (error: any) {
    console.log("ERROR in checking blog like status: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getArticleComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comments = await BlogsService.getComments(id);
    return res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error: any) {
    console.log("ERROR in fetching comments: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user?.id || ""

    const comment = await BlogsService.addComment(
      id,
      userId,
      content,
      parentId
    );

    return res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error: any) {
    console.log("ERROR in adding comment: ", error.message);
    if (
      error.message === "Blog not found" ||
      error.message === "Parent comment not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id || "";

    const comment = await BlogsService.updateComment(id, userId, content);

    return res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error: any) {
    console.log("ERROR in updating comment: ", error.message);
    if (error.message === "Comment not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === "You are not authorized to update this comment") {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const likeUnlikeComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || ""

    const { liked } = await BlogsService.likeUnlikeComment(id, userId);

    return res.status(200).json({
      success: true,
      message: liked
        ? "Comment liked successfully"
        : "Comment unliked successfully",
      liked,
    });
  } catch (error: any) {
    console.log("ERROR in liking comment: ", error.message);
    if (error.message === "Comment not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const rateArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user?.id || "";

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const result = await BlogsService.rateArticle(id, userId, rating);

    return res.status(200).json({
      success: true,
      data: result,
      message: "Article rated successfully",
    });
  } catch (error: any) {
    console.log("ERROR in rating article: ", error.message);
    if (error.message === "Blog not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === "Rating must be between 1 and 5") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getUserRating = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const userId = req.user?.id || "";

    const rating = await BlogsService.getUserRating(blogId, userId);

    return res.status(200).json({
      success: true,
      data: { rating },
    });
  } catch (error: any) {
    console.log("ERROR in getting user rating: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAverageRating = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;

    const ratingData = await BlogsService.getAverageRating(blogId);

    return res.status(200).json({
      success: true,
      data: ratingData,
    });
  } catch (error: any) {
    console.log("ERROR in getting average rating: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || ""

    await BlogsService.deleteComment(id, userId);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error: any) {
    console.log("ERROR in deleting comment: ", error.message);
    if (error.message === "Comment not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === "You are not authorized to delete this comment") {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// Get user's own blogs/articles
export const getUserOwnBlogs = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || '';
    const blogs = await BlogsService.getUserOwnBlogs(userId);

    res.status(200).json({
      success: true,
      data: blogs,
      message: 'Articles fetched successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch articles',
    });
  }
};
