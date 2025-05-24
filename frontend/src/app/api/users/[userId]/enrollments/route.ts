import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

import cors, { runMiddleware } from "@/lib/cors";

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse("OK", { status: 200 });
}

// Get all enrollments
export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      userId?: string;
    };
  },
) => {
  try {
    const uid = params?.userId!;

    if (!uid) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing or undefined uid parameter ...",
        },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: {
        id: uid,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "NOT FOUND, no user found with this uid ...",
        },
        { status: 404 },
      );
    }

    const enrolledCourses = await db.enrollment.findMany({
      where: {
        userId: uid,
      },
      select: {
        enrollmentId: true,
        userId: true,
        courseId: true,
        enrollmentDate: true,
        courseProgressId: true,
        courseTitle: true,
        enrollmentStatus: true,
        user: true,
        course: true,
        courseProgress: true,
        ChapterProgress: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log("Enrolled courses fetched successfully ...");

    return NextResponse.json(
      {
        success: true,
        data: enrolledCourses,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: "Failed to get enrolled courses by user ...",
      },
      { status: 500 },
    );
  }
};
