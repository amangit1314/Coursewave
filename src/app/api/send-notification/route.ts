import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {

  try {
    return NextResponse.json({
      success: true,
      status: 'OK',
      message: 'notification sent successfully ...',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: 'ERROR',
      enrror: error.message,
      message: 'Internal server error in sending notification ...'
    }, { status: 500 });
  }
}