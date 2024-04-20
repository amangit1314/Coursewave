import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest, { params }: {
  params: {
    id?: string;
  }
}) => {
  const courseId = params?.id;

  try {

    if (!courseId) {
      return NextResponse.json({
        message: "Missing courseId ..."
      }, { status: 422 });
    }

    const course = await db.course.findUnique({
      where: {
        courseId: courseId,
      }
    })

    if (!course) {
      return NextResponse.json({
        success: false,
        message: `There is no course with courseId: ${courseId}`,
      }, { status: 404 });
    }

    const courseAttachments = await db.courseAttachment.findMany({
      where: {
        courseId,
      }
    })


    return NextResponse.json({
      success: true,
      data: courseAttachments,
      message: 'Course attachments fetched successfully ✔️ ...',
    }, { status: 200 });

  } catch (error: any) {
    console.log(`Error in api/courses/[id]/attachments: ${error.message}`)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Internal server error 🤬❗⚠ ...',
    }, { status: 500 });
  }
}