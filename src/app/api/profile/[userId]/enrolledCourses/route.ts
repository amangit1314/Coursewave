import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
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
            // Handle the case where the 'uid' parameter is missing or undefined.
            return NextResponse.json({
                success: false,
                error: 'Missing or undefined uid parameter',
            }, { status: 400 }); // Return a 400 Bad Request status code.
        }

        // Construct the correct URL based on the 'uid' parameter
        const currentURL = `https://localhost:3000/api/profile/${uid}`;

        const enrolledCourses = await prisma.enrolledCourses.findUnique({
            where: {
                uid: uid, // Provide the 'uid' here
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
