import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { absoluteUrl } from "@/utils/utils";

export const dynamic = "force-dynamic";

import cors, { runMiddleware } from "@/lib/cors";
import { EnrollementWithProgress } from "@/types/enrollment-with-progress";

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse("OK", { status: 200 });
}

// Get all enrollments
export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      userId?: string;
      courseId?: string;
    };
  },
) => {
  try {
    const uid = params?.userId!;
    const courseId = params?.courseId!;

    if (!uid) {
      // Handle the case where the 'uid' parameter is missing or undefined.
      return NextResponse.json(
        {
          success: false,
          error: "Missing or undefined uid parameter",
        },
        { status: 400 },
      ); // Return a 400 Bad Request status code.
    }

    if (!courseId) {
      // Handle the case where the 'uid' parameter is missing or undefined.
      return NextResponse.json(
        {
          success: false,
          error: "Missing or undefined courseId parameter",
        },
        { status: 400 },
      ); // Return a 400 Bad Request status code.
    }

    const currentURL = `api/profile/${uid}`;

    // const enrolledCourses = await db.enrollment.findMany({
    //     where: {
    //         userId: uid, // Provide the 'uid' here
    //     }
    // });

    // Fetch enrollments with related course data
    const enrollments = await db.enrollment.findMany({
      where: { userId: uid },
      include: {
        course: {
          select: {
            courseId: true,
            courseTitle: true,
            coursePrice: true,
            CourseProgress: true,
          },
        },
      },
    });

    // Format data for use in the frontend
    const formattedEnrollments: EnrollementWithProgress[] = enrollments.map(
      (enrollment) => ({
        enrollmentId: enrollment.enrollmentId,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        enrollmentDate: enrollment.enrollmentDate,
        courseProgressId: enrollment.courseProgressId,
        courseTitle: enrollment.course?.courseTitle || "Unknown Title",
        enrollmentStatus: enrollment.enrollmentStatus,
        coursePrice: enrollment.course?.coursePrice || 0,
        progress: 0,
        certificate: "None",
        validity: "Unknown",
        createdAt: enrollment.createdAt ? new Date(enrollment.createdAt) : null,
        updatedAt: enrollment.updatedAt ? new Date(enrollment.updatedAt) : null,
      }),
    );

    // if (!enrolledCourses) {
    //     return NextResponse.json({
    //         success: true,
    //         message: 'No enrolled courses ...'
    //     }, { status: 200 });
    // }

    return NextResponse.json(
      {
        success: true,
        data: formattedEnrollments,
        // {
        //     enrolledCourses,
        //     currentURL, // Include the current URL in the response
        // },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
};
