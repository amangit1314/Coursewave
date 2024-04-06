import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";

//? Upload a chapter
export const POST = async (req: NextRequest, { params }: {
    params: {
        id: string;
        courseId: string;
        sectionId: string;
    };
}) => {
    const instructorId = params?.id;
    const courseId = params?.courseId;
    const sectionId = params?.sectionId;

    const reqBody = await req.json();
    const { chapterTitle, chapterDescription, chapterVideoUrl, videoThumbnailUrl, chapterDuration, position, isPublished, isFree } = reqBody;

    const chapterId = `${courseId?.substring(0, 10)}_${sectionId?.split('_')[2]}_${chapterTitle.split(' ')[0]}`;
    let videoUrl = chapterVideoUrl;

    try {
        if (!chapterDescription || !chapterTitle || !videoUrl || !videoThumbnailUrl || !chapterDuration) {
            return NextResponse.json({
                success: false,
                message: 'Required parameters are missing ..., required parameters(chapterDescription, chapterTitle, videoUrl, videoThumbnailUrl, chapterDuration)',
            }, { status: 400 });
        }

        const instructor = await db.instructor.findUnique({
            where: {
                instructorID: instructorId,
            }
        })

        if (!instructor) {
            return NextResponse.json({
                success: false,
                message: `No instructor found with this instructorid: ${instructorId} ...`
            }, { status: 404 });
        }

        const course = await db.course.findUnique({
            where: {
                instructorID: instructorId,
                courseId,
            }
        })

        const section = await db.courseSection.findUnique({
            where: {
                courseSectionId: sectionId
            }
        });

        if (!course || !section) {
            return NextResponse.json({
                message: "There is no course or courseSection with the specified ids 😐 ..."
            }, { status: 404 });
        }

        const isInstructor = section.instructorId === instructorId;

        if (!isInstructor) {
            return NextResponse.json({
                success: false,
                message: `You are unauthorized, you are not an instructor of this cours ...`
            }, { status: 403 })
        }

        //! STEP 0: generate the filePath
        // const uniqueFileName = `${courseId?.toString()
        //     .split('-')[0]}_${sectionId?.toString().split('-')[0]
        //         .substring(0, 4)}_${chapterTitle} `;
        // const filePath = `videos/${uniqueFileName}.mp4`;

        //! STEP 1: upload the file to supabase storage
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

        //! STEP 2: get url of the uploaded file
        // let videoUrl = data.path;

        //! STEP 3: add the entry in the video table
        const chapter = await db.chapter.create({
            data: {
                id: chapterId,
                title: chapterTitle,
                description: chapterDescription,
                videoUrl: videoUrl,
                position: position,
                isPublished: isPublished,
                chapterDuration: chapterDuration,
                isFree: isFree,
                courseId: courseId!,
                courseSectionCourseSectionId: sectionId!,
            },
        });

        //! In last return if everything works
        return NextResponse.json({
            success: true,
            data: chapter,
            message: 'chapter successfully uploaded ✔️...'
        }, { status: 200 });

    } catch (error: any) {
        console.log(`failed to upload chapter, ${error.message} ❌🚧...`)
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
};