import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";

const prisma = new PrismaClient();

// export default function handler(req: NextRequest, res: NextApiResponse) {
//     if (req.method === 'POST') {
//         POST(req);
//     } else if (req.method === 'GET') {
//         GET(req);
//     }
//     else {
//         res.status(405).json({ message: 'Method not allowed' }); // Handle other HTTP methods
//     }
// }



// Get course info
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

// update course information
export const POST = async (req: NextRequest, { params, body }: {
    params: {
        id?: string;
    };
    body: {
        fieldName: string;
        fieldValue: any;
    };
}) => {
    try {
        const courseId = params.id;
        const { fieldName, fieldValue } = body;

        const course = await prisma.course.findUnique({
            where: {
                courseId
            }
        });

        if (!course) throw new Error("Course not found");

        // Check if the specified field exists in the course
        if (!(fieldName in course)) {
            throw new Error(`Field '${fieldName}' does not exist in the course`);
        }

        // Update the specified field for the course
        const updatedCourse = await prisma.course.update({
            where: {
                courseId
            },
            data: {
                [fieldName]: fieldValue
            }
        });

        return NextResponse.json({
            success: true,
            data: updatedCourse,
            message: `field ${fieldName} successfully updated ...`,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}
