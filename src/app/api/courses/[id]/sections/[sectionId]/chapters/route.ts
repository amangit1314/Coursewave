import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
export const dynamic = 'force-dynamic';

// Get chapters of particular sectionId of a course
export const GET = async (req: NextRequest, { params }: {
  params: {
    id?: string;
    sectionId?: string;
  };
}
) => {
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

    const chapters = await db.chapter.findMany({
      where: {
        courseId,
        courseSection: section,
      }
    })

    console.log('Fetched Chapters:', chapters);

    return NextResponse.json({
      status: 'OK',
      success: true,
      data: chapters,
      message: `Chapters for course section with sectionId:${sectionId}, fetched successfully ✔️ ...`,
    }, { status: 200 });
  } catch (error: any) {
    console.log(`Failed to fetch course chapters for course section with sectionId: ${sectionId} ❌🚧 ...`, error.message);
    return NextResponse.json({
      status: 'ERROR',
      success: false,
      error: error.message,
      message: `Failed to fetch course chapters for course section with sectionId: ${ sectionId } ❌🚧 ...`,
    }, { status: 500 });
  }
}