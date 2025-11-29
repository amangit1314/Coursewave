
import { PrismaClient } from "@prisma/client";

import { z } from "zod";
import { generateResourceId } from "../../../core/utils/idGenerator";

const prisma = new PrismaClient();

export const getAllReviewsForCourseIdService = async (courseId: string) => {
  const data = await prisma.review.findMany({
    where: { courseId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImageUrl: true,
          about: true,
          shortSummary: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  console.log(`reviews of COURSE ID[${courseId}] : `, data);
  return data;
};

export const writeReviewService = async ({
  courseId,
  userId,
  rating,
  comment,
}: {
  courseId: string;
  userId: string;
  rating: number;
  comment: string;
}) => {
  const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(10).max(1000),
  });

  const parseResult = reviewSchema.safeParse({ rating, comment });
  if (!parseResult.success) {
    throw { code: 400, message: parseResult.error.issues };
  }

  const existingReview = await prisma.review.findFirst({
    where: { courseId, userId },
  });

  if (existingReview) {
    throw { code: 400, message: "You have already reviewed this course." };
  }

  return prisma.review.create({
    data: {
      id: generateResourceId("review"),
      courseId,
      userId,
      rating,
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImageUrl: true,
          about: true,
          shortSummary: true,
        },
      },
    },
  });
};

export const editReviewService = async ({
  courseId,
  reviewId,
  userId,
  rating,
  comment,
}: {
  courseId: string;
  reviewId: string;
  userId: string;
  rating?: number;
  comment?: string;
}) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.courseId !== courseId) {
    throw { code: 404, message: "Review not found." };
  }

  if (review.userId !== userId) {
    throw { code: 403, message: "You are not authorized to edit this review." };
  }

  const reviewSchema = z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().max(1000).optional(),
  });

  const parseResult = reviewSchema.safeParse({ rating, comment });
  if (!parseResult.success) {
    throw { code: 400, message: parseResult.error.issues };
  }

  return prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: rating ?? review.rating,
      comment: comment ?? review.comment,
      updatedAt: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImageUrl: true,
          about: true,
          shortSummary: true,
        },
      },
    },
  });
};

export const deleteReviewService = async ({
  courseId,
  reviewId,
  userId,
}: {
  courseId: string;
  reviewId: string;
  userId: string;
}) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.courseId !== courseId) {
    throw { code: 404, message: "Review not found." };
  }

  if (review.userId !== userId) {
    throw { code: 403, message: "You are not authorized to delete this review." };
  }

  await prisma.review.delete({ where: { id: reviewId } });
};
