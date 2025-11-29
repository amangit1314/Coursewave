import { Course } from "@prisma/client";
import { prisma } from "../../config/prisma";

export interface ServiceResponse {
  success: boolean;
  data?: any;
  message: string;
  status: number;
  error?: string;
}

export const getInstructorProfile = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
    const instructor = await prisma.instructor.findFirst({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
            about: true,
          },
        },
        courses: {
          include: {
            Category: true,
            sections: {
              include: {
                Chapter: true,
              },
            },
          },
        },
      },
    });

    if (!instructor) {
      return {
        success: false,
        message: "Instructor profile not found",
        status: 404,
      };
    }

    return {
      success: true,
      data: instructor,
      message: "Instructor profile fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getInstructorProfile:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch instructor profile",
      status: 500,
    };
  }
};

export const getInstructorAnalytics = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
    const instructor = await prisma.instructor.findFirst({
      where: { userId },
      include: { courses: true },
    });

    if (!instructor) {
      return {
        success: false,
        message: "Instructor not found",
        status: 404,
      };
    }

    const totalEarning = await prisma.instructorEarning.aggregate({
      _sum: { amount: true },
      where: { instructorId: instructor.userId },
    });

    const totalEnrolledStudents = await prisma.enrollment.aggregate({
      _count: { userId: true },
      where: {
        courseId: { in: instructor.courses.map((c: Course) => c.id) },
        status: "ACTIVE",
      },
    });

    const averageStarRating = await prisma.course.aggregate({
      where: { instructorId: instructor.userId },
      _avg: { averageRating: true },
    });

    return {
      success: true,
      data: {
        totalEarnings: totalEarning._sum?.amount || 0,
        currency: "USD",
        totalStudents: totalEnrolledStudents._count?.userId || 0,
        totalCourses: instructor.courses.length,
        createdCourses: instructor.courses,
        averageRating: averageStarRating._avg?.averageRating || 0,
      },
      message: "Instructor analytics fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getInstructorAnalytics:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch instructor analytics",
      status: 500,
    };
  }
};

export const getInstructorCourses = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
    const instructor = await prisma.instructor.findFirst({
      where: { userId },
    });

    if (!instructor) {
      return {
        success: false,
        message: "Instructor not found",
        status: 404,
      };
    }

    const courses = await prisma.course.findMany({
      where: { instructorId: instructor.userId },
      include: {
        Category: true,
        sections: {
          include: {
            Chapter: true,
          },
        },
        instructor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: courses,
      message: "Instructor courses fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getInstructorCourses:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch instructor courses",
      status: 500,
    };
  }
};

export const getInstructorStudents = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
    const instructor = await prisma.instructor.findFirst({
      where: { userId },
    });

    if (!instructor) {
      return {
        success: false,
        message: "Instructor not found",
        status: 404,
      };
    }

    const studentsCount = await prisma.enrollment.count({
      where: { course: { instructorId: instructor.userId } },
    });

    return {
      success: true,
      data: studentsCount,
      message: "Instructor students count fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getInstructorStudents:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch instructor students count",
      status: 500,
    };
  }
};

export const getPublicInstructorCourses = async (
  instructorId: string
): Promise<ServiceResponse> => {
  try {
    const courses = await prisma.course.findMany({
      where: { instructorId },
      include: {
        Category: true,
        sections: {
          include: {
            Chapter: true,
          },
        },
        instructor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: courses,
      message: "Public instructor courses fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getPublicInstructorCourses:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch public instructor courses",
      status: 500,
    };
  }
};

export const getPublicInstructorAnalytics = async (
  instructorId: string
): Promise<ServiceResponse> => {
  try {
    const instructor = await prisma.instructor.findUnique({
      where: { userId: instructorId },
      include: { courses: true },
    });

    if (!instructor) {
      return {
        success: false,
        message: "Instructor not found",
        status: 404,
      };
    }

    const totalEarning = await prisma.instructorEarning.aggregate({
      _sum: { amount: true },
      where: { instructorId },
    });

    const totalEnrolledStudents = await prisma.enrollment.aggregate({
      _count: { userId: true },
      where: {
        courseId: { in: instructor.courses.map((c: Course) => c.id) },
        status: "ACTIVE",
      },
    });

    const averageStarRating = await prisma.course.aggregate({
      where: { instructorId },
      _avg: { averageRating: true },
    });

    return {
      success: true,
      data: {
        totalEarning: (totalEarning._sum?.amount || 0).toString(),
        totalStudents: totalEnrolledStudents._count?.userId || 0,
        totalCourses: instructor.courses.length,
        createdCourses: instructor.courses,
        averageStarRating: averageStarRating._avg?.averageRating || 5.0,
      },
      message: "Public instructor analytics fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getPublicInstructorAnalytics:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch public instructor analytics",
      status: 500,
    };
  }
};
