import express, { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all blogs (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        isPublished: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true
          }
        },
        category: true,
        _count: {
          select: {
            likes: true,
            views: true,
            comments: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    });

    return res.status(200).json({
      success: true,
      data: blogs
    });
  } catch (error: any) {
    console.log('ERROR in fetching blogs: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get blog by slug (public)
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    const blog = await prisma.blog.findUnique({
      where: {
        slug
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
            shortSummary: true,
            about: true,
          }
        },
        category: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                profileImageUrl: true
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    profileImageUrl: true
                  }
                },
                _count: {
                  select: {
                    likes: true
                  }
                }
              }
            },
            _count: {
              select: {
                likes: true
              }
            }
          },
          where: {
            parentId: null // Only get top-level comments
          }
        },
        _count: {
          select: {
            likes: true,
            views: true
          }
        }
      }
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Record view
    const userId = req.user?.id;
    const ip = req.ip;
    
    await prisma.blogView.create({
      data: {
        blogId: blog.id,
        userId: userId || null,
        ip: ip || null
      }
    });

    return res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error: any) {
    console.log('ERROR in fetching blog: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create blog (private)
router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const { title, content, excerpt, coverImage, readTime, tags, categoryId } = req.body;
    const userId = req.user.id;
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        slug,
        excerpt,
        coverImage,
        readTime,
        tags,
        authorId: userId,
        categoryId,
        isPublished: false
      }
    });

    return res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error: any) {
    console.log('ERROR in creating blog: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update blog (private)
router.put('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, coverImage, readTime, tags, categoryId, isPublished } = req.body;
    const userId = req.user.id;
    
    // Check if blog exists and belongs to user
    const existingBlog = await prisma.blog.findUnique({
      where: { id }
    });
    
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    if (existingBlog.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this blog'
      });
    }
    
    // Generate new slug if title changed
    let slug = existingBlog.slug;
    if (title && title !== existingBlog.title) {
      slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
    }
    
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        content,
        slug,
        excerpt,
        coverImage,
        readTime,
        tags,
        categoryId,
        isPublished,
        publishedAt: isPublished && !existingBlog.isPublished ? new Date() : existingBlog.publishedAt
      }
    });

    return res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error: any) {
    console.log('ERROR in updating blog: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// get article author info, no of followers, bio, name, email
// router.get('/author/:id', async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
    
//     const author = await prisma.user.findUnique({
//       where: { id },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         profileImageUrl: true,
//         about: true,
//         shortSummary: true,
//         followers: {
//           select: {
//             _count: true
//           }
//         }
//       }
//     });

//     if (!author) {
//       return res.status(404).json({
//         success: false,
//         message: 'Author not found'
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: author
//     });
//   } catch (error: any) {
//     console.log('ERROR in fetching author info: ', error.message);
//     return res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// Delete blog (private)
router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if blog exists and belongs to user
    const existingBlog = await prisma.blog.findUnique({
      where: { id }
    });
    
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    if (existingBlog.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this blog'
      });
    }
    
    await prisma.blog.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error: any) {
    console.log('ERROR in deleting blog: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Like blog (private)
router.post('/:id/like', verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: { id }
    });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Check if user already liked the blog
    const existingLike = await prisma.blogLike.findUnique({
      where: {
        blogId_userId: {
          blogId: id,
          userId
        }
      }
    });
    
    if (existingLike) {
      // Unlike
      await prisma.blogLike.delete({
        where: {
          id: existingLike.id
        }
      });
      
      return res.status(200).json({
        success: true,
        message: 'Blog unliked successfully'
      });
    }
    
    // Like
    await prisma.blogLike.create({
      data: {
        blogId: id,
        userId
      }
    });
    
    return res.status(200).json({
      success: true,
      message: 'Blog liked successfully'
    });
  } catch (error: any) {
    console.log('ERROR in liking blog: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add comment to blog (private)
router.post('/:id/comments', verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.id;
    
    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: { id }
    });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Check if parent comment exists if parentId is provided
    if (parentId) {
      const parentComment = await prisma.blogComment.findUnique({
        where: { id: parentId }
      });
      
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }
    }
    
    const comment = await prisma.blogComment.create({
      data: {
        content,
        blogId: id,
        authorId: userId,
        parentId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true
          }
        }
      }
    });
    
    return res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error: any) {
    console.log('ERROR in adding comment: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Like comment (private)
router.post('/comments/:id/like', verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if comment exists
    const comment = await prisma.blogComment.findUnique({
      where: { id }
    });
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if user already liked the comment
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId: id,
          userId
        }
      }
    });
    
    if (existingLike) {
      // Unlike
      await prisma.commentLike.delete({
        where: {
          id: existingLike.id
        }
      });
      
      return res.status(200).json({
        success: true,
        message: 'Comment unliked successfully'
      });
    }
    
    // Like
    await prisma.commentLike.create({
      data: {
        commentId: id,
        userId
      }
    });
    
    return res.status(200).json({
      success: true,
      message: 'Comment liked successfully'
    });
  } catch (error: any) {
    console.log('ERROR in liking comment: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete comment (private)
router.delete('/comments/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if comment exists
    const comment = await prisma.blogComment.findUnique({
      where: { id }
    });
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if user is the author of the comment
    if (comment.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment'
      });
    }
    
    await prisma.blogComment.delete({
      where: { id }
    });
    
    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error: any) {
    console.log('ERROR in deleting comment: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router; 