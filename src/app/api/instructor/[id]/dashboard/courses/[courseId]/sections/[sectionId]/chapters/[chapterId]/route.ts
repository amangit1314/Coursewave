import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

//* get chapter information for provided videoId
export async function GET(req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
        sectionId?: string;
        chapterId?: string;
    }
}) {
    const instructorId = params.id;
    const courseId = params.courseId;
    const sectionId = params.sectionId;
    const chapterId = params.chapterId;

    try {
        if (!chapterId) {
            return NextResponse.json({
                message: `No chapter id given 😐 ...`
            }, { status: 400 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
            },
        })

        if (!chapter) {
            return NextResponse.json({
                message: `No chapter found with this chapterId: ${chapterId} 😐 ...`
            }, { status: 404 });
        }

        const chapterInfo = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId,
                courseSectionCourseSectionId: sectionId,
            },
        })

        return NextResponse.json({
            status: true,
            data: chapterInfo,
            message: `chapter info for chapterId:${chapterInfo} successfull accessed 🤘...`
        }, { status: 200 })
    } catch (error: any) {
        console.log(`Failed to access chapter info for chapterId:${chapterId} ❗`);
        return NextResponse.json({
            status: false,
            error: error.message,
            message: `Failed to access chapter info for chapterId:${chapterId} ❗`
        }, { status: 500 })
    }
}

// //* update the videoUrl with provided newVideoUrl for provided videoId
export async function PUT(req: NextRequest, { params }: { params: { id?: string; courseId?: string; sectionId?: string; chapterId?: string; } }) {
    const instructorId = params.id;
    const courseId = params.courseId;
    const sectionId = params.sectionId;
    const chapterId = params.chapterId;

    try {
        const reqBody = await req.json();
        const { newVideoUrl, chapterTitle, chapterDescription, isFree } = reqBody;

        if (!chapterId) {
            return NextResponse.json({ message: `No chapter id provided  ...`, status: 400 });
        }

        const chapterToUpdate = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId,
                courseSectionCourseSectionId: sectionId,
            },
        });

        if (!chapterToUpdate) {
            return NextResponse.json({ message: `No chapter found with this chapterId and course/section combination: ${chapterId}  ...`, status: 404 });
        }

        const updatedChapter = await db.chapter.update({
            where: { id: chapterId },
            data: {
                ...(newVideoUrl !== undefined && { videoUrl: newVideoUrl }),
                ...(chapterTitle !== undefined && { title: chapterTitle }),
                ...(chapterDescription !== undefined && { description: chapterDescription }),
                ...(isFree !== undefined && { isFree }), // Update isFree only if provided
            },
        });

        return NextResponse.json({ status: true, data: updatedChapter, message: `Chapter updated successfully ...` }, { status: 200 });
    } catch (error: any) {
        console.error(`Failed to update chapter with id ${chapterId}:`, error);
        return NextResponse.json({ status: false, error: error.message, message: `Failed to update chapter ❗` }, { status: 500 });
    }
}

//* delete the chapter with the provided videoId
export async function DELETE(req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
        sectionId?: string;
        chapterId: string;
    }
}) {
    const instructorId = params.id;
    const courseId = params.courseId;
    const sectionId = params.sectionId;
    const chapterId = params.chapterId;

    try {

        if (!chapterId) {
            return NextResponse.json({
                message: `No instructor id given 😐 ...`
            }, { status: 400 });
        }

        const instructor = await db.instructor.findUnique({
            where: {
                instructorID: instructorId,
            }
        })

        if (!instructor) {
            return NextResponse.json({
                message: `INVALID INSTRUCTOR ID, No instructor found with id ${instructorId} 😐 ...`
            }, { status: 404 });
        }

        if (!chapterId) {
            return NextResponse.json({
                message: `No chapter id given 😐 ...`
            }, { status: 400 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
            },
        })

        if (!chapter) {
            return NextResponse.json({
                message: `No chapter found with this chapterId: ${chapterId} 😐 ...`
            }, { status: 404 });
        }

        await db.chapter.delete({
            where: {
                id: chapterId,
                courseId,
                courseSectionCourseSectionId: sectionId,
            },
        })

        return NextResponse.json({
            status: true,
            message: `chapter deleted successfully ...`
        }, { status: 200 })
    } catch (error: any) {
        console.log(`Failed to delete chapter ...`);
        return NextResponse.json({
            status: false,
            error: error.message,
            message: `Failed to access chapter info for chapterId:${chapterId} ❗`
        }, { status: 500 })
    }
}