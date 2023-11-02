import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();
const prisma = new PrismaClient();
const supabaseURL = process.env.SUPABASE_URL;
const supabaseAPIKey = process.env.SUPABASE_API_KEY;

if (!supabaseURL || !supabaseAPIKey) {
    console.error("SUPABASE_URL && API environment variable is not set");
    process.exit(1);
}

const supabase = createClient(supabaseURL, supabaseAPIKey);
const upload = multer({ dest: 'uploads/' })

//** Upload a video to a sepcific course section of a particular course
export const POST = (upload.single('uploaded_file'), async (req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
        sectionId?: string;
    };
}) => {
    const uid = params?.id;
    const courseId = params?.courseId;
    const courseSectionId = params?.sectionId;

    const reqBody = await req.json();
    const videoFile = reqBody.files.video;
    const { videoTitle, videoDescription } = reqBody;

    try {
        //! check if any required filed is missing ...
        if (!uid || !courseId || !courseSectionId || !videoFile || !videoTitle) {
            return NextResponse.json({
                success: false,
                error: 'Missing or undefined parameter ...',
            }, { status: 400 }); // Return a 400 Bad Request status code.
        }

        //! generate unique file name for video
        const uniqueFileName = `${courseId?.toString()
            .split('-')[0]}_${courseSectionId?.toString().split('-')[0]
                .substring(0, 4)}_${videoTitle} `;
        const filePath = `videos/${uniqueFileName}.mp4`;

        //! STEP1: upload the file to supabase storage
        const { data, error } = await supabase.storage
            .from("videos")
            .upload(filePath, videoFile.data);

        if (error) {
            return NextResponse.json({
                success: false,
                error: error.message,
                message: 'Failed to upload video ...'
            }, { status: 500 });
        }

        //! STEP2: get url of the uploaded file
        let videoUrl = data.path;

        //! STEP3: add the entry in the video table
        const video = await prisma.video.create({
            data: {
                videoId: videoUrl.split('.')[0],
                courseSectionId: courseSectionId,
                videoUrl: videoUrl,
                videoTitle: videoTitle,
                videoDuration: videoFile.data.videoDuration,
                videoDescription: videoDescription,
            },
        });

        //! STEP4: in last return response
        return NextResponse.json({
            success: true,
            data: {
                video,
            },
            message: 'video successfully uploaded ...'
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}
);