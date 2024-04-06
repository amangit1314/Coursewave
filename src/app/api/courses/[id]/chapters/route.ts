import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Get all course chapters
export const GET = async (req: NextRequest, { params }: {
  params: {
    id?: string;
  };
}) => {
  const courseId = params?.id!;

  try {
    if (!courseId) {
      console.log('Course id not provided, courseId is required field ...')
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: 'Course id not provided, courseId is required field ...'
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

    const courseChapters = await db.chapter.findMany({
      where: {
        courseId,
      }
    })

    return NextResponse.json({
      status: 'OK',
      success: true,
      data: courseChapters,
      message: `Course chapters for courseId:${courseId}, fetched successfully ✔️ ...`
    }, { status: 200 });
  } catch (error: any) {
    console.log(`Failed to get course chapters for courseId:${courseId} ❌🚧, ERROR: `, error.message);
    return NextResponse.json({
      status: 'ERROR',
      success: false,
      error: error.message,
      message: `Failed to get course chapters for courseId:${courseId} ❌🚧 ...`
    }, { status: 500 });
  }
}