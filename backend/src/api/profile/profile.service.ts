import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma";

export interface ServiceResponse {
  success: boolean;
  data?: any;
  message: string;
  status: number;
  error?: string;
}

export const getAllUsers = async (): Promise<ServiceResponse> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        about: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: users,
      message: "Users fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getAllUsers:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch users",
      status: 500,
    };
  }
};

export const getUserById = async (userId: string): Promise<ServiceResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        about: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: true,
          },
        },
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        status: 404,
      };
    }

    return {
      success: true,
      data: user,
      message: "User fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getUserById:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch user",
      status: 500,
    };
  }
};

export const updateUser = async (
  userId: string,
  userData: any
): Promise<ServiceResponse> => {
  try {
    const { name, email, profileImageUrl, about } = userData;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        status: 404,
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        profileImageUrl,
        about,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        about: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      data: updatedUser,
      message: "User updated successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in updateUser:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to update user",
      status: 500,
    };
  }
};

export const deleteUser = async (userId: string): Promise<ServiceResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        status: 404,
      };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return {
      success: true,
      message: "User deleted successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in deleteUser:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to delete user",
      status: 500,
    };
  }
};

export const changeUserRole = async (
  userId: string,
  role: string
): Promise<ServiceResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        status: 404,
      };
    }

    // Remove existing roles and add new role
    await prisma.userRole.deleteMany({
      where: { userId },
    });

    await prisma.userRole.create({
      data: {
        userId,
        role: role.toUpperCase() as Role,
      },
    });

    return {
      success: true,
      message: `User role changed to ${role} successfully`,
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in changeUserRole:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to change user role",
      status: 500,
    };
  }
};

export const getUserStats = async (): Promise<ServiceResponse> => {
  try {
    const totalUsers = await prisma.user.count();
    const totalInstructors = await prisma.userRole.count({
      where: { role: "INSTRUCTOR" },
    });
    const totalStudents = await prisma.userRole.count({
      where: { role: "USER" },
    });
    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    return {
      success: true,
      data: {
        totalUsers,
        totalInstructors,
        totalStudents,
        recentUsers,
      },
      message: "User statistics fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getUserStats:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch user statistics",
      status: 500,
    };
  }
};
