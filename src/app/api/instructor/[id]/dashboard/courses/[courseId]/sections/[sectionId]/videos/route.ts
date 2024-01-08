import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();
// const supabaseURL = process.env.SUPABASE_URL!;
// const supabaseAPIKey = process.env.SUPABASE_API_KEY!;

// if (!supabaseURL || !supabaseAPIKey) {
//     console.error("SUPABASE_URL && API environment variable is not set");
//     process.exit(1);
// }
// const supabase = createClient(supabaseURL, supabaseAPIKey);
// const upload = multer({ dest: 'uploads/' })
// upload.single('uploaded_file'),

//** Upload a video
export const POST = async (req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
        sectionId?: string;
    };
}) => {
    const instructorId = params?.id;
    const courseId = params?.courseId;
    const courseSectionId = params?.sectionId;
   
    const reqBody = await req.json();
    // const videoFile = reqBody.files.video;
    const { videoTitle, videoDescription, videoUrl, videoThumbnailUrl, videoDuration } = reqBody;

    const videoId = `${courseId?.substring(0, 10)}_${courseSectionId?.split('_')[2]}_${videoTitle.split(' ')[0]}`;

    try {
        if (!videoDescription || !videoTitle || !videoUrl || !videoThumbnailUrl || !videoDuration) {
            return NextResponse.json({
                success: false,
                message: 'Required parameters are missing ..., required parameters(videoDescription, videoTitle, videoUrl, videoThumbnailUrl, videoDuration)',
            }, { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: {
                courseId
            },
        })

        const courseSection = await prisma.courseSection.findUnique({
            where: {
                courseSectionId
            },
        })

        if (!course || !courseSection) {
            return NextResponse.json({ message: "There is no course or courseSection with the specified ids 😐 ..." }, { status: 404 });
        }

        const youAreInstructor = await prisma.courseSection.findUnique({
            where: {
                courseSectionId: courseSectionId,
                instructorId: instructorId,
            }
        })

        let isInstructor = youAreInstructor ? true : false;

        if (isInstructor) {
            // const uniqueFileName = `${courseId?.toString()
            //     .split('-')[0]}_${courseSectionId?.toString().split('-')[0]
            //         .substring(0, 4)}_${videoTitle} `;
            // const filePath = `videos/${uniqueFileName}.mp4`;

            //! STEP1: upload the file to supabase storage
            // const { data, error } = await supabase.storage
            //     .from("videos")
            //     .upload(filePath, videoFile.data);
            // if (error) {
            //     return NextResponse.json({
            //         success: false,
            //         error: error.message,
            //         message: 'Failed to upload video ...'
            //     }, { status: 500 });
            // }

            // //! STEP2: get url of the uploaded file
            // let videoUrl = data.path;

            //! STEP3: add the entry in the video table
            const video = await prisma.video.create({
                data: {
                    // videoId: videoUrl.split('.')[0],
                    videoId: videoId,
                    courseId: courseId!,
                    courseSectionId: courseSectionId!,
                    videoUrl: videoUrl,
                    videoTitle: videoTitle,
                    // videoDuration: videoFile.data.videoDuration,
                    videoDuration: videoDuration,
                    videoDescription: videoDescription,
                    videoThumbnailUrl: videoThumbnailUrl!
                },
            });

            return NextResponse.json({
                success: true,
                data: video ,
                message: 'video successfully uploaded ...'
            }, { status: 200 });
        }
        else {
            return NextResponse.json({
                success: true,
                message: 'You are unauthorized, you are not an instructor of this course ...'
            }, { status: 401 });
        }
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
};