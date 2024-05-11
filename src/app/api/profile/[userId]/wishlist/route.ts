import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Get all wishlisted courses for a user
export const GET = async (req: NextRequest, { params }: { params: { userId: string; } }) => {
  try {
    const userId = params?.userId;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing or undefined userId parameter.',
      }, { status: 400 });
    }

    // Fetch user and validate existence
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'NOT FOUND, no user found with this userId.',
      }, { status: 404 });
    }

    // Fetch wishlist courses using WishList model and courses relation
    const wishListedCourses = await prisma.wishList.findUnique({
      where: { userId },
      select: { courses: true },
    }).courses;

    console.log('Wishlisted courses fetched successfully.');

    return NextResponse.json({
      success: true,
      data: wishListedCourses,
    }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get wishlisted courses.',
      message: error.message,
    }, { status: 500 });
  }
};

// Add a course to wishlist
export const POST = async (req: NextRequest, { params }: { params: { userId: string; } }) => {
  try {
    const userId = params?.userId!;

    const reqBody = await req.json();
    const { courseId } = reqBody;

    if (!userId || !courseId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: userId and courseId.',
      }, { status: 400 });
    }

    // Validate user existence
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'NOT FOUND, no user found with this userId.',
      }, { status: 404 });
    }

    // Check if course already exists in wishlist (optional)
    const existingWishlistCourse = await prisma.wishList.findFirst({
      where: { userId, courses: { some: { courseId } } },
    });

    if (existingWishlistCourse) {
      return NextResponse.json({
        success: false,
        error: 'Course already exists in wishlist.',
      }, { status: 400 });
    }

    // Update wishlist by adding the course ID
    await prisma.wishList.update({
      where: { userId },
      data: {
        courses: { connect: { courseId: courseId } },
      },
    });

    console.log('Course added to wishlist successfully.');

    return NextResponse.json({
      success: true,
      message: 'Course added to wishlist.',
    }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add course to wishlist.',
      message: error.message,
    }, { status: 500 });
  }
};
