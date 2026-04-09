import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
// import { invalidateCache } from "../../config/redis";
import { generateResourceId } from "../../core/utils/idGenerator";
import { AppError } from "../../core/middleware/errorHandler";

export const BlogsService = {
  // Get all published blogs
  getAllBlogs: async () => {
    const blogs = await prisma.blog.findMany({
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
        BlogRating: {
          select: {
            rating: true,
          },
        },
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

    return blogs.map((blog) => {
      const totalRating = blog.BlogRating.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = blog.BlogRating.length > 0 ? totalRating / blog.BlogRating.length : 0;

      // Remove BlogRating from the response to keep it clean, or keep it if needed
      const { BlogRating, ...rest } = blog;

      return {
        ...rest,
        averageRating,
        ratingsCount: blog.BlogRating.length,
      };
    });
  },

  // Get blog by ID
  getBlogById: async (id: string) => {
    const blog = await prisma.blog.findUnique({
      where: {
        id,
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

    if (!blog) throw new AppError("Blog not found", 404);
    return blog;
  },

  // Get blog by slug
  getBlogBySlug: async (slug: string) => {
    const blog = await prisma.blog.findUnique({
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

    if (!blog) throw new AppError("Blog not found", 404);
    return blog;
  },

  // Track blog view and increment view count
  incrementBlogViewCount: async (
    blogId: string,
    userId?: string,
    ip?: string
  ) => {
    // 1. Check if the blog exists:
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { id: true },
    });
    if (!blog) throw new AppError("Blog not found", 404);

    // 2. Create a new BlogView record:
    await prisma.blogView.create({
      data: {
        id: generateResourceId("blogView"),
        blogId,
        userId: userId ?? null,
        ip: ip ?? null,
      },
    });

    // 3. Count all BlogViews for this blog:
    const viewCount = await prisma.blogView.count({
      where: { blogId },
    });

    // 4. Return the count (and/or "success" message)
    return {
      message: "Blog view tracked successfully",
      viewCount, // <-- frontends can use this to show updated views
    };
  },

  /**
   * Follow or unfollow a blog author
   * @param blogId - The ID of the blog to get the author from
   * @param userId - The ID of the user who wants to follow/unfollow
   * @returns Object with action and author info
   */
  followUnfollowAuthor: async (blogId: string, userId: string) => {
    // First, get the blog to find the author
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        id: true,
        authorId: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!blog) {
      throw new AppError("Blog not found", 404);
    }

    const authorId = blog.authorId;

    // Check if user is trying to follow themselves
    if (authorId === userId) {
      throw new AppError("You cannot follow/unfollow yourself", 400);
    }

    // Verify author exists
    const author = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      throw new AppError("Author not found", 404);
    }

    // Check if follow relationship already exists
    const existingFollow = await prisma.userFollower.findUnique({
      where: {
        userId_followerId: {
          userId: authorId,
          followerId: userId,
        },
      },
    });

    let action: "followed" | "unfollowed";

    if (existingFollow) {
      // Unfollow - remove the follow relationship
      await prisma.userFollower.delete({
        where: {
          userId_followerId: {
            userId: authorId,
            followerId: userId,
          },
        },
      });
      action = "unfollowed";
    } else {
      // Follow - create the follow relationship
      await prisma.userFollower.create({
        data: {
          userId: authorId,
          followerId: userId,
        },
      });
      action = "followed";
    }

    // Get updated follower count for the author
    const followerCount = await prisma.userFollower.count({
      where: { userId: authorId },
    });

    // Get updated following count for the user
    const followingCount = await prisma.userFollower.count({
      where: { followerId: userId },
    });

    return {
      action,
      author: {
        id: authorId,
        name: blog.author.name,
        email: blog.author.email,
      },
      followerCount,
      followingCount,
      isFollowing: action === "followed",
    };
  },

  /**
   * Check if a user is following an author
   * @param authorId - The ID of the author
   * @param userId - The ID of the user to check
   * @returns Boolean indicating if the user is following the author
   */
  isFollowingAuthor: async (
    authorId: string,
    userId: string
  ): Promise<boolean> => {
    if (authorId === userId) return false;

    const follow = await prisma.userFollower.findUnique({
      where: {
        userId_followerId: {
          userId: authorId,
          followerId: userId,
        },
      },
    });

    return !!follow;
  },

  /**
   * Get author's follower count
   * @param authorId - The ID of the author
   * @returns Follower count
   */
  getFollowerCount: async (authorId: string): Promise<number> => {
    return await prisma.userFollower.count({
      where: { userId: authorId },
    });
  },

  /**
   * Get user's following count (how many authors they follow)
   * @param userId - The ID of the user
   * @returns Following count
   */
  getFollowingCount: async (userId: string): Promise<number> => {
    return await prisma.userFollower.count({
      where: { followerId: userId },
    });
  },

  /**
   * Get author's followers list
   * @param authorId - The ID of the author
   * @param page - Page number (optional)
   * @param limit - Limit per page (optional)
   * @returns List of followers
   */
  getAuthorFollowers: async (
    authorId: string,
    page: number = 1,
    limit: number = 20
  ) => {
    const skip = (page - 1) * limit;

    const [followers, total] = await Promise.all([
      prisma.userFollower.findMany({
        where: { userId: authorId },
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImageUrl: true,
              about: true,
              slug: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.userFollower.count({
        where: { userId: authorId },
      }),
    ]);

    return {
      followers: followers.map((f) => f.follower),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get users that a user is following
   * @param userId - The ID of the user
   * @param page - Page number (optional)
   * @param limit - Limit per page (optional)
   * @returns List of authors the user is following
   */
  getUserFollowing: async (
    userId: string,
    page: number = 1,
    limit: number = 20
  ) => {
    const skip = (page - 1) * limit;

    const [following, total] = await Promise.all([
      prisma.userFollower.findMany({
        where: { followerId: userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImageUrl: true,
              about: true,
              slug: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.userFollower.count({
        where: { followerId: userId },
      }),
    ]);

    return {
      following: following.map((f) => f.user),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  // Create a new blog
  createBlog: async (
    userId: string,
    data: {
      title: string;
      content: string;
      excerpt?: string;
      coverImage?: string;
      readTime?: number;
      categoryId?: string;
    }
  ) => {
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    // Prepare the create data - only include category if categoryId exists
    const createData: Prisma.BlogCreateInput = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || null,
      coverImage: data.coverImage || null,
      readTime: data.readTime || null,
      slug,
      isPublished: false,
      author: {
        connect: {
          id: userId,
        },
      },
    };

    // Only add category connection if categoryId is provided
    if (data.categoryId) {
      createData.Category = {
        connect: {
          id: data.categoryId,
        },
      };
    }

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

    return blog;
  },

  reportBlog: async (blogId: string, userId: string, reason: string) => {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });
    if (!blog) throw new AppError("Blog not found", 404);
    await prisma.blogReport.create({
      data: {
        id: generateResourceId(`blogReport`),
        blogId,
        reporterId: userId,
        reason,
      },
    });
    return { message: "Blog reported successfully" };
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

    if (!existingBlog) throw new AppError("Blog not found", 404);
    if (existingBlog.authorId !== userId)
      throw new AppError("You are not authorized to update this blog", 403);

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

    if (!existingBlog) throw new AppError("Blog not found", 404);
    if (existingBlog.authorId !== userId)
      throw new AppError("You are not authorized to delete this blog", 403);

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

  checkLikeStatus: async (blogId: string, userId: string): Promise<boolean> => {
    // Check if the user has liked the blog
    const existingLike = await prisma.blogLike.findFirst({
      where: {
        userId: userId,
        blogId: blogId,
      },
    });

    return !!existingLike;
  },

  getComments: async (blogId: string) => {
    const comments = await prisma.blogComment.findMany({
      where: {
        blogId,
      },
    });

    return comments;
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

    if (!blog) throw new AppError("Blog not found", 404);

    if (parentId) {
      const parentComment = await prisma.blogComment.findUnique({
        where: { id: parentId },
      });
      if (!parentComment) throw new AppError("Parent comment not found", 404);
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

  // Update a comment
  updateComment: async (commentId: string, userId: string, content: string) => {
    const comment = await prisma.blogComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new AppError("Comment not found", 404);
    if (comment.authorId !== userId)
      throw new AppError("You are not authorized to update this comment", 403);

    return await prisma.blogComment.update({
      where: { id: commentId },
      data: {
        content,
        updatedAt: new Date(),
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

    if (!comment) throw new AppError("Comment not found", 404);

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

    if (!comment) throw new AppError("Comment not found", 404);
    if (comment.authorId !== userId)
      throw new AppError("You are not authorized to delete this comment", 403);

    await prisma.blogComment.delete({
      where: { id: commentId },
    });

    return { message: "Comment deleted successfully" };
  },

  // Rate an article (1-5 stars)
  rateArticle: async (blogId: string, userId: string, rating: number) => {
    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new AppError("Rating must be between 1 and 5", 400);
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) throw new AppError("Blog not found", 404);

    // Check if user already rated
    const existingRating = await prisma.blogRating.findUnique({
      where: {
        blogId_userId: {
          blogId,
          userId,
        },
      },
    });

    if (existingRating) {
      // Update existing rating
      return await prisma.blogRating.update({
        where: {
          blogId_userId: {
            blogId,
            userId,
          },
        },
        data: {
          rating,
          updatedAt: new Date(),
        },
      });
    }

    // Create new rating
    return await prisma.blogRating.create({
      data: {
        id: generateResourceId(`blogRating`),
        blogId,
        userId,
        rating,
      },
    });
  },

  // Get user's rating for an article
  getUserRating: async (blogId: string, userId: string) => {
    const rating = await prisma.blogRating.findUnique({
      where: {
        blogId_userId: {
          blogId,
          userId,
        },
      },
    });

    return rating?.rating || null;
  },

  // Get average rating and count for an article
  getAverageRating: async (blogId: string) => {
    const ratings = await prisma.blogRating.findMany({
      where: { blogId },
      select: { rating: true },
    });

    if (ratings.length === 0) {
      return {
        average: 0,
        count: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const sum = ratings.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0);
    const average = sum / ratings.length;

    // Calculate distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((r: { rating: number }) => {
      distribution[r.rating as keyof typeof distribution]++;
    });

    return {
      average: parseFloat(average.toFixed(1)),
      count: ratings.length,
      distribution,
    };
  },

  // Get user's (instructor's) own blogs/articles
  getUserOwnBlogs: async (userId: string) => {
    try {
      const blogs = await prisma.blog.findMany({
        where: { authorId: userId },
        include: {
          Category: true,
          _count: {
            select: {
              BlogLike: true,
              comments: true,
              BlogView: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Format response with counts
      const formattedBlogs = blogs.map((blog) => ({
        ...blog,
        likesCount: blog._count.BlogLike,
        commentsCount: blog._count.comments,
        viewsCount: blog._count.BlogView,
      }));

      return formattedBlogs;
    } catch (error: any) {
      console.error("Error fetching user own blogs:", error);
      throw new AppError("Failed to fetch your articles", 500);
    }
  },
};
