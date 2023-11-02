import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all courses
export const GET = async (req: NextRequest, { params }: {
    params: {
        id?: string;
    };
}) => {
    // return await fetch(`${process.env.NEXT_PUBLIC_API}/courses`)
    try {
        const courseId = params.id;
        const course = await prisma.course.findUnique({
            where: {
                courseId
            }
        });

        if (!course) throw Error("Course not found");

        return NextResponse.json({
            success: true,
            data: course,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}