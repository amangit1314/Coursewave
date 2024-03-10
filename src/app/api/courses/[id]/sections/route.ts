import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

// Get all course sections
export const GET = async (req: NextRequest, { params }: {
  params: {
    id?: string;
  };
}) => {
  const courseId = params.id;

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

    const courseSections = await db.courseSection.findMany({
      where: {
        courseId,
      }
    })

    return NextResponse.json({
      status: 'OK',
      success: true,
      data: courseSections,
      message: `Course sections for courseId:${courseId}, fetched successfully ✔️ ...`
    }, { status: 200 });
  } catch (error: any) {
    console.log(`Failed to get course sections for courseId:${courseId} ❌🚧, ERROR: `, error.message);
    return NextResponse.json({
      status: 'ERROR',
      success: false,
      error: error.message,
      message: `Failed to get course sections for courseId:${courseId} ❌🚧 ...`
    }, { status: 500 });
  }
}