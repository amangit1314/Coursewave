import express, { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { verifyToken } from '../middleware/auth';
import { generateResourceId } from '../utils/idGenerator';

interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all reviews for a course
router.get('/course/:courseId', async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;
    
    const reviews = await prisma.review.findMany({
      where: {
        courseId
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error: any) {
    console.log('ERROR in fetching course reviews: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get review by ID
router.get('/:reviewId', async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId;
    
    const review = await prisma.review.findUnique({
      where: {
        id: reviewId
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true
          }
        },
        Course: true
      }
    });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: review
    });
  } catch (error: any) {
    console.log('ERROR in fetching review: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create review
router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { courseId, rating, comment } = req.body;
    
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: {
        courseId
      }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });
    
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in the course to leave a review'
      });
    }
    
    // Check if user has already reviewed the course
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        courseId
      }
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course'
      });
    }
    
    // Create review
    const review = await prisma.review.create({
      data: {
        id: generateResourceId('review'),
        userId,
        courseId,
        rating: Number(rating),
        comment
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true
          }
        }
      }
    });
    
    // Update course average rating
    const allReviews = await prisma.review.findMany({
      where: {
        courseId
      }
    });
    
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / allReviews.length;
    
    await prisma.course.update({
      where: {
        courseId
      },
      data: {
        avgStarRatings: averageRating
      }
    });
    
    return res.status(201).json({
      success: true,
      data: review
    });
  } catch (error: any) {
    console.log('ERROR in creating review: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update review
router.put('/:reviewId', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.reviewId;
    const { rating, comment } = req.body;
    
    // Check if review exists and belongs to user
    const review = await prisma.review.findUnique({
      where: {
        id: reviewId
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true
          }
        }
      }
    });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }
    
    // Update review
    const updatedReview = await prisma.review.update({
      where: {
        id: reviewId
      },
      data: {
        rating: Number(rating),
        comment
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true
          }
        }
      }
    });
    
    // Update course average rating
    const allReviews = await prisma.review.findMany({
      where: {
        courseId: review.courseId
      }
    });
    
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / allReviews.length;
    
    await prisma.course.update({
      where: {
        courseId: review.courseId
      },
      data: {
        avgStarRatings: averageRating
      }
    });
    
    return res.status(200).json({
      success: true,
      data: updatedReview
    });
  } catch (error: any) {
    console.log('ERROR in updating review: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete review
router.delete('/:reviewId', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.reviewId;
    
    // Check if review exists and belongs to user
    const review = await prisma.review.findUnique({
      where: {
        id: reviewId
      }
    });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }
    
    // Delete review
    await prisma.review.delete({
      where: {
        id: reviewId
      }
    });
    
    // Update course average rating
    const allReviews = await prisma.review.findMany({
      where: {
        courseId: review.courseId
      }
    });
    
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;
    
    await prisma.course.update({
      where: {
        courseId: review.courseId
      },
      data: {
        avgStarRatings: averageRating
      }
    });
    
    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error: any) {
    console.log('ERROR in deleting review: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's reviews
router.get('/user/reviews', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    const reviews = await prisma.review.findMany({
      where: {
        userId
      },
      include: {
        Course: {
          include: {
            instructor: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error: any) {
    console.log('ERROR in fetching user reviews: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router; 