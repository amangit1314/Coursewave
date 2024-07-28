import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import cors, { runMiddleware } from "@/lib/cors";
// import { redis } from "@/config/redis";

export const dynamic = "force-dynamic";

// Handle the OPTIONS request
export const OPTIONS = async (req: NextRequest) => {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse("OK", { status: 200 });
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const courseId = params?.id!;
  try {
    if (!courseId) {
      console.log("Course id not provided, courseId is required field ...");
      return NextResponse.json(
        {
          status: "ERROR",
          success: false,
          message: "Course id not provided, courseId is required field ...",
        },
        { status: 400 }
      );
    }

    // Check if the course data is in Redis cache
    // const cachedCourse = await redis.get(`course:${courseId}`);
    // if (cachedCourse) {
    //     console.log(`Cache hit for courseId: ${courseId}`);
    //     return NextResponse.json({
    //         status: 'OK',
    //         success: true,
    //         data: JSON.parse(cachedCourse),
    //         message: `Course info for courseId:${courseId} fetched from cache successfully ✔️ ...`
    //     }, { status: 200 });
    // }

    // console.log(`Cache miss for courseId: ${courseId}. Fetching from database...`);
    const course = await db.course.findUnique({
      where: { courseId },
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
      },
    });

    if (!course) {
      console.log(`No course found with such courseId: ${courseId} ...`);
      return NextResponse.json(
        {
          status: "ERROR",
          success: false,
          message: `No course found with such courseId: ${courseId} ...`,
        },
        { status: 404 }
      );
    }

    // Cache the course data in Redis
    // await redis.set(`course:${courseId}`, JSON.stringify(course), 'EX', 3600); // Cache for 1 hour

    return NextResponse.json(
      {
        status: "OK",
        success: true,
        data: course,
        message: `Course info for courseId:${courseId} fetched successfully ✔️ ...`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(`Failed to get course info for courseId:${courseId} ❌🚧 ...`);
    return NextResponse.json(
      {
        status: "ERROR",
        success: false,
        error: error.message,
        message: `Failed to get course info for courseId:${courseId} in catch block, in /api/courses/[id]/route.ts ❌🚧 ...`,
      },
      { status: 500 }
    );
  }
};
