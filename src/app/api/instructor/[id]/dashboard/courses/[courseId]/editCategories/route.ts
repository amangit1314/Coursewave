import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export const PATCH = async (req: NextRequest, { params }: {
    params: {
        id: string;
        courseId: string;
    };
}) => {
    const instructorId = params?.id!;
    const courseId = params?.courseId!;

    const reqBody = await req.json();
    const { categories } = reqBody;

    try {
        if (!instructorId || !courseId) {
            console.log('Invalid Instructor/course Id in editCategories api');
            return NextResponse.json({ success: false, message: "Invalid Instructor/course Id" }, { status: 400 });
        }

        if (!categories) {
            console.log('NO_CATEGORIES, Please provide some categories to update ..');
            return NextResponse.json({ success: false, message: "Please provide some categories to update ..." }, { status: 400 });
        }

        const course = await db.course.findUnique({
            where: { courseId, instructorID: instructorId }
        })

        if (!course) {
            console.log('Invalid course Id, no course found with this id');
            return NextResponse.json({
                success: false, message: "Invalid course Id, no course found with this id"
            }, { status: 404 });
        }

        // Update the course with the new category names
        const updatedCourse = await db.course.update({
            where: {
                courseId: courseId,
            },
            data: {
                courseCategories: categories,
            },
        });

        console.log('Update course after updating categories: ', updatedCourse);
        return NextResponse.json({
            success: true,
            data: {
                updatedCourse: updatedCourse,
            },
            message: 'Course categories successfully updated ...',
        }, { status: 200 });
    } catch (error: any) {
        console.log('ERROR IN instructor/id/dashboard/courses/courseId/editCategories :', error.message);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to edit a course category ...',
        }, { status: 500 });
    }
}
