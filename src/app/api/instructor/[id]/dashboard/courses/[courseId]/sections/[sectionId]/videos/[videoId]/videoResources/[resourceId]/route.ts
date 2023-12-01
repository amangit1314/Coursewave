import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// import { generateUid } from "@/helpers/id_helper";

export const PUT = async (req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
        sectionId?: string;
        videoId?: string;
        resourceId?: string;
    }
}) => {
    const videoId = params.videoId;
    const instructorId = params?.id;
    const courseId = params.courseId;
    const courseSectionId = params.sectionId;
    const resourceId = params.resourceId;
    const reqBody = await req.json();
    const { newResourceUrl, newResourceDuration, newResourceType } = reqBody;
    let videoResource, updatedResource;
    // const resourceId = `${videoId}_resource_${generateUid().split('-')[0]}`;

    try {
        if (!instructorId || !courseId) {
            return NextResponse.json({ success: false, message: "Invalid Instructor/course Id" }, { status: 400 });
        }

        const youAreInstructor = await prisma.courseSection.findUnique({
            where: {
                courseSectionId: courseSectionId,
                instructorId: instructorId,
            }
        })

        let isInstructor = youAreInstructor ? true : false;

        //!check if you are instructor of this course
        if (isInstructor) {
            // check for missing required fields
            if (!newResourceUrl || !newResourceType || !newResourceDuration) {
                return NextResponse.json({
                    message: "Missing required fields"
                }, { status: 422 });
            }

            //! check wheteher the video with the videoId exits or not
            const video = await prisma.video.findUnique({
                where: { videoId }
            });

            //! if no video found return 404 status code
            if (!video) {
                return NextResponse.json(
                    { message: `Video not found with videoId:${videoId}` },
                    { status: 404 }
                );
            }

            //* then i am fethiching the existing video resource with the videoId
            const existingVideoResource = await prisma.videoResources.findUnique({
                where: { resourceId, videoId },
            });

            //* to update video resourcesUrl array i am creating an empty array then i will append new resourceUrl in this newly created array
            let updatedResourcesUrl = [];

            //? if video resource is already exits
            if (existingVideoResource) {
                //* If the video note already exists, add the new resourceUrl to the existing array
                updatedResourcesUrl = [...existingVideoResource.resourcesUrl, newResourceUrl];

                //* Update the existing video note with the new resourcesUrl array
                updatedResource = await prisma.videoResources.update({
                    where: { resourceId, videoId },
                    data: { resourcesUrl: updatedResourcesUrl },
                });
            }

            //! If the video resource doesn't exist,
            else {
                return NextResponse.json(
                    { message: `Video resource not found with videoId:${videoId}` },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: updatedResource || videoResource,
                message: 'Resource successfully updated 🤘 ...',
            }, { status: 200 });
        } else {
            return NextResponse.json({
                success: false,
                error: 'You are not authorized to update video resources',
                message: 'Unauthorized ⚠ ...',
            }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal server error 🤬❗⚠ ...',
        }, { status: 500 });
    }
}

export const DELETE = async (req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
        sectionId?: string;
        videoId?: string;
        resourceId?: string;
    }
}) => {
    const videoId = params.videoId;
    const instructorId = params?.id;
    const courseId = params.courseId;
    const courseSectionId = params.sectionId;
    const resourceId = params.resourceId;

    try {
        if (!instructorId || !courseId) {
            return NextResponse.json({ success: false, message: "Invalid Instructor/course Id" }, { status: 400 });
        }

        const youAreInstructor = await prisma.courseSection.findUnique({
            where: {
                courseSectionId: courseSectionId,
                instructorId: instructorId,
            }
        })

        let isInstructor = youAreInstructor ? true : false;

        //!check if you are instructor of this course
        if (isInstructor) {

            if (!resourceId) {
                return NextResponse.json({
                    message: " ResourceId not found ..."
                }, { status: 404 });
            }

            //! check wheteher the video with the videoId exits or not
            const video = await prisma.video.findUnique({
                where: { videoId }
            });

            //! if no video found return 404 status code
            if (!video) {
                return NextResponse.json(
                    { message: `Video not found with videoId:${videoId}` },
                    { status: 404 }
                );
            }

            //* then i am fethiching the existing video resource with the videoId
            const existingVideoResource = await prisma.videoResources.findUnique({
                where: { resourceId, videoId },
            });

            //? if video resource is already exits
            if (existingVideoResource) {

                //* Update the existing video note with the new resourcesUrl array
                await prisma.videoResources.delete({
                    where: {
                        resourceId,
                        videoId,
                    },
                });
            }

            //! If the video resource doesn't exist,
            else {
                return NextResponse.json(
                    { message: `Video resource not found with videoId:${videoId} & resourceId:${resourceId}` },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: `Resource with resourceId:${resourceId} successfully deleted ...`,
            }, { status: 200 });
        } else {
            return NextResponse.json({
                success: false,
                error: 'You are not authorized to update video resources',
                message: 'Unauthorized ⚠ ...',
            }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal server error 🤬❗⚠ ...',
        }, { status: 500 });
    }
}