import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string; courseId: string; sectionId: string; } }
) {
  const instructorId = params?.id;
  const courseId = params?.courseId;
  const sectionId = params?.sectionId;

  try {

    if (!instructorId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { list } = await req.json();

    const ownCourse = await db.course.findFirst({
      where: {
        courseId: courseId,
        instructorID: instructorId
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    for (let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position }
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}