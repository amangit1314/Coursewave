import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/helpers/jwt-helper";
import cors, { runMiddleware } from '@/lib/cors';
import { generateUid } from "@/helpers/id-helper";
import { Category } from "@prisma/client";

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export const dynamic = 'force-dynamic';

//* create a course [WORKING]
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const instructorId = await params.id;
        const body = await req.json();

        // Verify the instructor exists
        const instructor = await db.instructor.findUnique({
            where: {
                instructorID: instructorId
            }
        });

        if (!instructor) {
            return NextResponse.json({
                success: false,
                message: "Instructor not found"
            }, { status: 404 });
        }

        // Create the course
        const course = await db.course.create({
            data: {
                courseId: `course_${generateUid().split("-")[0]}`,
                courseTitle: body.courseTitle,
                courseDescription: body.courseDescription,
                coursePrice: body.coursePrice,
                courseImage: body.courseImage,
                instructorID: instructorId,
                instructorName: instructor.instructorName,
                courseCategories: body.courseCategories || [],
                courseDuration: body.courseDuration || "1 hour 50 minutes",
                technologiesYouAreGoingToLearn: body.technologiesYouAreGoingToLearn || [],
                thisCourseIsFor: body.thisCourseIsFor || [],
                prerequisits: body.prerequisits || [],
                whatYouWillLearn: body.whatYouWillLearn || [],
                isPublished: false,
                isLive: false,
                isFree: false
            }
        });

        return NextResponse.json({
            success: true,
            data: course,
            message: "Course created successfully"
        });

    } catch (error: any) {
        console.error('Error creating course:', error);
        return NextResponse.json({
            success: false,
            message: "Failed to create course"
        }, { status: 500 });
    }
}

//* get all created courses by instructorId [WORKING]
export const GET = async (req: NextRequest, { params }: {
    params: {
        id?: string;
    };
}) => {
    const instructorId = params?.id;
    try {
        if (!instructorId) {
            return NextResponse.json({
                success: false,
                message: "Instructor Id not provided ...",
            }, { status: 400 });
        }

        console.log(`InstructorID :-> ${instructorId}`)

        const instructor = await db.instructor.findUnique({
            where: {
                instructorID: instructorId
            },
            select: {
                instructorID: true,
                instructorName: true,
                instructorEmail: true,
                instructorTag: true,
                instructorProfilePicUrl: true,
                aboutInstructor: true,
                createdCourses: true,
            }
        });

        if (!instructor) {
            return NextResponse.json({
                success: false,
                message: "No Instructor found with Provided Id ❌ ..."
            }, { status: 404 });
        }

        // console.log(`Created courses by InstructorID:-> ${instructorId}: `, instructor.createdCourses);
        return NextResponse.json({
            success: true,
            data: instructor.createdCourses,
            message: 'Courses fetched successfully ...',
        }, { status: 200 });
    } catch (error: any) {
        console.log('Internal Server error in instructor/[id]/courses: ', error.message);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: `Internal Server Error, Failed to get created courses for this id: ${instructorId} ...`,
        }, { status: 500 });
    }
};