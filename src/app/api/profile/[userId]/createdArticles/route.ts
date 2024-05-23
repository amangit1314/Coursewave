import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  const userId = params?.userId!;

  try {
    if (!userId) {
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: '[MISSING_PARAMETERS]: id is a required field ...',
      }, { status: 402 });
    };

    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: '[NOT_FOUND]: no user found with this id ...',
      }, { status: 404 });
    };

    const createdArticles = await db.blog.findMany({
      where: {
        authorId: userId,
      }
    });

    return NextResponse.json({
      status: 'OK',
      success: true,
      data: createdArticles,
      message: 'User created articles fetched ✔️ ...',
    }, { status: 200 });
  } catch (error: any) {
    console.log(`[GET_CREATED_COURSES_ERROR]: Internal server error: ${error.message} ❌🚧 ...`)
    return NextResponse.json({
      status: 'OK',
      success: true,
      error: error.message,
      message: '[GET_CREATED_COURSES_ERROR]: Internal server error ❌🚧 ...',
    }, { status: 500 });
  }
}