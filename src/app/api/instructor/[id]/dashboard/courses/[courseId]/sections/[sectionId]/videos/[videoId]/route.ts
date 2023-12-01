import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//* get video information for provided videoId
export async function GET(req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
        sectionId?: string;
        videoId?: string;
    }
}) {
    const videoId = params.videoId;
    const reqBody = await req.json();
    const { newVideoUrl } = reqBody;

    try {

        const video = await prisma.video.findUnique({
            where: {
                videoId
            },
        })

        if (!video) {
            return NextResponse.json({ message: "No video found with this videoId 😐 ..." }, { status: 404 });
        }

        if (!newVideoUrl) {
            return NextResponse.json({ message: "Please provide the new URL to update" }, { status: 400 });
        }

        const videoInfo = await prisma.video.findUnique({
            where: {
                videoId
            },
        })

        return NextResponse.json({
            status: true,
            data: videoInfo,
            message: `Video info for videoId:${videoId} successfull accessed 🤘...`
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            status: false,
            error: error.message,
            message: `Failed to access video info for videoId:${videoId} ❗`
        }, { status: 500 })
    }
}

//* update the videoUrl with provided newVideoUrl for provided videoId
export async function PUT(req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
        sectionId?: string;
        videoId: string;
    };
}) {
    const videoId = params.videoId;
    const reqBody = await req.json();
    const { newVideoUrl } = reqBody;

    try {
        const video = await prisma.video.findUnique({
            where: {
                videoId
            },
        })

        if (!video) {
            return NextResponse.json({ message: "No video found with this videoId 😐 ..." }, { status: 404 });
        }

        if (!newVideoUrl) {
            return NextResponse.json({ message: "Please provide the new URL to update" }, { status: 400 });
        }

        const updatedVideo = await prisma.video.update({
            where: {
                videoId
            },
            data: {
                videoUrl: newVideoUrl,
            }
        })

        return NextResponse.json({
            status: true,
            data: updatedVideo,
            message: 'successfull ...'
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            status: false,
            error: error.message
        }, { status: 500 })
    }
}

//* update the videoTitle and videoDescription with the provided newVideoTitle, newVideoDescription for provided videoId
export async function PATCH(req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
        sectionId?: string;
        videoId: string;
    };
}) {
    try {
        const videoId = params.videoId;
        const courseId = params.courseId;
        const sectionId = params.sectionId;
        const instructorId = params.id;

        const reqBody = await req.json();
        const { newvideoTitle, newVideoDescription } = reqBody;

        const video = await prisma.video.findUnique({
            where: {
                videoId,
            },
        })

        if (!video) {
            return NextResponse.json({ message: "No video found with this videoId 😐 ..." }, { status: 404 });
        }

        const updatedVideo = await prisma.video.update({
            where: {
                videoId,
                courseId: courseId,
                courseSectionId: sectionId,
            },
            data: {
                videoTitle: newvideoTitle,
                videoDescription: newVideoDescription,
            }
        });

        return NextResponse.json({
            status: true,
            data: updatedVideo,
            message: 'video successfully deleted ...'
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            status: false,
            error: error.message
        }, { status: 500 })
    }
}

//* delete the video with the provided videoId
export async function DELETE(req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
        sectionId?: string;
        videoId: string;
    }
}) {
    const videoId = params.videoId;

    try {
        const video = await prisma.video.findUnique({
            where: {
                videoId
            },
        })

        if (!video) {
            return NextResponse.json({ message: "No video found with this videoId 😐 ..." }, { status: 404 });
        }

        const updatedVideo = await prisma.video.delete({
            where: {
                videoId
            },
        })

        return NextResponse.json({
            status: true,
            data: updatedVideo,
            message: 'video successfully deleted ...'
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            status: false,
            error: error.message
        }, { status: 500 })
    }
}