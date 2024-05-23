import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export const GET = async (req: NextRequest, { params }: {
  params: {
    userId: string;
    courseId: string;
  }
}) => {
  // const reqBody = await req.json();
  // const { } = reqBody;

  const userId = params?.userId;
  const courseId = params?.courseId;
  const includeChapters = req.nextUrl.searchParams.has('chapterProgress');

  try {

    const course = await db.course.findUnique({
      where: {
        courseId: courseId,
      }
    });

    if (!course) {
      return NextResponse.json({
        success: false,
        status: 'NOT_FOUND',
        message: 'No course found with this courseId',
      }, { status: 404 });
    }

    const enrollment = await db.enrollment.findFirst({
      where: {
        courseId: courseId,
        userId: userId,
      }
    });

    if (!enrollment) {
      return NextResponse.json({
        success: false,
        status: 'NOT_FOUND',
        message: 'User not enrolled in this course',
      }, { status: 404 });
    }

    let courseProgress;
    if (includeChapters) {
      // Fetch courseProgress with chapterProgress using a single query
      courseProgress = await db.courseProgress.findFirst({
        where: {
          enrollmentId: enrollment.enrollmentId,
          courseId,
        },
        include: { ChapterProgress: true }, // Include related chapterProgress data
      });
    } else {
      courseProgress = await db.courseProgress.findFirst({
        where: {
          enrollmentId: enrollment?.enrollmentId,
          courseId: courseId,
        }
      });
    }

    return NextResponse.json({
      success: true,
      status: 'OK',
      enrollment,
      data: courseProgress,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: 'ERROR',
      enrror: error.message,
      message: 'Internal server error in getting course progress ...'
    }, { status: 500 });
  }
}