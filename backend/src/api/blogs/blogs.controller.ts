import { Request, Response } from "express";
import { BlogsService } from "./blogs.service";

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await BlogsService.getAllBlogs();
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
    const userId = req.user.id;

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
    const userId = req.user.id;

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
    const userId = req.user.id;

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
    const userId = req.user.id;

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

export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.id;

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

export const likeUnlikeComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

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

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

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
