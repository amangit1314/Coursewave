import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dotenv from "dotenv";
dotenv.config();
import { db } from "@/lib/db";
import { decrypt, verifyToken } from "@/helpers/jwt-helper";
import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export const dynamic = 'force-dynamic';

interface JWTPayload {
    id: string;
    [key: string]: any;
}

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({
                success: false,
                message: "No token provided"
            }, { status: 401 });
        }

        const verifiedToken = await verifyToken(token);
        const payload = verifiedToken.payload as unknown as JWTPayload;
        
        if (!payload || !payload.id) {
            return NextResponse.json({
                success: false,
                message: "Invalid token"
            }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: {
                id: payload.id
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: user
        });

    } catch (error: any) {
        console.error('Error in /api/auth/me:', error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}