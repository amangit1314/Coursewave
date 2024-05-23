import { PrismaClient } from "@prisma/client";

import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
// const prisma = new PrismaClient();

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export const GET = async (req: NextRequest, { params }: {
    params: {
        userId?: string;
        courseId?: string;
    };
}) => {
   console.log('SOmething for notes')
}