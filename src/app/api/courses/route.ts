import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

// Get all courses
export const GET = async (req: NextRequest) => {
    try {
        const courses = await db.course.findMany();
        return NextResponse.json({
            success: true,
            status: "OK",
            data: courses,
            message: "Courses successfully fetched ..."
        }, { status: 200 });
    } catch (error: any) {
        console.log('ERROR in fetching courses from api/courses/route.ts: ', error.message);
        return NextResponse.json({
            success: false,
            status: "ERROR",
            error: error.message,
            message: "Failed to fetch courses from database in api/courses/route.ts ..."
        }, { status: 500 });
    }
}