import { db } from "@/lib/db";
// import { mux } from "@/config/mux";
import cors, { runMiddleware } from "@/lib/cors";
import { cloudinary } from "@/config/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// *Handle the OPTIONS request
export const OPTIONS = async (req: NextRequest) => {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse("OK", { status: 200 });
};

//* get chapter information for provided videoId
export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      id: string;
      courseId: string;
      sectionId: string;
      chapterId: string;
    };
  }
) => {
  const instructorId = params?.id!;
  const courseId = params?.courseId!;
  const sectionId = params?.sectionId!;
  const chapterId = params?.chapterId!;

  try {
    if (!chapterId) {
      return NextResponse.json(
        {
          message: `No chapter id given 😐 ...`,
        },
        { status: 400 }
      );
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });

    if (!chapter) {
      return NextResponse.json(
        {
          message: `No chapter found with this chapterId: ${chapterId} 😐 ...`,
        },
        { status: 404 }
      );
    }

    const chapterInfo = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
        courseSectionId: sectionId,
      },
      include: {
        CloudinaryData: true,
      },
    });

    return NextResponse.json(
      {
        status: true,
        data: chapterInfo,
        message: `chapter info for chapterId:${chapterInfo} successfull accessed 🤘...`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(`Failed to access chapter info for chapterId:${chapterId} ❗`);
    return NextResponse.json(
      {
        status: false,
        error: error.message,
        message: `Failed to access chapter info for chapterId:${chapterId} ❗`,
      },
      { status: 500 }
    );
  }
};

//* delete the chapter with the provided videoId
export const DELETE = async (
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
      courseId: string;
      sectionId?: string;
      chapterId: string;
    };
  }
) => {
  try {
    const instructorId = params?.id!;
    const courseId = params?.courseId!;
    const sectionId = params?.sectionId!;
    const chapterId = params?.chapterId!;

    if (!instructorId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        courseId: courseId,
        instructorID: instructorId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
        courseSectionId: sectionId,
      },
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (chapter.videoUrl) {
      // deleting mux data
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });

      if (existingMuxData) {
        // await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      //   deleting cloudinary data
      const existingCloudinaryData = await db.cloudinaryData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });

      if (existingCloudinaryData) {
        await db.cloudinaryData.delete({
          where: {
            id: existingCloudinaryData.id,
          },
        });
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
        courseSectionId: sectionId,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          courseId: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        status: "OK",
        data: deletedChapter,
        message: "Chapter Deleted successfully ...",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE] error: ", error);
    return new NextResponse("[INTERNAL_SERVER_ERROR] in deleting Chapter ...", {
      status: 500,
    });
  }
};

const getPublicIdFromUrl = (url: string) => {
  const parts = url.split("/");
  // Assuming the public_id is the last part of the URL before the extension
  const lastPart = parts?.pop()!;
  const publicId = lastPart.split(".").slice(0, -1).join(".");
  return publicId;
};

// * route to update chapter (video with MUX / Cloudinary)
export const PATCH = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      id: string;
      courseId: string;
      sectionId: string;
      chapterId: string;
    };
  }
) => {
  const instructorId = params?.id!;
  const courseId = params?.courseId!;
  const sectionId = params?.sectionId!;
  const chapterId = params?.chapterId!;

  try {
    const reqBody = await req.json();
    const { isPublished, videoUrl } = reqBody;

    if (!instructorId || !courseId || !sectionId || !chapterId) {
      console.log(
        "[MISSING_REQUIRED_FIELDS], in instructorId, courseId, sectionId, chapterId in the chpaterId/route.ts file ..."
      );
      return new NextResponse("MISSING_REQUIRED_FIELDS", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        courseId: courseId,
      },
    });

    if (!course) {
      return new NextResponse(
        "NOT_FOUND, course with this courseId not found ...",
        { status: 404 }
      );
    }

    const ownCourse = await db.course.findUnique({
      where: {
        courseId: courseId,
        instructorID: instructorId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("UNAUTHORIZED, this is not your course ...", {
        status: 401,
      });
    }

    const section = await db.courseSection.findUnique({
      where: {
        courseSectionId: sectionId,
      },
    });

    if (!section) {
      return new NextResponse(
        "NOT_FOUND, section with this sectionId not found ...",
        { status: 404 }
      );
    }

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        videoUrl: videoUrl! as string,
      },
    });

    if (videoUrl) {
      //? --------------- updating mux data --------------------
      // const existingMuxData = await db.muxData.findFirst({
      //     where: {
      //         chapterId: chapterId,
      //     }
      // });

      // if (existingMuxData) {
      //     await mux.video.assets.delete(existingMuxData.assetId);
      //     await db.muxData.delete({
      //         where: {
      //             id: existingMuxData.id,
      //         }
      //     });
      // }

      // const asset = await mux.video.assets.create({
      //     input: values.videoUrl,
      //     playback_policy: ['public'],
      //     test: false,
      // });

      // console.log('Mux created video asset id: ', asset.id);

      // await db.muxData.create({
      //     data: {
      //         assetId: asset.id,
      //         playbackId: asset.playback_ids?.[0]?.id!,
      //         courseId,
      //         chapterId,
      //     }
      // });

      // * -------------------- updating cloudinary data
      const existingCloudinaryData = await db.cloudinaryData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });

      if (existingCloudinaryData) {
        await cloudinary.uploader.destroy(existingCloudinaryData.publicId, {
          resource_type: "video",
        });

        await db.cloudinaryData.delete({
          where: {
            id: existingCloudinaryData.id,
          },
        });
      }

      // const videoUrl = "https://res.cloudinary.com/demo/video/upload/v1623782384/sample.mp4";
      const publicId = getPublicIdFromUrl(videoUrl);
      console.log("Uploaded video publicId: ", publicId);

      const createdCloudinaryData = await db.cloudinaryData.create({
        data: {
          cloudName: "df2g8tcxq",
          publicId: publicId! as string,
          courseId: courseId! as string,
          chapterId: chapterId! as string,
        },
      });

      console.log("Created Cloudinary Data: ", createdCloudinaryData);
    }

    return NextResponse.json(chapter, { status: 200 });
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID_VIDEO_UPDATE_ERROR]: ", error);
    return new NextResponse(
      "Internal Error, while uploading or updating chapter video ...",
      { status: 500 }
    );
  }
};

//! update the videoUrl with provided newVideoUrl for provided videoId [NOT SURE]
export const PUT = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      id?: string;
      courseId?: string;
      sectionId?: string;
      chapterId?: string;
    };
  }
) => {
  const instructorId = params.id;
  const courseId = params.courseId;
  const sectionId = params.sectionId;
  const chapterId = params.chapterId;

  try {
    const reqBody = await req.json();
    const { newVideoUrl, chapterTitle, chapterDescription, isFree } = reqBody;

    if (!chapterId) {
      return NextResponse.json({
        message: `No chapter id provided  ...`,
        status: 400,
      });
    }

    const chapterToUpdate = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
        courseSectionId: sectionId,
      },
    });

    if (!chapterToUpdate) {
      return NextResponse.json({
        message: `No chapter found with this chapterId and course/section combination: ${chapterId}  ...`,
        status: 404,
      });
    }

    const updatedChapter = await db.chapter.update({
      where: { id: chapterId },
      data: {
        ...(newVideoUrl !== undefined && { videoUrl: newVideoUrl }),
        ...(chapterTitle !== undefined && { title: chapterTitle }),
        ...(chapterDescription !== undefined && {
          description: chapterDescription,
        }),
        ...(isFree !== undefined && { isFree }), // Update isFree only if provided
      },
    });

    return NextResponse.json(
      {
        status: 'OK',
        success: true,
        data: updatedChapter,
        message: `Chapter updated successfully ...`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Failed to update chapter with id ${chapterId}:`, error);
    return NextResponse.json(
      {
        status: false,
        error: error.message,
        message: `Failed to update chapter ❗`,
      },
      { status: 500 }
    );
  }
};
