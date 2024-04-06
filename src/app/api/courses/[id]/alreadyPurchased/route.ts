import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: {
  params: {
    id?: string;
  };
}) => {
  const courseId = params.id;
  const reqBody = await req.json();
  const { userId } = reqBody;
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

    if (!course) {
      console.log(`No course found with such courseId: ${courseId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `No course found with such courseId: ${courseId} ...`,
      }, { status: 404 })
    }

    const purchase = await db.purchase.findUnique({
      where: {
        courseId: course.courseId,
        userId,
      }
    })

    return NextResponse.json({
      status: 'OK',
      success: true,
      data: {
        hasPurchased: !!purchase
      },
      message: `Course info for courseId:${courseId}, fetched successfully ✔️ ...`
    }, { status: 200 });
  } catch (error: any) {
    console.log(`Failed to get course info for courseId:${courseId} ❌🚧 ...`);
    return NextResponse.json({
      status: 'ERROR',
      success: false,
      error: error.message,
      message: `Failed to get course info for courseId:${courseId} ❌🚧 ...`
    }, { status: 500 });
  }
}