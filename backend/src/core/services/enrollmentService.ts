import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Creates an enrollment for a user in a course.
 * If the enrollment already exists, it will not throw an error.
 */
export async function createEnrollment(userId: string, courseId: string) {
  try {
    return await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: 'ACTIVE', // default status
      },
    });
  } catch (error: any) {
    // Handle unique constraint violation (user already enrolled)
    if (error.code === 'P2002') {
      // Enrollment already exists, return existing enrollment
      return await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });
    }
    throw error;
  }
}
