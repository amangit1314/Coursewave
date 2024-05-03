import { NextRequest, NextResponse } from "next/server";

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