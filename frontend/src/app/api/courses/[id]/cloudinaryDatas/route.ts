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
  { params }: { params: { id: string } },
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
        { status: 400 },
      );
    }

    console.log("Courseid in cloudinaryDatas api: ", courseId);

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
    });

    if (!course) {
      console.log(`No course found with such courseId: ${courseId} ...`);
      return NextResponse.json(
        {
          status: "ERROR",
          success: false,
          message: `No course found with such courseId: ${courseId} ...`,
        },
        { status: 404 },
      );
    }

    // Cache the course data in Redis
    // await redis.set(`course:${courseId}`, JSON.stringify(course), 'EX', 3600); // Cache for 1 hour

    const cloudinaryDatas = await db.cloudinaryData.findMany({
        where: {courseId},
        include: {
            audio: true,
            video: true,
            chapter: true,
            course: true,
        }
    });

    return NextResponse.json(
      {
        status: "OK",
        success: true,
        data: cloudinaryDatas,
        message: `Course CloudinaryData array fetched successfully ✔️ ...`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(`Failed to get course info for courseId:${courseId} ❌🚧 ...`, error.message);
    return NextResponse.json(
      {
        status: "ERROR",
        success: false,
        error: error.message,
        message: `Failed to get course cloudinary data array for courseId:${courseId} in catch block, in /api/courses/[id]/cloudinaryDatas/route.ts ❌🚧 ...`,
      },
      { status: 500 },
    );
  }
};
