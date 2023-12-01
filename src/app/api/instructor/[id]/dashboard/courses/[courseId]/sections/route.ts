// create a course section

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { generateUid } from "@/helpers/id_helper";

dotenv.config();
const prisma = new PrismaClient();

// create a course Section
export const POST = async (req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId: string;
    };
}) => {

    const instructorId = params?.id;
    const courseId = params.courseId;

    const reqBody = await req.json();
    const { courseSectionTitle, courseSectionDescription } = reqBody;

    try {
        const courseSectionId = `course_${courseId}_${generateUid().split("-")[0]}`;

        if (!instructorId || !courseId) {
            return NextResponse.json({ success: false, message: "Invalid Instructor/course Id" }, { status: 400 });
        }

        if (!courseSectionTitle || !courseSectionDescription) {
            return NextResponse.json({ success: false, message: "Course section title is required field ..." }, { status: 400 });
        }

        const createdCourseSection = await prisma.course.update({
            where: {
                courseId: courseId,
                instructorID: instructorId,
            },
            data: {
                courseId: courseId,
            }
        });

        return NextResponse.json({
            success: true,
            data: createdCourseSection,
            message: 'Course Section Successfully Created',
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to edit a course category ...',
        }, { status: 500 });
    }

}
