import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export const POST = async (req: NextRequest, { params }: {
  params: {
    userId: string
    courseId: string;
  };
}) => {
  const userId = params?.userId!;
  const courseId = params?.courseId!;

  try {
    if (!courseId || !userId) {
      console.log('Course id or User id not provided, courseId & userId are required field ...')
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: 'MISSING REQUIRED FIELDS, courseId & userid are required field ...'
      }, { status: 400 })
    }

    const course = await db.course.findUnique({
      where: {
        courseId
      },
      select: {
        courseId: true,
        courseTitle: true,
        courseImage: true,
        courseCreator: true,
        courseDescription: true,
        isFree: true,
        coursePrice: true,
        dealPrice: true,
        discount: true,
        instructorID: true,
        isLive: true,
        courseCategories: true,
        instructorName: true,
        isPublished: true,
        avgStarRatings: true,
        courseDuration: true,
        technologiesYouAreGoingToLearn: true,
        thisCourseIsFor: true,
        prerequisits: true,
        whatYouWillLearn: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        reviews: true,
        enrollments: true,
        payments: true,
        purchases: true,
        attachments: true,
        courseSections: true,
        categories: true,
        chapters: true,
        instructorEarningsFromThisCourse: true,
      }
    });

    console.log('courseId in the course is alreadyPurchased: ', courseId);

    if (!course) {
      console.log(`No course found with such courseId in already purchased: ${courseId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `No course found with such courseId in already purchased: ${courseId} ...`,
      }, { status: 404 })
    }

    const enrollment = await db.enrollment.findFirst({
      where: {
        courseId: course.courseId,
        userId: userId as string,
      }
    })

    const purchase = await db.purchase.findFirst({
      where: {
        courseId: course.courseId,
        userId: userId as string,
      }
    })

    const hasPurchased = !!(purchase && enrollment);

    console.log('course is already purchased ...')

    return NextResponse.json({
      status: 'OK',
      success: true,
      data: { hasPurchased, enrollment: enrollment, purchase: purchase },
      message: `Course with courseId:${courseId}, is already purchased by userId: ${userId} ? -> : ${hasPurchased} ✔️ ...`
    }, { status: 200 });
  } catch (error: any) {
    console.log(`Failed to get course info for courseId:${courseId} in already purchased ❌🚧 ...`);
    return NextResponse.json({
      status: 'ERROR',
      success: false,
      error: error.message,
      message: `Failed to get course info for courseId:${courseId} ❌🚧 ...`
    }, { status: 500 });
  }
}