import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

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
export const PATCH = async (req: NextRequest, { params }: { params: { id: string; courseId: string; } }) => {
    const instructorId = params?.id!;
    const courseId = params?.courseId!;

    const reqBody = await req.json();
    const {
        newCourseTitle,
        newCourseDescription,
        newCourseImage,
        newCoursePrice,
        newDealPrice,
        newDiscount,
        newCourseCategories,
        newCourseDuration,
        newTechnologies,
        newThisCourseIsForPoints,
        newPrerequisits,
        newWhatYouWillLearnPoints,
        newInstructorName,
    } = reqBody;

    try {
        if (!instructorId || !courseId) {
            return NextResponse.json({
                success: false,
                message: "Invalid Instructor and/or course Id",
            }, { status: 400 });
        }

        const course = await db.course.findUnique({
            where: {
                courseId,
            }
        })

        if (!course) {
            return NextResponse.json({
                success: false,
                message: "NOT_FOUND, no course found with provided course Id",
            }, { status: 404 });
        }

        const updatedCourse = await db.course.update({
            where: {
                courseId,
                instructorID: instructorId
            },
            data: {
                courseTitle: newCourseTitle,
                courseDescription: newCourseDescription,
                courseImage: newCourseImage,
                coursePrice: newCoursePrice.toString(),
                dealPrice: newDealPrice,
                discount: newDiscount,
                courseCreator: newInstructorName,
                courseCategories: newCourseCategories,
                courseDuration: newCourseDuration,
                instructorName: newInstructorName,
                technologiesYouAreGoingToLearn: newTechnologies,
                thisCourseIsFor: newThisCourseIsForPoints,
                prerequisits: newPrerequisits,
                whatYouWillLearn: newWhatYouWillLearnPoints,
            },
        });

        console.log('Updated course: ', updatedCourse);

        return NextResponse.json({
            success: true,
            message: 'Course updated successfully ...',
            data: updatedCourse,
        }, { status: 200 });
    } catch (error: any) {
        console.error('ERROR in updating course inside instructor/id/dashboard/courses/courseId:', error.message);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to update course ...',
        }, { status: 500 });
    }
};
