import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../api/auth/auth.middleware";
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const prisma = new PrismaClient();

// Get user's enrolled courses
router.get("/enrolledCourses", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Get user's enrollments with course details
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: userId,
      },
      include: {
        course: {
          include: {
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
            Category: true,
            sections: {
              include: {
                Chapter: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Enrolled courses retrieved successfully",
      data: enrollments,
    });
  } catch (error: any) {
    console.log("ERROR in fetching enrolled courses: ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get user profile
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

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
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    console.log("ERROR in fetching user profile: ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update user profile
router.put("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { newUserName, newProfileImage } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: newUserName,
        profileImageUrl: newProfileImage,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        about: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.log("ERROR in updating user profile: ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Become an instructor
router.post("/become-instructor", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Check if the user is already an instructor
    const existingInstructor = await prisma.instructor.findUnique({
      where: { userId },
    });

    if (existingInstructor) {
      return res.status(400).json({
        success: false,
        message: "User is already an instructor",
      });
    }

    // Update user role to INSTRUCTOR
    await prisma.userRole.upsert({
      where: {
        userId_role: {
          userId: userId,
          role: 'USER',
        }
      },
      update: {
        role: 'INSTRUCTOR',
      },
      create: {
        id: uuidv4(),
        userId: userId,
        role: 'INSTRUCTOR',
      },
    });

    // Create an instructor profile
    const newInstructor = await prisma.instructor.create({
      data: {
        // id: uuidv4(),
        userId: userId,
        bio: "Experienced instructor ready to share knowledge.",
        expertise: [],
        updatedAt: new Date(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "User has become an instructor",
      data: newInstructor,
    });

  } catch (error: any) {
    console.log("ERROR in becoming an instructor: ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router; 