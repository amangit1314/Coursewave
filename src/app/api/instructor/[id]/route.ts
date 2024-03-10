import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: {
    params: {
        id?: string;
    };
}) {
    const instructorId = params?.id;

    try {
        if (!instructorId) {
            return NextResponse.json({
                success: false,
                data: false,
                message: "No Instructor Id Provided ⚠ ..."
            }, { status: 400 });
        }

        const foundedInstructor = await db.instructor.findUnique({
            where: {
                instructorID: instructorId
            },
            select: {
                instructorID: true,
                instructorName: true,
                instructorEmail: true,
                instructorTag: true,
                instructorProfilePicUrl: true,
                aboutInstructor: true,
                createdCourses: true,
            }
        });

        if (!foundedInstructor) {
            return NextResponse.json({
                success: false,
                message: "No Instructor found with Provided Id ❌ ..."
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: foundedInstructor,
            message: "Provided Instructor Id is correct ✔..."
        }, { status: 200 });

    } catch (error: any) {
        console.log('ERROR in api/instructor/[id]/route.ts : ', error.message);
        return NextResponse.json({
            success: false,
            message: "Internal server error ❌ ..."
        }, { status: 500 });
    }
}