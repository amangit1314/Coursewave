import { NextRequest, NextResponse } from "next/server";
import { generateUid } from "@/helpers/id_helper";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();

// delete a course
export const DELETE = async (req: NextRequest, { params }: {
    params: {
        id?: string;
    };
}) => {

    const courseId = params?.id;
    const instructorId = '';

    const reqBody = await req.json();
    const { courseTitle, courseImage, courseCreatorName, coursePrice } = reqBody;

    try {
        const courseId = `course_${generateUid().split("-")[0]}`;
        const isFree = coursePrice ? false : true;

        if (!instructorId) {
            return NextResponse.json({ success: false, message: "Invalid Instructor Id" }, { status: 400 });
        }

        if (!courseTitle || !courseImage || !courseCreatorName) {
            return NextResponse.json({ success: false, message: "Course title, image and creator name are required fields ..." }, { status: 400 });
        }

        const createdCourse = await prisma.course.create({
            data: {
                courseId: courseId,
                courseTitle: courseTitle,
                courseImage: courseImage,
                courseCreator: courseCreatorName,
                coursePrice: coursePrice,
                isFree: isFree,
                instructorID: instructorId,
            }
        });

        return NextResponse.json({
            success: true,
            data: createdCourse,
            message: 'Course Successfully Created',
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to create a course ...',
        }, { status: 500 });
    }

}

// edit a course
export const POST = async (req: NextRequest, { params }: {
    params: {
        id?: string;
    };
}) => {
    const instructorId = params?.id;
    try {
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