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

    const reviews = await db.review.findMany({
      where: {
        courseId,
      }
    })


    return NextResponse.json({
      success: true,
      data: reviews,
      message: 'Course reviews fetched successfully ✔️ ...',
    }, { status: 200 });

  } catch (error: any) {
    console.log(`Error in api/courses/[id]/reviews: ${error.message}`)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Internal server error 🤬❗⚠ ...',
    }, { status: 500 });
  }
}