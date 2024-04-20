import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Mux from "@mux/mux-node";
export const dynamic = 'force-dynamic';

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!
});

//* get chapter information for provided videoId
export async function GET(req: NextRequest, { params }: {
    params: {
        id: string;
        courseId: string;
        sectionId: string;
        chapterId: string;
    }
}) {
    const instructorId = params?.id;
    const courseId = params?.courseId;
    const sectionId = params?.sectionId;
    const chapterId = params?.chapterId;

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
                courseSectionId: sectionId,
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

//* delete the chapter with the provided videoId
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
                    chapterId: chapterId,
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
                id: chapterId
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

// * route to update chapter (video with MUX)
export async function PATCH(
    req: Request,
    { params }: {
        params: {
            id: string;
            courseId: string;
            sectionId: string;
            chapterId: string
        }
    }
) {
    const instructorId = params?.id!;
    const courseId = params?.courseId!;
    const sectionId = params?.sectionId!;
    const chapterId = params?.chapterId!;

    try {
        const { isPublished, ...values } = await req.json();

        if (!instructorId || !courseId || !sectionId || !chapterId) {
            return new NextResponse("MISSING_REQUIRED_FIELDS", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                courseId: courseId,
            }
        })

        if (!course) {
            return new NextResponse("NOT_FOUND, course with this courseId not found ...", { status: 404 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                courseId: courseId,
                instructorID: instructorId,
            }
        });

        if (!ownCourse) {
            return new NextResponse("UNAUTHORIZED, this is not your course ...", { status: 401 });
        }

        const section = await db.courseSection.findUnique({
            where: {
                courseSectionId: sectionId,
            }
        })

        if (!section) {
            return new NextResponse("NOT_FOUND, section with this sectionId not found ...", { status: 404 });
        }

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId,
            },
            data: {
                ...values,
            }
        });

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId,
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
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id!,
                    courseId,
                    chapterId,
                }
            });
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[COURSES_CHAPTER_ID_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

//! update the videoUrl with provided newVideoUrl for provided videoId [NOT SURE]
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
                courseSectionId: sectionId,
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