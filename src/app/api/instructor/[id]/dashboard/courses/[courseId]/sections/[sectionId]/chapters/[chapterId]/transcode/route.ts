import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import cloudinary from "cloudinary";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { db } from "@/lib/db";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

ffmpeg.setFfmpegPath(ffmpegPath!);

export async function POST(req: NextRequest) {
  const { publicId, downloadUrl, cloudinaryDataId } = await req.json();

  if (!publicId || !downloadUrl || !cloudinaryDataId) {
    return NextResponse.json(
      {
        success: false,
        status: "ERROR",
        message: "Public ID, download URL, and Cloudinary Data ID are required",
      },
      { status: 400 },
    );
  }

  try {
    const downloadCommand = `wget -O /tmp/input.mp4 "${downloadUrl}"`;

    exec(downloadCommand, async (downloadError) => {
      if (downloadError) {
        console.error(`Error downloading video: ${downloadError.message}`);
        return NextResponse.json(
          {
            success: false,
            status: "ERROR",
            message: "Error downloading video",
          },
          { status: 500 },
        );
      }

      const resolutions = [
        { resolution: "480p", dimensions: "854x480" },
        { resolution: "720p", dimensions: "1280x720" },
        { resolution: "1080p", dimensions: "1920x1080" },
      ];

      try {
        for (const { resolution, dimensions } of resolutions) {
          await new Promise((resolve, reject) => {
            ffmpeg("/tmp/input.mp4")
              .size(dimensions)
              .on("end", async () => {
                try {
                  const result = await cloudinary.v2.uploader.upload(
                    `/tmp/output_${resolution}.mp4`,
                    {
                      resource_type: "video",
                      public_id: `${publicId}_${resolution}`,
                    },
                  );

                  // Update the database with the new public ID
                  const updatedCloudinaryData = await db.cloudinaryData.update({
                    where: { id: cloudinaryDataId },
                    data: {
                      [`publicId_${resolution}`]: result.public_id,
                    },
                  });

                  resolve(result);

                  console.log('Updated Cloudinary Data after transcoding: ', updatedCloudinaryData);
                } catch (uploadError: any) {
                  console.error(
                    `Error uploading ${resolution} video: ${uploadError.message}`,
                  );
                  reject(uploadError);
                }
              })
              .on("error", (transcodeError: any) => {
                console.error(
                  `Error transcoding to ${resolution}: ${transcodeError.message}`,
                );
                reject(transcodeError);
              })
              .save(`/tmp/output_${resolution}.mp4`);
          });
        }

        return NextResponse.json(
          {
            success: true,
            status: "OK",
            message: "Transcoding and upload completed",
          },
          { status: 200 },
        );
      } catch (error: any) {
        console.error("Error processing video transcoding or upload:", error);
        return NextResponse.json(
          {
            success: false,
            status: "ERROR",
            message: "Error processing video transcoding or upload",
          },
          { status: 500 },
        );
      }
    });
  } catch (error: any) {
    console.error("Error processing transcoding request:", error);
    return NextResponse.json(
      {
        success: false,
        status: "ERROR",
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
