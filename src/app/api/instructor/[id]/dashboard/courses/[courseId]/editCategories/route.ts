import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId: string;
    };
}) => {
    const instructorId = params?.id;
    const courseId = params.courseId;

    const reqBody = await req.json();
    const { categories } = reqBody;

    try {
        if (!instructorId || !courseId) {
            return NextResponse.json({ success: false, message: "Invalid Instructor/course Id" }, { status: 400 });
        }

        if (!categories) {
            return NextResponse.json({ success: false, message: "Please provide some categories to update ..." }, { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: { courseId, instructorID: instructorId }
        })

        if (!course) {
            return NextResponse.json({
                success: false, message: "Invalid course Id, no course found with this id"
            }, { status: 404 });
        }

        // Update the course with the new category names
        const updatedCourse = await prisma.course.update({
            where: {
                courseId: courseId,
            },
            data: {
                categories: categories,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                updatedCourse: updatedCourse,
            },
            message: 'Course categories successfully updated ...',
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to edit a course category ...',
        }, { status: 500 });
    }
}
