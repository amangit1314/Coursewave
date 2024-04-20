import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest, { params }: {
  params: {
    userId: string;
    courseId: string;
    chapterId: string;
  }
}) => {

  const userId = params?.userId;
  const courseId = params?.courseId;
  const chapterId = params?.chapterId;

  const reqBody = await req.json();
  const { isCompleted } = reqBody;

  try {

    const course = await db.course.findFirst({
      where: {
        courseId: courseId,

      }
    });

    if (!course) {
      return NextResponse.json({
        success: false,
        status: 'NOT_FOUND',
        message: 'No course found with this courseId',
      }, { status: 404 });
    }

    const enrollment = await db.enrollment.findFirst({
      where: {
        courseId: courseId,
        userId: userId,
      }
    });

    if (!enrollment) {
      return NextResponse.json({
        success: false,
        status: 'NOT_FOUND',
        message: 'User not enrolled in this course',
      }, { status: 404 });
    }

    const courseProgress = await db.courseProgress.findFirst({
      where: {
        courseId: courseId,
      }
    });

    if (!courseProgress) {
      return NextResponse.json({
        success: false,
        status: 'NOT_FOUND',
        message: 'No courseProgress found with this courseId',
      }, { status: 404 });
    }

    const chapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
      }
    });

    if (!chapter) {
      return NextResponse.json({
        success: false,
        status: 'NOT_FOUND',
        message: 'Chapter not found in this course',
      }, { status: 404 });
    }



    let chapterProgress;
    chapterProgress = await db.chapterProgress.findFirst({
      where: {
        chapterId: chapterId,
      }
    });

    if (!chapterProgress) {
      chapterProgress = await db.chapterProgress.create({
        data: {
          id: `chapter_${chapterId}_progress`,
          chapterId: chapterId,
          isCompleted: isCompleted,
          courseProgressId: courseProgress.id,
        }
      })
    }

    const updatedChapterProgress = await db.chapterProgress.update({
      where: {
        id: chapterProgress.id,
        chapterId,
      },
      data: {
        isCompleted: isCompleted,
      }
    })

    console.log('Updated chapter progress: ', updatedChapterProgress);

    return NextResponse.json({
      success: true,
      status: 'OK',
      data: updatedChapterProgress,
      message: 'Chapter successfully completed ...'
    }, { status: 200 });
  } catch (error: any) {
    console.log('ERROR in completing chapter: ', error.message);
    return NextResponse.json({
      success: false,
      status: 'ERROR',
      enrror: error.message,
      message: 'Internal server error in completing chapter progress ...'
    }, { status: 500 });
  }
}