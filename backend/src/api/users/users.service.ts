import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { hashPassword, verifyPassword } from "../../core/utils/password";

interface ServiceResponse {
  success: boolean;
  data?: any;
  message: string;
  status: number;
  error?: string;
}

export const getAllUsers = async (
  currentUserId: string
): Promise<ServiceResponse> => {
  try {
    const userRoles = await prisma.userRole.findMany({
      where: { userId: currentUserId },
    });

    // const isAdmin = userRoles.some(
    //   (role: { role: string }) => role.role.toUpperCase()  === "ADMIN"
    // );

    const isAdmin = userRoles.some((role) => role.role === Role.ADMIN);

    if (!isAdmin) {
      return {
        success: false,
        message: "You are not authorized to access this resource",
        status: 403,
      };
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        roles: true,
      },
    });

    return {
      success: true,
      data: users,
      message: "Users fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in fetching users: ", error.message);
    return {
      success: false,
      error: error.message,
      message: "Internal Server Error",
      status: 500,
    };
  }
};

export const getUserById = async (
  userId: string,
  currentUserId: string
): Promise<ServiceResponse> => {
  try {
    const userRoles = await prisma.userRole.findMany({
      where: { userId: currentUserId },
    });

    // const isAdmin = userRoles.some(
    //   (role: { role: string }) => role.role.toUpperCase()  === "ADMIN"
    // );

    const isAdmin = userRoles.some((role) => role.role === Role.ADMIN);

    if (!isAdmin && userId !== currentUserId) {
      return {
        success: false,
        message: "You are not authorized to access this resource",
        status: 403,
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        about: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        roles: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: `No user found with this id: ${userId}`,
        status: 404,
      };
    }

    return {
      success: true,
      data: user,
      message: "User details successfully accessed",
      status: 200,
    };
  } catch (error: any) {
    console.log(`ERROR in getUserById: ${error.message}`);
    return {
      success: false,
      error: error.message,
      message: "Internal Server Error",
      status: 500,
    };
  }
};

export const getUserProfile = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        about: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        roles: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: `No user found with this id: ${userId}`,
        status: 404,
      };
    }

    return {
      success: true,
      data: user,
      message: "User details successfully accessed",
      status: 200,
    };
  } catch (error: any) {
    console.log(`ERROR in getUserProfile: ${error.message}`);
    return {
      success: false,
      error: error.message,
      message: "Internal Server Error",
      status: 500,
    };
  }
};

export const updateUserProfile = async (
  userId: string,
  data: any
): Promise<ServiceResponse> => {
  try {
    const { name, about, profileImageUrl } = data;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, about, profileImageUrl },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        about: true,
        isEmailVerified: true,
      },
    });

    return {
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log(`ERROR in updateUserProfile: ${error.message}`);
    return {
      success: false,
      error: error.message,
      message: "Internal Server Error",
      status: 500,
    };
  }
};

// export const changePassword = async (
//   userId: string,
//   data: any
// ): Promise<ServiceResponse> => {
//   try {
//     const { currentPassword, newPassword } = data;

    

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       return {
//         success: false,
//         message: "User not found",
//         status: 404,
//       };
//     }

//     const isPasswordValid = await verifyPassword(
//       currentPassword,
//       user.password
//     );
//     if (!isPasswordValid) {
//       return {
//         success: false,
//         message: "Current password is incorrect",
//         status: 401,
//       };
//     }

//     const hashedPassword = await hashPassword(newPassword);

//     await prisma.user.update({
//       where: { id: userId },
//       data: { password: hashedPassword },
//     });

//     return {
//       success: true,
//       message: "Password changed successfully",
//       status: 200,
//     };
//   } catch (error: any) {
//     console.log(`ERROR in changePassword: ${error.message}`);
//     return {
//       success: false,
//       error: error.message,
//       message: "Internal Server Error",
//       status: 500,
//     };
//   }
// };

export const changePassword = async (
  userId: string,
  data: any
): Promise<ServiceResponse> => {
  try {
    const { currentPassword, newPassword } = data;

    // Add validation
    if (!currentPassword || !newPassword) {
      return {
        success: false,
        message: "Current password and new password are required",
        status: 400,
      };
    }

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

    // Add check for user.password
    if (!user.password) {
      return {
        success: false,
        message: "User password not found",
        status: 500,
      };
    }

    const isPasswordValid = await verifyPassword(
      currentPassword,
      user.password
    );
    
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Current password is incorrect",
        status: 401,
      };
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message: "Password changed successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log(`ERROR in changePassword: ${error.message}`);
    return {
      success: false,
      error: error.message,
      message: "Internal Server Error",
      status: 500,
    };
  }
};

export const deleteUser = async (
  userId: string,
  currentUserId: string
): Promise<ServiceResponse> => {
  try {
    const userRoles = await prisma.userRole.findMany({
      where: { userId: currentUserId },
    });

    const isAdmin = userRoles.some(
      (role: { role: string }) => role.role === "ADMIN"
    );

    if (!isAdmin && userId !== currentUserId) {
      return {
        success: false,
        message: "You are not authorized to delete this user",
        status: 403,
      };
    }

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
    console.log(`ERROR in deleteUser: ${error.message}`);
    return {
      success: false,
      error: error.message,
      message: "Internal Server Error",
      status: 500,
    };
  }
};

export const deleteSelf = async (userId: string): Promise<ServiceResponse> => {
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
    console.log(`ERROR in deleteSelf: ${error.message}`);
    return {
      success: false,
      error: error.message,
      message: "Internal Server Error",
      status: 500,
    };
  }
};

export const getUserArticles = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
    const articles = await prisma.blog.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        title: true,
        content: true,
        coverImage: true,
        readTime: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: articles,
      message: "User created articles fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log(`ERROR in getUserArticles: ${error.message}`);
    return {
      success: false,
      error: error.message,
      message: "Internal Server Error",
      status: 500,
    };
  }
};

export const getSavedArticles = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
    const savedArticles = await prisma.savedArticle.findMany({
      where: { userId },
      include: { blog: true },
    });

    return {
      success: true,
      data: savedArticles,
      message: "Saved articles fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log(`ERROR in getSavedArticles: ${error.message}`);
    return {
      success: false,
      error: error.message,
      message: "Internal Server Error",
      status: 500,
    };
  }
};

export const saveArticle = async (
  userId: string,
  articleId: string
): Promise<ServiceResponse> => {
  try {
    const existingSavedArticle = await prisma.savedArticle.findUnique({
      where: {
        userId_blogId: { userId, blogId: articleId },
      },
    });

    if (existingSavedArticle) {
      return {
        success: false,
        message: "Article already saved",
        status: 400,
      };
    }

    const savedArticle = await prisma.savedArticle.create({
      data: { userId, blogId: articleId },
    });

    return {
      success: true,
      data: savedArticle,
      message: "Article saved successfully",
      status: 201,
    };
  } catch (error: any) {
    console.log(`ERROR in saveArticle: ${error.message}`);
    return {
      success: false,
      error: error.message,
      message: "Internal Server Error",
      status: 500,
    };
  }
};

export const unsaveArticle = async (
  userId: string,
  articleId: string
): Promise<ServiceResponse> => {
  try {
    const existingSavedArticle = await prisma.savedArticle.findUnique({
      where: {
        userId_blogId: { userId, blogId: articleId },
      },
    });

    if (!existingSavedArticle) {
      return {
        success: false,
        message: "No Saved Article Found with this id",
        status: 404,
      };
    }

    await prisma.savedArticle.delete({
      where: {
        userId_blogId: { userId, blogId: articleId },
      },
    });

    return {
      success: true,
      message: "Article unsaved successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log(`ERROR in unsaveArticle: ${error.message}`);
    return {
      success: false,
      error: error.message,
      message: "Internal Server Error",
      status: 500,
    };
  }
};

export const getUserEnrollments = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
    });

    return {
      success: true,
      data: enrollments,
      message: "Enrolled courses fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log(`ERROR in getUserEnrollments: ${error.message}`);
    return {
      success: false,
      error: error.message,
      message: "Internal Server Error",
      status: 500,
    };
  }
};

export const checkArticleSaved = async (userId: string, articleId: string) => {
  try {
    // Find user and check if they have saved this article
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        savedArticles: {
          where: {
            blogId: articleId
          },
          select: {
            blogId: true
          }
        }
      }
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        status: 404
      };
    }

    const isSaved = user.savedArticles.length > 0;

    return {
      success: true,
      data: { isSaved },
      message: isSaved ? "Article is saved" : "Article is not saved",
      status: 200
    };

  } catch (error: any) {
    console.error("Error checking article saved status:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to check article saved status",
      status: 500
    };
  }
};

export const checkEnrollment = async (
  userId: string,
  courseId: string
): Promise<ServiceResponse> => {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    return {
      success: true,
      data: { enrolled: !!enrollment },
      message: "Enrollment status checked successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log(`ERROR in checkEnrollment: ${error.message}`);
    return {
      success: false,
      error: error.message,
      message: "Internal Server Error",
      status: 500,
    };
  }
};
