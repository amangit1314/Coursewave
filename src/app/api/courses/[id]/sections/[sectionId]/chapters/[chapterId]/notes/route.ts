import { db } from "@/lib/db";
import { generateUid } from "@/lib/helpers/id_helper";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

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
        const reqBody = await req.json();
        const { userId } = reqBody;

        if (!courseId || !sectionId || !chapterId || !userId) {
            console.log('Course id or Section id or Chapter id, User id not provided, courseId, sectionId, userId and chapterId are required fields ...')
            return NextResponse.json({
                status: 'ERROR',
                success: false,
                message: 'courseId, sectionId, userId and chapterId are required fields ...'
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

        const notes = await db.chapterNotes.findMany({
            where: {
                chapterId,
                userId,
                courseId,
            }
        })


        return NextResponse.json({
            status: 'OK',
            success: true,
            data: notes,
            message: `Chapter notes for chapterId:${chapterId}, fetched successfully ✔️ ...`
        }, { status: 200 });

    } catch (error: any) {
        console.log(`Failed to fetch course notes for chapter with chapterId: ${chapterId} ❌🚧 ...`, error.message);
        return NextResponse.json({
            status: 'ERROR',
            success: false,
            error: error.message,
            message: `Failed to fetch course notes for chapter with chapterId: ${chapterId} ❌🚧 ...`,
        }, { status: 500 });
    }
}

// CREATE A NOTE
export const POST = async (req: NextRequest, { params }: {
    params: {
        id?: string;
        sectionId?: string;
        chapterId?: string;
    };
}) => {
    const courseId = params.id;
    const sectionId = params.sectionId;
    const chapterId = params.chapterId;
    const newId = generateUid();

    const noteId = `note_${newId.slice(0, 6)}`
    try {
        const reqBody = await req.json();
        const { userId, note } = reqBody;

        if (!courseId || !sectionId || !chapterId || !userId) {
            console.log('Course id or Section id or Chapter id, User id not provided, courseId, sectionId, userId and chapterId are required fields ...')
            return NextResponse.json({
                status: 'ERROR',
                success: false,
                message: 'courseId, sectionId, userId and chapterId are required fields ...'
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

        const createdNote = await db.chapterNotes.create({
            data: {
                noteId,
                userId,
                courseId,
                chapterId,
                note,
            }
        })

        console.log('Create Note: ', createdNote);

        return NextResponse.json({
            status: 'OK',
            success: true,
            data: createdNote,
            message: `Chapter notes for chapterId:${chapterId}, fetched successfully ✔️ ...`
        }, { status: 200 });

    } catch (error: any) {
        console.log(`Failed to fetch course notes for chapter with chapterId: ${chapterId} ❌🚧 ...`, error.message);
        return NextResponse.json({
            status: 'ERROR',
            success: false,
            error: error.message,
            message: `Failed to fetch course notes for chapter with chapterId: ${chapterId} ❌🚧 ...`,
        }, { status: 500 });
    }
}