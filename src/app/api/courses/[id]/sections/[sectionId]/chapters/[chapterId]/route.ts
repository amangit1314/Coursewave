import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest, { params }: {
  params: {
    id?: string;
    sectionId?: string;
    chapterId?: string;
  };
}) => {
  const courseId = params.id;
  const sectionId = params.sectionId;
  const chapterId = params.chapterId;

  try {
    if (!courseId || !sectionId || !chapterId) {
      console.log('Course id or Section id or Chapter id not provided, courseId, sectionId and chapterId are required fields ...')
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: 'courseId, sectionId and chapterId are required fields ...'
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

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
        courseSection: section,
      }
    });

    if (!chapter) {
      console.log(`No chapter found with such chapterId: ${chapterId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `No chapter found with such chapterId: ${chapterId} ..`,
      }, { status: 404 })
    }

    return NextResponse.json({
      status: 'OK',
      success: true,
      data: chapter,
      message: `Course chapter info with chapterId:${chapterId}, fetched successfully ✔️ ...`
    }, { status: 200 });
  } catch (error: any) {
    console.log(`Failed to get chapter info with chapterId:${chapterId} ❌🚧 ...`);
    return NextResponse.json({
      status: 'ERROR',
      success: false,
      error: error.message,
      message: `Failed to get chapter info with chapterId:${chapterId} ❌🚧 ...`
    }, { status: 500 });
  }
}