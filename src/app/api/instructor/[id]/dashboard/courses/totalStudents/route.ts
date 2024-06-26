import { NextRequest, NextResponse } from "next/server";
import { generateUid } from "@/helpers/id_helper";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

//* get total number of students of the instructor
export const GET = async (req: NextRequest, { params }: {
    params: {
        id: string;
    };
}) => {

    const instructorId = params?.id;

    try {
        if (!instructorId) {
            return NextResponse.json({ success: false, message: "Invalid Instructor Id" }, { status: 400 });
        }

        const instructor = await db.instructor.findUnique({
            where: {
                instructorID: instructorId
            }
        })

        if (!instructor) {
            return NextResponse.json({
                success: false,
                message: `[NOT FOUND], Invalid Instructor Id, no instructor found with this instructorId: ${instructorId}`
            }, { status: 404 });
        }

        const enrollmentCount = await db.enrollment.count({
            where: {
                course: {
                    instructorID: instructorId,
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: enrollmentCount,
            message: 'Total number of students of the instructor are fetched successully ✔...',
        }, { status: 200 });
    } catch (error: any) {
        console.error('ERROR inside instructor/id/dashboard/courses: ', error.message)
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to fetch total number of students of the instructor 😒...',
        }, { status: 500 });
    }
}