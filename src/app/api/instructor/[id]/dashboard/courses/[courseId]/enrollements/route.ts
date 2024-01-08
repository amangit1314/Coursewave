import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';
// get enrolled students for courseId
export const GET = async (req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
    }
}) => {

    const instructorId = params?.id;
    const courseId = params.courseId;
    
    try {
        const youAreInstructor = await prisma.course.findUnique({
            where: {
                courseId: courseId,
                instructorID: instructorId,
            }
        })

        let isInstructor = youAreInstructor ? true : false;
        let enrollements;

        if (isInstructor) {

            enrollements = await prisma.enrolledStudents.findUnique({
                where: {
                    courseId,
                }
            });

            //! if no enrollements
            if (!enrollements) {
                return NextResponse.json(
                    { message: `No enrollements found with courseId:${courseId}` },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: enrollements,
                message: 'Enrollements successfully fetched 🤘 ...',
            }, { status: 200 });
        } else {
            return NextResponse.json({
                success: false,
                error: 'You are not authorized to create a video resources',
                message: 'Unauthorized ⚠ ...',
            }, { status: 400 });
        }

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal server error 🤬❗⚠ ...',
        }, { status: 500 });
    }
}