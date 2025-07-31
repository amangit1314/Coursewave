import express, { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../api/auth/auth.middleware';

// import { invalidateCache } from '../config/redis';
import { hashPassword } from '../core/utils/password';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all users (admin only)
router.get('/', verifyToken, async (req: Request, res: Response) => {
    try {
        // Check if user is admin
        const userRoles = await prisma.userRole.findMany({
            where: {
                userId: req.user.id
            }
        });
        
        const isAdmin = userRoles.some((role: { role: string }) => role.role === 'ADMIN');
        
        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to access this resource'
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
                roles: true
            }
        });
        
        return res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error: any) {
        console.log('ERROR in fetching users: ', error.message);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Get user by ID (admin or self)
router.get('/:userId', verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const currentUserId = req.user.id;
        
        // Check if user is admin or requesting their own profile
        const userRoles = await prisma.userRole.findMany({
            where: {
                userId: currentUserId
            }
        });
        
        const isAdmin = userRoles.some((role: { role: string }) => role.role === 'ADMIN');
        
        if (!isAdmin && userId !== currentUserId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to access this resource'
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
                roles: true
            }
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
        console.log(`ERROR in api/users/[id]: ${error.message} `)
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error ...",
        });
    }
});

// Get created articles for a user
router.get('/:userId/articles', verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const currentUserId = req.user.id;
        
        // Check if user is admin or requesting their own articles
        const userRoles = await prisma.userRole.findMany({
            where: {
                userId: currentUserId
            }
        });
        
        const isAdmin = userRoles.some((role: { role: string }) => role.role === 'ADMIN');
        
        if (!isAdmin && userId !== currentUserId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to access this resource'
            });
        }
        
        // Get created articles for the user
        const articles = await prisma.blog.findMany({
            where: {
                authorId: userId,
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
                createdAt: 'desc'
            }
        });

        return res.status(200).json({
            success: true,
            data: articles,
            message: "User created articles fetched successfully ✔️...",
        });
    } catch (error: any) {
        console.log(`ERROR in api/users/[userId]/articles: ${error.message} `)
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error ...",
        });
    }
});

// Update user profile (self only)
router.put('/profile', verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { name, about, profileImageUrl } = req.body;
        
        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name,
                about,
                profileImageUrl
            },
            select: {
                id: true,
                name: true,
                email: true,
                profileImageUrl: true,
                about: true,
                isEmailVerified: true
            }
        });
        
        // Invalidate user cache
        // await invalidateCache.users(userId);
        
        return res.status(200).json({
            success: true,
            data: updatedUser,
            message: "Profile updated successfully"
        });
    } catch (error: any) {
        console.log(`ERROR in updating user profile: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error"
        });
    }
});

// Change password (self only)
router.put('/change-password', verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        
        // Get user with password
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Verify current password
        const { verifyPassword } = require('../utils/password');
        const isPasswordValid = await verifyPassword(currentPassword, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }
        
        // Hash new password
        const hashedPassword = await hashPassword(newPassword);
        
        // Update password
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: hashedPassword
            }
        });
        
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error: any) {
        console.log(`ERROR in changing password: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error"
        });
    }
});

// Delete user (admin or self)
router.delete('/:userId', verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const currentUserId = req.user.id;
        
        // Check if user is admin or deleting their own account
        const userRoles = await prisma.userRole.findMany({
            where: {
                userId: currentUserId
            }
        });
        
        const isAdmin = userRoles.some((role: { role: string }) => role.role === 'ADMIN');
        
        if (!isAdmin && userId !== currentUserId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this user'
            });
        }
        
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Delete user
        await prisma.user.delete({
            where: {
                id: userId
            }
        });
        
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error: any) {
        console.log(`ERROR in deleting user: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error"
        });
    }
});

// Get enrolled courses for the logged-in user
router.get('/:userId/enrollments', async (req: Request, res: Response) => {
    try {
        // const userId = req.user.id; // Extracted from the token by verifyToken middleware
        const userId = req.params.userId;

        const enrollments = await prisma.enrollment.findMany({
            where: {
                userId: userId
            },
            include: {
                course: true // Assuming there is a relation to the course in the schema
            }
        });

        return res.status(200).json({
            success: true,
            data: enrollments,
            message: "Enrolled courses fetched successfully"
        });
    } catch (error: any) {
        console.log(`ERROR in fetching enrollments: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error"
        });
    }
});

// Check if user is enrolled in a specific course
router.get('/:userId/enrollments/:courseId', async (req, res) => {
    try {
        const { userId, courseId } = req.params;
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
            message: "Internal Server Error"
        });
    }
});

export default router; 