import { NextRequest, NextResponse } from "next/server";
import { generateUid } from "@/helpers/id_helper";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';
// Get details of a course with particular course id [DONE]
export const GET = async (req: NextRequest, { params }: {
    params: {
        courseId?: string;
    };
}) => { 
    const courseId = params.courseId;
    try {
        if (!courseId) {
            return NextResponse.json({
                success: false,
                message: "Invalid Instructor and/or course Id"
            }, { status: 400 });
        }

        const response = await prisma.course.findUnique({
            where: {
                courseId
            }
        });

        return NextResponse.json({
            success: true,
            data: response,
            message: `Details of Course with courseId: ${courseId}, Successfully Fetched`,
        }, { status: 200 });
    }
    catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: `Internal Server Error, Failed to fetch details of  course with courseId:${courseId} ...`,
        }, { status: 500 });
    }
}

// delete a course [DONE]
export const DELETE = async (req: NextRequest, { params }: {
    params: {
        id: string;
        courseId: string;
    };
}) => {
    const courseId = params.courseId;
    const instructorId = params.id;

    try {
        if (!instructorId || !courseId) {
            return NextResponse.json({
                success: false,
                message: "Invalid Instructor and/or course Id"
            }, { status: 400 });
        }

        await prisma.course.delete({
            where: {
                courseId: courseId,
                instructorID: instructorId,
           }
        });

        return NextResponse.json({
            success: true,
            message: `Course with courseId: ${courseId}, Successfully Deleted`,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to delete a course ...',
        }, { status: 500 });
    }
}

// edit a course
export const POST = async (req: NextRequest, { params }: {
    params: {
        id: string;
        courseId: string;
    };
}) => {
    const instructorId = params.id;
    const courseId = params.courseId;

    const reqBody = await req.json();
    const { newCourseTitle, newCourseDescription } = reqBody;

    try {
        if (!instructorId || !courseId) {
            return NextResponse.json({
                success: false,
                message: "Invalid Instructor and/or course Id"
            }, { status: 400 });
        }

        const createdCourses = prisma.courseSection.findMany({
            where: { instructorId: instructorId },
        });

        return NextResponse.json({
            success: true,
            data: createdCourses,
            message: 'Course fetched successfully',
        }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to get created course ...',
        }, { status: 500 });
    }
}; 