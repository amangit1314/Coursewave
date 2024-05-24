import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { absoluteUrl } from "@/utils/utils";

export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

// Get all enrolled courses
export const GET = async (req: NextRequest, { params }: {
    params: {
        userId?: string;
        courseId?: string;
    };
}) => {
    try {
        const uid = params?.userId;
        const courseId = params?.courseId;

        if (!uid) {
            // Handle the case where the 'uid' parameter is missing or undefined.
            return NextResponse.json({
                success: false,
                error: 'Missing or undefined uid parameter',
            }, { status: 400 }); // Return a 400 Bad Request status code.
        }

        if (!courseId) {
            // Handle the case where the 'uid' parameter is missing or undefined.
            return NextResponse.json({
                success: false,
                error: 'Missing or undefined courseId parameter',
            }, { status: 400 }); // Return a 400 Bad Request status code.
        }

       
        const currentURL = `api/profile/${uid}`;

        const enrolledCourses = await db.enrollment.findMany({
            where: {
                userId: uid, // Provide the 'uid' here
            }
        });

        if (!enrolledCourses) {
            return NextResponse.json({
                success: true,
                message: 'No enrolled courses ...'
            }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            data: {
                enrolledCourses,
                currentURL, // Include the current URL in the response
            },
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}
