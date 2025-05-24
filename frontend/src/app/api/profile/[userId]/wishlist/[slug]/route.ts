import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export const dynamic = 'force-dynamic';

// Remove a course from wishlist
export const DELETE = async (req: NextRequest, { params }: { params: { userId: string; slug: string } }) => {
  try {
    const userId = params?.userId!;
    const courseId = params?.slug!;

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

    // Check if course exists in wishlist (optional)
    const courseInWishlist = await prisma.wishList.findFirst({
      where: { userId, courses: { some: { courseId } } },
    });

    if (!courseInWishlist) {
      return NextResponse.json({
        success: false,
        error: 'Course is not currently in your wishlist.',
      }, { status: 400 });
    }

    // Disconnect the course from the wishlist
    await prisma.wishList.update({
      where: { userId },
      data: {
        courses: { disconnect: { courseId: courseId } },
      },
    });

    console.log('Course removed from wishlist successfully.');

    return NextResponse.json({
      success: true,
      message: 'Course removed from wishlist.',
    }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: 'Failed to remove course from wishlist.',
      message: error.message,
    }, { status: 500 });
  }
};
