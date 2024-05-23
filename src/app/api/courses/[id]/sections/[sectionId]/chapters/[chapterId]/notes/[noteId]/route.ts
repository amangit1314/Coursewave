import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export const PATCH = async (req: NextRequest, { params }: {
  params: {
    id?: string;
    sectionId?: string;
    chapterId?: string;
    noteId?: string;
  };
}) => {
  const courseId = params.id;
  const sectionId = params.sectionId;
  const chapterId = params.chapterId;
  const noteId = params.noteId;
  try {
    const reqBody = await req.json();
    const { userId, newNote } = reqBody;

    if (!courseId || !sectionId || !chapterId || !userId || !noteId) {
      console.log('Missing required fields ...')
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: 'courseId, sectionId, chapterId, userId, noteId these are required fields ...'
      }, { status: 400 })
    }

    const course = await db.course.findUnique({
      where: {
        courseId
      }
    });

    if (!course) {
      console.log(`No course found with such courseId: ${courseId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `No course found with such courseId: ${courseId} ...`,
      }, { status: 404 })
    }

    const section = await db.courseSection.findUnique({
      where: {
        courseSectionId: sectionId,
        courseId: courseId,
      }
    })

    if (!section) {
      console.log(`No course section found with such sectionId: ${sectionId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `No course section found with such sectionId: ${sectionId} ...`,
      }, { status: 404 })
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
        courseSection: section,
      }
    });

    if (!chapter) {
      console.log(`No chapter found with such chapterId: ${chapterId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `No chapter found with such chapterId: ${chapterId} ..`,
      }, { status: 404 })
    }

    const exisitingNote = await db.chapterNotes.findUnique({
      where: {
        noteId,
        chapterId,
        courseId
      }
    })

    if (!exisitingNote) {
      console.log(`No note found with such noteId: ${noteId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `No note found with such noteId: ${noteId} ..`,
      }, { status: 404 })
    }

    const updatedNote = await db.chapterNotes.update({
      where: {
        noteId
      },
      data: {
        note: newNote
      }
    })

    return NextResponse.json({
      status: 'OK',
      success: true,
      data: updatedNote,
      message: `Chapter note updated successfully ✔️ ...`
    }, { status: 200 });

  } catch (error: any) {
    console.log(`Failed to update note ❌🚧 ...`, error.message);
    return NextResponse.json({
      status: 'ERROR',
      success: false,
      error: error.message,
      message: `Failed to update note ❌🚧 ...`,
    }, { status: 500 });
  }
}

// DELETE A NOTE
export const DELETE = async (req: NextRequest, { params }: {
  params: {
    id?: string;
    sectionId?: string;
    chapterId?: string;
    noteId?: string;
  };
}) => {
  const courseId = params.id;
  const sectionId = params.sectionId;
  const chapterId = params.chapterId;
  const noteId = params.noteId;

  try {
    const reqBody = await req.json();
    const { userId } = reqBody;

    if (!courseId || !sectionId || !chapterId || !userId || !noteId) {
      console.log('Missing required fields ...')
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: 'courseId, sectionId, chapterId, userId, noteId these are required fields ...'
      }, { status: 400 })
    }

    const course = await db.course.findUnique({
      where: {
        courseId
      }
    });

    if (!course) {
      console.log(`No course found with such courseId: ${courseId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `No course found with such courseId: ${courseId} ...`,
      }, { status: 404 })
    }

    const section = await db.courseSection.findUnique({
      where: {
        courseSectionId: sectionId,
        courseId: courseId,
      }
    })

    if (!section) {
      console.log(`No course section found with such sectionId: ${sectionId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `No course section found with such sectionId: ${sectionId} ...`,
      }, { status: 404 })
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
        courseSection: section,
      }
    });

    if (!chapter) {
      console.log(`No chapter found with such chapterId: ${chapterId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `No chapter found with such chapterId: ${chapterId} ..`,
      }, { status: 404 })
    }

    const exisitingNote = await db.chapterNotes.findUnique({
      where: {
        noteId,
        chapterId,
        courseId
     }
    })

    if (!exisitingNote) {
      console.log(`No note found with such noteId: ${noteId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `No note found with such noteId: ${noteId} ..`,
      }, { status: 404 })
    }

    if (userId != exisitingNote.userId) {
      console.log(`Unauthorized, you are note the creator of this course, You are not authorized to delete note: ${noteId} ..`)
      return NextResponse.json({
        status: 'UNAUTHORIZED',
        success: false,
        message: `Unauthorized, you are note the creator of this course, You are not authorized to delete note: ${noteId} ..`,
      }, { status: 403 })
    }

    await db.chapterNotes.delete({
      where: {
        noteId,
        userId,
        chapterId,
        courseId,
      }
    })

    return NextResponse.json({
      status: 'OK',
      success: true,
      message: `Chapter note for chapterId:${chapterId}, deleted successfully ✔️ ...`
    }, { status: 200 });

  } catch (error: any) {
    console.log(`Failed to delete course note for chapter with chapterId: ${chapterId} ❌🚧 ...`, error.message);
    return NextResponse.json({
      status: 'ERROR',
      success: false,
      error: error.message,
      message: `Failed to delete course note for chapter with chapterId: ${chapterId} ❌🚧 ...`,
    }, { status: 500 });
  }
}