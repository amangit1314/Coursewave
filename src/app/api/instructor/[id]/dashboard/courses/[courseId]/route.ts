import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import dotenv from "dotenv";
dotenv.config();

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

        const response = await db.course.findUnique({
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
        console.log('ERROR IN instructor/id/dashboard/courses/courseId :', error.message);
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

        await db.course.delete({
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
        console.log('ERROR IN instructor/id/dashboard/courses/courseId :', error.message);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to delete a course ...',
        }, { status: 500 });
    }
}

// edit a course-details
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

        const createdCourses = db.courseSection.findMany({
            where: { instructorId: instructorId },
        });

        return NextResponse.json({
            success: true,
            data: createdCourses,
            message: 'Course fetched successfully',
        }, { status: 200 });
    } catch (error: any) {
        console.log('ERROR IN instructor/id/dashboard/courses/courseId :', error.message);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to get created course ...',
        }, { status: 500 });
    }
};

/**
 * // update course information
export const POST = async (req: NextRequest, { params, body }: {
    params: {
        id?: string;
    };
    body: {
        fieldName: string;
        fieldValue: any;
    };
}) => {
    try {
        const courseId = params.id;
        const { fieldName, fieldValue } = body;

        const course = await db.course.findUnique({
            where: {
                courseId
            }
        });

        if (!course) throw new Error("Course not found");

        // Check if the specified field exists in the course
        if (!(fieldName in course)) {
            throw new Error(`Field '${fieldName}' does not exist in the course`);
        }

        // Update the specified field for the course
        const updatedCourse = await db.course.update({
            where: {
                courseId
            },
            data: {
                [fieldName]: fieldValue
            }
        });

        return NextResponse.json({
            success: true,
            data: updatedCourse,
            message: `field ${fieldName} successfully updated ...`,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}

 */