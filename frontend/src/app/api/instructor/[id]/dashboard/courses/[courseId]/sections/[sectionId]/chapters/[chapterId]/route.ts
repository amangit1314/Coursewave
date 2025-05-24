import { db } from "@/lib/db";
// import { cloudinary } from "@/config/cloudinary";
import { v2 as cloudinary } from 'cloudinary';
import cors, { runMiddleware } from "@/lib/cors";
import { NextRequest, NextResponse } from "next/server";

const getPublicIdFromUrl = (url: string) => {
  try {
    const parts = url.split("/");
    // The public ID is the last part before the file extension
    const lastPart = parts[parts.length - 1];
    const publicId = lastPart.split(".")[0]; 
    return publicId;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    return null;
  }
};

export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//* Handle the OPTIONS request
export const OPTIONS = async (req: NextRequest) => {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse("OK", { status: 200 });
};

//* GET chapter information for provided chapterId
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
  },
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
        { status: 400 },
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
        { status: 404 },
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
      { status: 200 },
    );
  } catch (error: any) {
    console.log(`Failed to access chapter info for chapterId:${chapterId} ❗`);
    return NextResponse.json(
      {
        status: false,
        error: error.message,
        message: `Failed to access chapter info for chapterId:${chapterId} ❗`,
      },
      { status: 500 },
    );
  }
};

// * UPDATE(PATCH) chapter video(GPT ONE), it returns created cloudinary data 
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
  },
) => {
  const { id: instructorId, courseId, sectionId, chapterId } = params!;

  try {
    const reqBody = await req.json();
    const { videoUrl } = reqBody;
    let createdCloudinaryData;

    if (!instructorId || !courseId || !sectionId || !chapterId) {
      console.log("[MISSING_REQUIRED_FIELDS]");
      return new NextResponse("[MISSING_REQUIRED_FIELDS]", { status: 401 });
    }

    // Verify the course belongs to the instructor
    const ownCourse = await db.course.findFirst({
      where: { courseId, instructorID: instructorId },
    });

    if (!ownCourse) {
      console.log("[UNAUTHORIZED]");
      return new NextResponse("[UNAUTHORIZED]", { status: 401 });
    }

    // Verify the course section exists
    const section = await db.courseSection.findUnique({
      where: { courseSectionId: sectionId },
    });

    if (!section) {
      console.log("[COURSE_SECTION_NOT_FOUND]");
      return new NextResponse("[COURSE_SECTION_NOT_FOUND]", { status: 404 });
    }

    // Update the chapter video URL
    const chapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { videoUrl },
    });

    // Handle existing Cloudinary data
    const existingCloudinaryData = await db.cloudinaryData.findFirst({
      where: { chapterId },
    });

    if (existingCloudinaryData) {
      if (cloudinary.api) {
        // Delete existing Cloudinary videos
        await cloudinary.api.delete_resources(
          [
            existingCloudinaryData.publicId,
            existingCloudinaryData.publicId_480p,
            existingCloudinaryData.publicId_720p,
            existingCloudinaryData.publicId_1080p,
          ].filter(Boolean) as string[],
        );

        // Delete existing Cloudinary data record in db
        await db.cloudinaryData.delete({
          where: { id: existingCloudinaryData.id },
        });
      } else {
        console.log("[CLOUDINARY_API_UNDEFINED]");
        return new NextResponse("[CLOUDINARY_API_UNDEFINED]", { status: 500 });
      }
    }

   // if we have videoUrl Create new Cloudinary data record
   if (videoUrl) {
    const publicId = getPublicIdFromUrl(videoUrl);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!publicId) {
      console.log("[MISSING_VIDEO_PUBLICID], the cloudinary video publicId is empty ...");
      return NextResponse.json({
          success: false,
          status: "ERROR",
          message: "[MISSING_VIDEO_PUBLICID], the cloudinary video publicId is empty ...",
          error: "[MISSING_VIDEO_PUBLICID], the cloudinary video publicId is empty ...",
        },
        { status: 401 },
      );
    }

    if (!cloudName) {
      console.log("[MISSING_CLOUDINARY_CLOUD_NAME], you have forgot to initialize the process.env.CLOUDINARY_CLOUD_NAME ...");
      return NextResponse.json(
        {
          success: false,
          status: "ERROR",
          message: "[MISSING_CLOUDINARY_CLOUD_NAME], you have forgot to initialize the process.env.CLOUDINARY_CLOUD_NAME ...",
          error: "[MISSING_CLOUDINARY_CLOUD_NAME], you have forgot to initialize the process.env.CLOUDINARY_CLOUD_NAME ...",
        },
        { status: 401 },
      );
    }

    createdCloudinaryData = await db.cloudinaryData.create({
      data: {
        cloudName,
        publicId,
        courseId,
        chapterId,
      },
    });

    console.log(
      "Created cloudinary data after successfully uploading or updating chapter video: ",
      createdCloudinaryData,
    );
  }

  return NextResponse.json(
    {
      success: true,
      status: "OK",
      data: createdCloudinaryData,
      message: "Chapter video uploaded or updated successfully 🎥 ✔ ...",
    },
    { status: 200 },
  );
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID_VIDEO_UPDATE_ERROR]: ", error);
    return NextResponse.json(
      {
        status: "ERROR",
        success: false,
        error: error,
        message:  `[INTERNAL_SERVER_ERROR], while uploading or updating chapter video ... ` ,
      },
      { status: 500 },
    );
  }
};

//* DELETE the chapter with the provided videoId
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
  },
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
      { status: 200 },
    );
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE] error: ", error);
    return new NextResponse("[INTERNAL_SERVER_ERROR] in deleting Chapter ...", {
      status: 500,
    });
  }
};