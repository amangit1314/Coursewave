import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export const GET = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    const { id } = reqBody;

    if (!id) {
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: 'id is a required field ...',
      }, { status: 402 });
    }

    const instructor = await db.instructor.findUnique({
      where: {
        instructorID: id,
      }
    });

    if (!instructor) {
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `There is no instructor with this id: ${id} ...`,
      }, { status: 404 });
    }

    console.log(`Instructor Data: ${JSON.stringify(instructor)}`);
    console.log(`Instructor Data: ${instructor}`);
    return NextResponse.json({
      status: 'OK',
      success: true,
      data: instructor,
      message: 'User saved articles fetched ✔️ ...',
    }, { status: 200 });
  } catch (error: any) {
    console.log(`Internal server error in fetching saved articles: ${error.message} ❌🚧 ...`)
    return NextResponse.json({
      status: 'OK',
      success: true,
      error: error.message,
      message: 'Internal server error, in fetching saved articles ❌🚧 ...',
    }, { status: 500 });
  }
}