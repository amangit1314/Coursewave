import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';


export const GET = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    const { id } = reqBody;

    if (!id) {
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: 'id is a required field ...',
      }, { status: 400 });
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
      message: 'Instructor found ✔️ ...',
    }, { status: 200 });
  } catch (error: any) {
    console.log(`Internal server error: ${error.message} ❌🚧 ...`)
    return NextResponse.json({
      status: 'OK',
      success: true,
      error: error.message,
      message: 'Internal server error ❌🚧 ...',
    }, { status: 200 });
  }
}