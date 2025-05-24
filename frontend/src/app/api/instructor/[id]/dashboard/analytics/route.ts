import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import cors, { runMiddleware } from '@/lib/cors';

const prisma = new PrismaClient();

export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const instructorId  = params?.id!;

    console.log('InstructorID in instructor/[id]/dashboard/analytics/route.ts before fetching: ', instructorId);

    // Check if instructorId is provided
    if (!instructorId) {
      return new NextResponse('Instructor ID is required', { status: 400 });
    }

    // Fetch instructor data
    const instructor = await prisma.instructor.findUnique({
      where: {
        instructorID: instructorId,
      },
      include: {
        createdCourses: true,
      },
    });

    if (!instructor) {
      return new NextResponse('Instructor not found', { status: 404 });
    }

    // Calculate total number of students across all courses
    const studentsCount = await prisma.enrollment.count({
      where: {
        course: {
          instructorID: instructorId,
        },
      },
    });

    // Calculate average star rating across all courses
    const averageStarRating = await prisma.course.aggregate({
      where: {
        instructorID: instructorId,
      },
      _avg: {
        avgStarRatings: true,
      },
    });

    // Prepare the response data
    const analytics = {
      courses: instructor.createdCourses,
      studentsCount,
      averageStarRating: averageStarRating._avg.avgStarRatings || 5.0, // Default 5 if no ratings
    };

    return NextResponse.json(analytics, {status: 200});
  } catch (error) {
    console.error("Error fetching instructor analytics:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
