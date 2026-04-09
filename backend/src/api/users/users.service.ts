import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { hashPassword, verifyPassword } from "../../core/utils/password";
import { AppError } from "../../core/middleware/errorHandler";

// Synchronous role gate — expects roles pulled from req.user.roles by the
// controller. No DB query.
const requireAdmin = (roles: readonly string[]) => {
  if (!roles.includes(Role.ADMIN)) {
    throw new AppError("You are not authorized to access this resource", 403);
  }
};

export const getAllUsers = async (currentUserRoles: readonly string[]) => {
  requireAdmin(currentUserRoles);

  return prisma.user.findMany({
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
};

export const getUserById = async (
  userId: string,
  currentUserId: string,
  currentUserRoles: readonly string[]
) => {
  if (userId !== currentUserId) {
    requireAdmin(currentUserRoles);
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
    throw new AppError(`No user found with this id: ${userId}`, 404);
  }

  return user;
};

export const getUserProfile = async (userId: string) => {
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
    throw new AppError(`No user found with this id: ${userId}`, 404);
  }

  return user;
};

export const updateUserProfile = async (userId: string, data: any) => {
  const { name, about, profileImageUrl } = data;

  return prisma.user.update({
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
};

export const changePassword = async (userId: string, data: any) => {
  const { currentPassword, newPassword } = data;

  if (!currentPassword || !newPassword) {
    throw new AppError("Current password and new password are required", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.password) {
    throw new AppError("User password not found", 500);
  }

  const isPasswordValid = await verifyPassword(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new AppError("Current password is incorrect", 401);
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return null;
};

export const deleteUser = async (
  userId: string,
  currentUserId: string,
  currentUserRoles: readonly string[]
) => {
  if (userId !== currentUserId) {
    requireAdmin(currentUserRoles);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return null;
};

export const deleteSelf = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return null;
};

export const getUserArticles = async (userId: string) => {
  return prisma.blog.findMany({
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
};

export const getSavedArticles = async (userId: string) => {
  return prisma.savedArticle.findMany({
    where: { userId },
    include: { blog: true },
  });
};

export const saveArticle = async (userId: string, articleId: string) => {
  const existingSavedArticle = await prisma.savedArticle.findUnique({
    where: {
      userId_blogId: { userId, blogId: articleId },
    },
  });

  if (existingSavedArticle) {
    throw new AppError("Article already saved", 409);
  }

  return prisma.savedArticle.create({
    data: { userId, blogId: articleId },
  });
};

export const unsaveArticle = async (userId: string, articleId: string) => {
  const existingSavedArticle = await prisma.savedArticle.findUnique({
    where: {
      userId_blogId: { userId, blogId: articleId },
    },
  });

  if (!existingSavedArticle) {
    throw new AppError("No Saved Article Found with this id", 404);
  }

  await prisma.savedArticle.delete({
    where: {
      userId_blogId: { userId, blogId: articleId },
    },
  });

  return null;
};

export const getUserEnrollments = async (userId: string) => {
  return prisma.enrollment.findMany({
    where: { userId },
    include: { course: true },
  });
};

export const checkArticleSaved = async (userId: string, articleId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      savedArticles: {
        where: {
          blogId: articleId,
        },
        select: {
          blogId: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return { isSaved: user.savedArticles.length > 0 };
};

export const checkEnrollment = async (userId: string, courseId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });

  return { enrolled: !!enrollment };
};

export const reportUser = async (
  reporterId: string,
  targetId: string,
  reason: string,
  details?: string
) => {
  if (reporterId === targetId) {
    throw new AppError("You cannot report yourself", 400);
  }

  return prisma.userReport.create({
    data: {
      reporterId,
      targetId,
      reason,
      details,
    },
  });
};
