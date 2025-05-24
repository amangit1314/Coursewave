import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

// Get all users
export const GET = async (req: NextRequest) => {
    try {
        const users = await db.user.findMany({});
        return NextResponse.json({
            success: true,
            data: users,
        }, { status: 200 });
    } catch (error: any) {
        console.log('ERROR in fetching users: ', error.message);
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}