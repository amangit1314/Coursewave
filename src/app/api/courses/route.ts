import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// import { NextApiResponse } from "next";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
// export default function handler(req: NextRequest, res: NextApiResponse) {
//     if (req.method === 'GET') {
//         GET(req); // Call the POST handler
//     } else {
//         res.status(405).json({ message: 'Method not allowed' }); // Handle other HTTP methods
//     }
// }


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