import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
export const dynamic = 'force-dynamic';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!
});

export const GET = async (req: NextRequest, { params }: {
  params: {
    id?: string;
    sectionId?: string;
    chapterId?: string;
  };
}) => {
  const courseId = params.id;
  const sectionId = params.sectionId;
  const chapterId = params.chapterId;

  try {
    if (!courseId || !sectionId || !chapterId) {
      console.log('Course id or Section id or Chapter id not provided, courseId, sectionId and chapterId are required fields ...')
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: 'courseId, sectionId and chapterId are required fields ...'
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

    return NextResponse.json({
      status: 'OK',
      success: true,
      data: chapter,
      message: `Course chapter info with chapterId:${chapterId}, fetched successfully ✔️ ...`
    }, { status: 200 });
  } catch (error: any) {
    console.log(`Failed to get chapter info with chapterId:${chapterId} ❌🚧 ...`);
    return NextResponse.json({
      status: 'ERROR',
      success: false,
      error: error.message,
      message: `Failed to get chapter info with chapterId:${chapterId} ❌🚧 ...`
    }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: {
    params: {
      id: string;
      courseId: string;
      sectionId?: string;
      chapterId: string
    }
  }
) {
  try {
    const instructorId = params?.id;
    const courseId = params?.courseId;
    const sectionId = params?.sectionId;
    const chapterId = params?.chapterId;

    if (!instructorId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        courseId: courseId,
        instructorID: instructorId,
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
        courseSectionId: sectionId,
      }
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        }
      });

      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          }
        });
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId
      }
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
        courseSectionId: sectionId,
      }
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          courseId: courseId,
        },
        data: {
          isPublished: false,
        }
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: {
    params: {
      id: string;
      courseId: string;
      sectionId?: string;
      chapterId: string
    }
  }
) {
  const instructorId = params?.id;
  const courseId = params?.courseId;
  const sectionId = params?.sectionId;
  const chapterId = params?.chapterId;

  try {
    const { isPublished, ...values } = await req.json();

    if (!instructorId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        courseId: params.courseId,
        instructorID: instructorId,
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      }
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        }
      });

      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          }
        });
      }

      const asset = await mux.video.assets.create({
        input: values.videoUrl,
        playback_policy: ['public'],
        test: false,
      });

      console.log('Mux created video asset id: ', asset.id);

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id!,
          courseId,
        }
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}