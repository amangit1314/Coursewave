import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

// Get all course chapters
export const GET = async (req: NextRequest, { params }: {
  params: {
    id: string;
    chapterId: string;
  };
}) => {
  const courseId = params?.id;
  const chapterId = params?.chapterId;

  try {
    if (!courseId || !chapterId) {
      console.log('Course id or chapter id not provided, these are required field ...')
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: 'Course id or chapter id not provided, these are required field ...'
      }, { status: 400 })
    }

    const course = await db.course.findUnique({
      where: {
        courseId
      }
    });

    if (!course) {
      console.log(`No course found with such courseId: ${courseId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `No course found with such courseId: ${courseId} ...`,
      }, { status: 404 })
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      }
    })

    if (!chapter) {
      console.log(`No chapter found with such chapterId: ${chapterId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `No chapter found with such chapterId: ${chapterId} ...`,
      }, { status: 404 })
    }

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId
      }
    });

    return NextResponse.json({
      status: 'OK',
      success: true,
      data: muxData,
      message: `Chapter muxdata for chapterId:${chapterId}, fetched successfully ✔️ ...`
    }, { status: 200 });
  } catch (error: any) {
    console.log(`Failed to get chapter muxdata for chapterId:${chapterId} ❌🚧, ERROR: `, error.message);
    return NextResponse.json({
      status: 'ERROR',
      success: false,
      error: error.message,
      message: `Failed to get chapter muxdata for chapterId:${chapterId} ❌🚧 ...`
    }, { status: 500 });
  }
}