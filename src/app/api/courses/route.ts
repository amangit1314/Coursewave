import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all courses
export const GET = async (req: NextRequest) => {
    // return await fetch(`${process.env.NEXT_PUBLIC_API}/courses`)
    try {
        const courses = await prisma.course.findMany({});
        return NextResponse.json({
            success: true,
            data: courses,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}