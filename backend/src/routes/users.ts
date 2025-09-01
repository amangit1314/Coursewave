import express, { Request, Response } from "express";
import { Router } from "express";

import { verifyToken } from "../api/auth/auth.middleware";
import { prisma } from "../config/prisma";
import {
  CACHE_PREFIXES,
  CACHE_TTL,
  cacheManager,
  invalidateCache,
} from "../config/redis";
import { hashPassword } from "../core/utils/password";

const router: Router = express.Router();

// ------------------------------------ USERS --------------------------------
// Get all users (admin only)
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId: req.user.id,
      },
    });

    const isAdmin = userRoles.some(
      (role: { role: string }) => role.role === "ADMIN"
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
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

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    console.log("ERROR in fetching users: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get user by ID (admin or self)
router.get("/:userId", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id;

    // Check if user is admin or requesting their own profile
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId: currentUserId,
      },
    });

    const isAdmin = userRoles.some(
      (role: { role: string }) => role.role === "ADMIN"
    );

    if (!isAdmin && userId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
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
      return res.status(404).json({
        success: false,
        message: `No user found with this id: ${userId} ...`,
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: "User details successfully accessed ✔️...",
    });
  } catch (error: any) {
    console.log(`ERROR in api/users/[id]: ${error.message} `);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error ...",
    });
  }
});

// ------------------------------------ ARTICLES -------------------------------
// Get created articles for a user
router.get("/articles", verifyToken, async (req: Request, res: Response) => {
  try {
    // const userId = req.params.userId;
    const currentUserId = req.user.id;

    // // Check if user is admin or requesting their own articles
    // const userRoles = await prisma.userRole.findMany({
    //     where: {
    //         userId: currentUserId
    //     }
    // });

    // const isAdmin = userRoles.some((role: { role: string }) => role.role === 'ADMIN');

    // if (!isAdmin && userId !== currentUserId) {
    //     return res.status(403).json({
    //         success: false,
    //         message: 'You are not authorized to access this resource'
    //     });
    // }

    // Get created articles for the user
    const articles = await prisma.blog.findMany({
      where: {
        authorId: currentUserId,
      },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: articles,
      message: "User created articles fetched successfully ✔️...",
    });
  } catch (error: any) {
    console.log(`ERROR in api/users/[userId]/articles: ${error.message} `);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error ...",
    });
  }
});

// get saved articles
router.get("/users/saved-articles", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Extracted from the token

    // Fetch saved articles for the user
    const savedArticles = await prisma.savedArticle.findMany({
      where: {
        userId,
      },
      include: {
        blog: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: savedArticles,
      message: "Saved articles fetched successfully",
    });
  } catch (error: any) {
    console.error(`ERROR in fetching saved articles: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
});

// save article
router.post(
  "/users/saved-articles/:articleId",
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id; // Extracted from the token
      const { articleId } = req.params;

      // Check if the article is already saved
      const existingSavedArticle = await prisma.savedArticle.findUnique({
        where: {
          userId_blogId: {
            userId,
            blogId: articleId,
          },
        },
      });

      if (existingSavedArticle) {
        return res.status(400).json({
          success: false,
          message: "Article already saved",
        });
      }

      // Save the article
      const savedArticle = await prisma.savedArticle.create({
        data: {
          userId,
          blogId: articleId,
        },
      });

      return res.status(201).json({
        success: true,
        data: savedArticle,
        message: "Article saved successfully",
      });
    } catch (error: any) {
      console.error(`ERROR in saving article: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Internal Server Error",
      });
    }
  }
);

// unsave article
router.post(
  "/users/saved-articles/:articleId",
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id; // Extracted from the token
      const { articleId } = req.params;

      // Check if the article is already saved
      const existingSavedArticle = await prisma.savedArticle.findUnique({
        where: {
          userId_blogId: {
            userId,
            blogId: articleId,
          },
        },
      });

      if (!existingSavedArticle) {
        return res.status(404).json({
          success: false,
          message: "No Saved Article Found with this id",
        });
      }

      // Save the article
      await prisma.savedArticle.delete({
        where: {
          userId_blogId: { userId, blogId: articleId },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Article unsaved successfully",
      });
    } catch (error: any) {
      console.error(`ERROR in un-saving article: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Internal Server Error",
      });
    }
  }
);

// ------------------------------------ PROFILE --------------------------------

// Get logged in user info (self)
router.get("/me", verifyToken, async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user.id;

    // Check if user is admin or requesting their own profile
    // const userRoles = await prisma.userRole.findMany({
    //     where: {
    //         userId: currentUserId
    //     }
    // });

    // const isAdmin = userRoles.some((role: { role: string }) => role.role === 'ADMIN');

    // if (!isAdmin) {
    //     return res.status(403).json({
    //         success: false,
    //         message: 'You are not authorized to access this resource'
    //     });
    // }

    const user = await prisma.user.findUnique({
      where: {
        id: currentUserId,
      },
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
      return res.status(404).json({
        success: false,
        message: `No user found with this id: ${currentUserId} ...`,
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: "User details successfully accessed ✔️...",
    });
  } catch (error: any) {
    console.log(`ERROR in api/users/[id]: ${error.message} `);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error ...",
    });
  }
});

// Update user profile (self only)
router.put("/profile", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, about, profileImageUrl } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        about,
        profileImageUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        about: true,
        isEmailVerified: true,
      },
    });

    // Invalidate user cache
    // await invalidateCache.users(userId);

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.log(`ERROR in updating user profile: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
});

// Change password (self only)
router.put(
  "/change-password",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verify current password
      const { verifyPassword } = require("../utils/password");
      const isPasswordValid = await verifyPassword(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error: any) {
      console.log(`ERROR in changing password: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Internal Server Error",
      });
    }
  }
);

// Delete user (only admin)
router.delete("/:userId", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id;

    // Check if user is admin or deleting their own account
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId: currentUserId,
      },
    });

    const isAdmin = userRoles.some(
      (role: { role: string }) => role.role === "ADMIN"
    );

    if (!isAdmin && userId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this user",
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.log(`ERROR in deleting user: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
});

// Delete user (only self)
router.delete("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user.id;

    // Check if user is admin or deleting their own account
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId: currentUserId,
      },
    });

    const isAdmin = userRoles.some(
      (role: { role: string }) => role.role === "ADMIN"
    );

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id: currentUserId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user
    await prisma.user.delete({
      where: {
        id: currentUserId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.log(`ERROR in deleting user: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
});

// ------------------------------------ ENROLLMENTS --------------------------------
// Get enrolled courses (logged-in user)
router.get(
  "/enrollments",
  // verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id; // Extracted from the token

      const cacheKey = `${CACHE_PREFIXES.USERS}:${userId}:enrollments`;

      // 1️⃣ Try getting from cache
      const cachedEnrollments = await cacheManager.get(cacheKey);
      if (cachedEnrollments) {
        return res.status(200).json({
          success: true,
          data: cachedEnrollments,
          message: "Enrolled courses fetched successfully (from cache)",
        });
      }

      // 2️⃣ Not in cache — fetch from DB
      const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: { course: true },
      });

      // 3️⃣ Store in cache for next time
      await cacheManager.set(cacheKey, enrollments, CACHE_TTL.MEDIUM);

      return res.status(200).json({
        success: true,
        data: enrollments,
        message: "Enrolled courses fetched successfully",
      });
    } catch (error: any) {
      console.error(`ERROR in fetching enrollments: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Internal Server Error",
      });
    }
  }
);

// Check if user is enrolled in a specific course (logged-in user)
router.get("/enrollments/:courseId", verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id; // Extracted from the token by verifyToken middleware
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    return res.status(200).json({
      enrolled: !!enrollment,
    });
  } catch (error: any) {
    console.log(`ERROR in checking enrollment: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
});

export default router;
