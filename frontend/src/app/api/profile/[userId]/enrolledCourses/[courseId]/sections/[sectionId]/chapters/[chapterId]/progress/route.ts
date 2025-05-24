import { NextRequest, NextResponse } from "next/server";

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export const dynamic = 'force-dynamic';

export const GET = (req: NextRequest) => {
  try {
    return NextResponse.json({
      success: true,
      status: 'OK',
      message: 'Success',
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 'ERROR',
      message: 'Internal server error ...',
    }, { status: 500 });
  }
}