import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { db } from "@/lib/db";

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

//* GET user data
export const GET = async (req: NextRequest, { params }: { params: { userId: string }; }) => {
    try {
        const uid = params?.userId!;
        if (!uid) {
            return NextResponse
                .json({
                    status: false,
                    message: "Missing 'uid' in the request body.",
                }, { status: 400 });
        }

        const user = await db.user.findUnique({
            where: {
                id: uid,
            },
        });

        if (!user) {
            return NextResponse
                .json({
                    status: false,
                    message: `No user found with this id: ${uid} ...`,
                }, { status: 404 });
        }

        return NextResponse.json({
            status: true,
            data: user,
            message: "User details successfully accessed ✔️...",
        }, { status: 200 });
    } catch (error: any) {
        console.log(`ERROR in api/profile/[id]: ${error.message} `)
        return NextResponse
            .json({
                status: false,
                error: error,
                message: "Internal Server Error ...",
            }, { status: 500 });
    }
};
