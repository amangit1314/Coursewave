import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
// import { invalidateCache } from "../../config/redis";
import { generateResourceId } from "../../core/utils/idGenerator";

export const BlogsService = {
  // Get all published blogs
  getAllBlogs: async () => {
    return await prisma.blog.findMany({
      where: {
        isPublished: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
        Category: true,
        _count: {
          select: {
            BlogLike: true,
            comments: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
    });
  },

  // Get blog by slug
  getBlogBySlug: async (slug: string) => {
    return await prisma.blog.findUnique({
      where: {
        slug,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
            about: true,
          },
        },
        Category: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                profileImageUrl: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    profileImageUrl: true,
                  },
                },
                _count: {
                  select: {
                    CommentLike: true,
                  },
                },
              },
            },
            _count: {
              select: {
                CommentLike: true,
              },
            },
          },
          where: {
            parentId: null, // Only get top-level comments
          },
        },
        _count: {
          select: {
            BlogLike: true,
            comments: true,
          },
        },
      },
    });
  },

  // Create a new blog
  createBlog: async (
    userId: string,
    data: {
      title: string;
      content: string;
      excerpt: string;
      coverImage: string;
      readTime: number; // Changed from string to number
      categoryId: string;
    }
  ) => {
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    // Prepare the create data with proper typing
    const createData: Prisma.BlogCreateInput = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      coverImage: data.coverImage,
      readTime: data.readTime,
      slug,
      isPublished: false,
      author: {
        connect: {
          id: userId,
        },
      },
      Category: {
        connect: {
          id: data.categoryId,
        },
      },
    };

    const blog = await prisma.blog.create({
      data: createData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        Category: true,
      },
    });

    // await invalidateCache.blogs();
    return blog;
  },

  // Update a blog
  updateBlog: async (
    id: string,
    userId: string,
    data: {
      title?: string;
      content?: string;
      excerpt?: string;
      coverImage?: string;
      readTime?: number; // in seconds
      categoryId?: string;
      isPublished?: boolean;
    }
  ) => {
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) throw new Error("Blog not found");
    if (existingBlog.authorId !== userId)
      throw new Error("You are not authorized to update this blog");

    const slug = data.title
      ? data.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      : existingBlog.slug;

    // Prepare the update data with proper typing
    const updateData: Prisma.BlogUpdateInput = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      coverImage: data.coverImage,
      readTime: data.readTime,
      slug,
      publishedAt: data.isPublished ? new Date() : existingBlog.publishedAt,
      isPublished: data.isPublished,
    };

    // Only include categoryId if it's provided
    if (data.categoryId !== undefined) {
      updateData.Category = {
        connect: { id: data.categoryId },
      };
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        Category: true,
      },
    });

    // await invalidateCache.blogs(existingBlog.slug);
    return updatedBlog;
  },

  // Delete a blog
  deleteBlog: async (id: string, userId: string) => {
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) throw new Error("Blog not found");
    if (existingBlog.authorId !== userId)
      throw new Error("You are not authorized to delete this blog");

    await prisma.blog.delete({
      where: { id },
    });

    // await invalidateCache.blogs(existingBlog.slug);
    return { message: "Blog deleted successfully" };
  },

  // Like/unlike a blog
  likeUnlikeBlog: async (blogId: string, userId: string) => {
    const existingLike = await prisma.blogLike.findUnique({
      where: {
        blogId_userId: {
          blogId,
          userId,
        },
      },
    });

    if (existingLike) {
      await prisma.blogLike.delete({
        where: {
          blogId_userId: {
            blogId,
            userId,
          },
        },
      });
      return { liked: false };
    } else {
      await prisma.blogLike.create({
        data: {
          id: generateResourceId(`blogLike`),
          blogId,
          userId,
        },
      });
      return { liked: true };
    }
  },

  // Add comment to blog
  addComment: async (
    blogId: string,
    userId: string,
    content: string,
    parentId?: string
  ) => {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) throw new Error("Blog not found");

    if (parentId) {
      const parentComment = await prisma.blogComment.findUnique({
        where: { id: parentId },
      });
      if (!parentComment) throw new Error("Parent comment not found");
    }

    return await prisma.blogComment.create({
      data: {
        content,
        blogId,
        authorId: userId,
        parentId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
      },
    });
  },

  // Like/unlike a comment
  likeUnlikeComment: async (commentId: string, userId: string) => {
    const comment = await prisma.blogComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new Error("Comment not found");

    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    });

    if (existingLike) {
      await prisma.commentLike.delete({
        where: {
          commentId_userId: {
            commentId,
            userId,
          },
        },
      });
      return { liked: false };
    }

    await prisma.commentLike.create({
      data: {
        id: generateResourceId(`commentLike`),
        commentId,
        userId,
        type: "LIKE",
      },
    });
    return { liked: true };
  },

  // Delete a comment
  deleteComment: async (commentId: string, userId: string) => {
    const comment = await prisma.blogComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new Error("Comment not found");
    if (comment.authorId !== userId)
      throw new Error("You are not authorized to delete this comment");

    await prisma.blogComment.delete({
      where: { id: commentId },
    });

    return { message: "Comment deleted successfully" };
  },
};
