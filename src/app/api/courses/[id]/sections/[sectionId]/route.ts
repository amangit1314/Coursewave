import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export const GET = async (req: NextRequest, { params }: {
  params: {
    id?: string;
    sectionId?: string;
  };
}) => {
  const courseId = params.id;
  const sectionId = params.sectionId;

  try {
    if (!courseId || !sectionId) {
      console.log('Course id or Section id not provided, courseId and sectionId are required fields ...')
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: 'courseId or sectionId are not provided, these are required fields ...'
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

    const section = await db.courseSection.findUnique({
      where: {
        courseSectionId: sectionId,
        courseId: courseId,
      }
    })

    if (!section) {
      console.log(`No course section found with such sectionId: ${sectionId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `No course section found with such sectionId: ${sectionId} ...`,
      }, { status: 404 })
    }

    return NextResponse.json({
      status: 'OK',
      success: true,
      data: section,
      message: `Course section info for sectionId:${sectionId}, fetched successfully ✔️ ...`
    }, { status: 200 });
  } catch (error: any) {
    console.log(`Failed to get course section info for sectionId:${sectionId} ❌🚧 ...`);
    return NextResponse.json({
      status: 'ERROR',
      success: false,
      error: error.message,
      message: `Failed to get course section info for sectionId:${sectionId} ❌🚧 ...`
    }, { status: 500 });
  }
}