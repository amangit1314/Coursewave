import { NextRequest, NextResponse } from "next/server";
import { generateUid } from "@/helpers/id_helper";
import { db } from "@/lib/db";
import dotenv from "dotenv";
dotenv.config();
export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

//* get all course Sections
export const GET = async (req: NextRequest, { params }: {
    params: {
        id: string;
        courseId: string;
    };
}) => {
    const instructorId = params?.id;
    const courseId = params?.courseId;

    const reqBody = await req.json();
    const { courseSectionNumber, courseSectionTitle, courseSectionDescription } = reqBody;

    const courseSectionId = `course_${courseId}_${generateUid().split("-")[0]}`;

    try {


        if (!instructorId || !courseId) {
            return NextResponse.json({ success: false, message: "Invalid Instructor/course Id" }, { status: 400 });
        }

        if (!courseSectionTitle || !courseSectionDescription) {
            return NextResponse.json({ success: false, message: "Course section title and description are required field ..." }, { status: 400 });
        }

        const instructor = await db.instructor.findUnique({
            where: {
                instructorID: instructorId,
            }
        })

        if (!instructor) {
            return NextResponse.json({ success: false, message: `No instructor found with this instructorid: ${instructorId} ...` }, { status: 404 });
        }

        const course = await db.course.findUnique({
            where: {
                instructorID: instructorId,
                courseId,
            },
            select: {
                courseSections: true,
            }
        })

        if (!course) {
            return NextResponse.json({ success: false, message: `No course found with this courseid: ${courseId} ...` }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: course.courseSections,
            message: 'Course Sections Successfully Created ...',
        }, { status: 200 });
    } catch (error: any) {
        console.log('ERROR IN instructor/id/dashboard/courses/courseId/sections :', error.message);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to get all course sections ...',
        }, { status: 500 });
    }
}

//* create a course Section
export const POST = async (req: NextRequest, { params }: {
    params: {
        id: string;
        courseId: string;
    };
}) => {
    const instructorId = params?.id;
    const courseId = params?.courseId;

    const reqBody = await req.json();
    const { courseSectionNumber, courseSectionTitle, courseSectionDescription } = reqBody;

    const courseSectionId = `course_${courseId}_${generateUid().split("-")[0]}`;

    try {
        if (!instructorId || !courseId) {
            return NextResponse.json({ success: false, message: "Invalid Instructor/course Id" }, { status: 400 });
        }

        if (!courseSectionTitle || !courseSectionDescription) {
            return NextResponse.json({ success: false, message: "Course section title and description are required field ..." }, { status: 400 });
        }

        const instructor = await db.instructor.findUnique({
            where: {
                instructorID: instructorId,
            }
        })

        if (!instructor) {
            return NextResponse.json({ success: false, message: `No instructor found with this instructorid: ${instructorId} ...` }, { status: 404 });
        }

        const course = await db.course.findUnique({
            where: {
                instructorID: instructorId,
                courseId,
            }
        })

        if (!course) {
            return NextResponse.json({ success: false, message: `No course found with this courseid: ${courseId} ...` }, { status: 404 });
        }

        const courseSection = await db.courseSection.findFirst({
            where: {
                courseId,
                courseSectionTitle,
            }
        })

        if (courseSection) {
            return NextResponse.json({
                success: false,
                message: `A section with this sectionTitle: ${courseSectionTitle},  already exists ...`
            }, { status: 400 });
        }

        const createdCourseSection = await db.courseSection.create({
            data: {
                courseSectionId,
                courseId,
                instructorId,
                courseSectionNumber,
                courseSectionTitle,
                courseSectionDescription
            },
        });

        return NextResponse.json({
            success: true,
            data: createdCourseSection,
            message: 'Course Section Successfully Created ...',
        }, { status: 200 });
    } catch (error: any) {
        console.log('ERROR IN instructor/id/dashboard/courses/courseId/sections :', error.message);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to edit a course category ...',
        }, { status: 500 });
    }
}