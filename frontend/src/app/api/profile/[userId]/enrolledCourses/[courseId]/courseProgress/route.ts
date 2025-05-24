import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import cors, { runMiddleware } from "@/lib/cors";

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse("OK", { status: 200 });
}

export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      userId: string;
      courseId: string;
    };
  },
) => {
  const userId = params?.userId || "";
  const courseId = params?.courseId || "";

  // Extracting query parameter for `includeChapterProgress`
  const { searchParams } = new URL(req.url);
  const includeChapterProgress = searchParams.get("includeChapterProgress") === "true";

  try {
    const course = await db.course.findUnique({
      where: {
        courseId: courseId,
      },
    });

    console.log("------------> Course id in get progress api: ", courseId);
    console.log("------------> User id in get progress api: ", userId);

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          status: "NOT_FOUND",
          message: "No course found with this courseId",
        },
        { status: 404 },
      );
    }

    const enrollment = await db.enrollment.findFirst({
      where: {
        courseId: userId,
        userId: courseId,
      },
      include: {
        ChapterProgress: true,
        courseProgress: true,
        course: true,
        user: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        {
          success: false,
          status: "ERROR",
          message: "[UNAUTHORIZED_ACCESS], User not enrolled in this course",
        },
        { status: 404 },
      );
    }

    let courseProgress;
    if (includeChapterProgress) {
      courseProgress = await db.courseProgress.findFirst({
        where: {
          enrollmentId: enrollment.enrollmentId,
          courseId,
        },
        include: {
          ChapterProgress: true,
          enrollments: true,
          course: true,
          user: true,
        },
      });
    } else {
      courseProgress = await db.courseProgress.findFirst({
        where: {
          enrollmentId: enrollment?.enrollmentId,
          courseId: courseId,
        },
        include: {
          enrollments: true,
          course: true,
          user: true,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        status: "OK",
        enrollment: enrollment,
        data: courseProgress,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        status: "ERROR",
        error: error.message,
        message: "Internal server error in getting course progress ...",
      },
      { status: 500 },
    );
  }
};


// export const GET = async (
//   req: NextRequest,
//   {
//     params,
//   }: {
//     params: {
//       userId: string;
//       courseId: string;
//     };
//   },
// ) => {
//   const userId = params?.userId! || "";
//   const courseId = params?.courseId! || "";

//   const reqBody = await req.json();
//   const { includeChapterProgress } = reqBody;

//   try {
//     const course = await db.course.findUnique({
//       where: {
//         courseId: courseId,
//       },
//     });

//     console.log("------------> Course id in get progress api: ", courseId);
//     console.log("------------> User id in get progress api: ", courseId);

//     if (!course) {
//       return NextResponse.json(
//         {
//           success: false,
//           status: "NOT_FOUND",
//           message: "No course found with this courseId",
//         },
//         { status: 404 },
//       );
//     }

//     const enrollment = await db.enrollment.findFirst({
//       where: {
//         courseId: courseId,
//         userId: userId,
//       },
//       include: {
//         ChapterProgress: true,
//         courseProgress: true,
//         course: true,
//         user: true,
//       },
//     });

//     if (!enrollment) {
//       return NextResponse.json(
//         {
//           success: false,
//           status: "ERROR",
//           message: "[UNAUTHORIZED_ACCESS], User not enrolled in this course",
//         },
//         { status: 404 },
//       );
//     }

//     let courseProgress;
//     if (includeChapterProgress) {
//       courseProgress = await db.courseProgress.findFirst({
//         where: {
//           enrollmentId: enrollment.enrollmentId,
//           courseId,
//         },
//         include: {
//           ChapterProgress: true,
//           enrollments: true,
//           course: true,
//           user: true,
//         },
//       });
//     } else {
//       courseProgress = await db.courseProgress.findFirst({
//         where: {
//           enrollmentId: enrollment?.enrollmentId,
//           courseId: courseId,
//         },
//         include: {
//           enrollments: true,
//           course: true,
//           user: true,
//         },
//       });
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         status: "OK",
//         enrollemnt: enrollment,
//         data: courseProgress,
//       },
//       { status: 200 },
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         success: false,
//         status: "ERROR",
//         enrror: error.message,
//         message: "Internal server error in getting course progress ...",
//       },
//       { status: 500 },
//     );
//   }
// };
