import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

// Get all enrolled courses
export const GET = async (req: NextRequest, { params }: {
    params: {
        userId?: string;
    };
}) => {
    try {
        const uid = params?.userId;

        if (!uid) {
            return NextResponse.json({
                success: false,
                error: 'Missing or undefined uid parameter ...',
            }, { status: 400 });
        }

        const enrolledCourses = await db.enrollement.findMany({
            where: {
                userId: uid
            },
            select: {
                enrollmentId: true,
                userId: true,
                courseId: true,
                enrollmentDate: true,
                completionStatus: true,
                user: true,
                course: true,
            }
        });

        return NextResponse.json({
            success: true,
            data: enrolledCourses,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Failed to get enrolled courses by user ...'
        }, { status: 500 });
    }
}
