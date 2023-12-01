import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { generateUid } from "@/helpers/id_helper";

export const POST = async (req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
        sectionId?: string;
        videoId?: string;
    }
}) => {
    const videoId = params.videoId;
    const instructorId = params?.id;
    const courseId = params.courseId;
    const courseSectionId = params.sectionId;

    const reqBody = await req.json();
    const { resourceType, resourceUrl, duration } = reqBody;

    let videoResource, updatedResource;
    const resourceId = `${videoId}_resource_${generateUid().split('-')[0]}`;

    try {

        const youAreInstructor = await prisma.courseSection.findUnique({
            where: {
                courseId,
                courseSectionId: courseSectionId,
                instructorId: instructorId,
            }
        })

        let isInstructor = youAreInstructor ? true : false;

        if (isInstructor) {
            // check for missing required fields
            if (!resourceType || !resourceUrl || !duration) {
                return NextResponse.json({
                    message: "Missing required fields"
                }, { status: 422 });
            }

            //! check wheteher the video with the videoId exits or not
            const video = await prisma.video.findUnique({
                where: {
                    videoId
                }
            });

            //! if no video found return 404 status code
            if (!video) {
                return NextResponse.json(
                    { message: `Video not found with videoId:${videoId}` },
                    { status: 404 }
                );
            }

            //* so first i am creating videoResource with empty resourcesUrls array
            videoResource = await prisma.videoResources.create({
                data: {
                    resourceId,
                    videoId,
                    resourceType: resourceType,
                    resourcesUrl: [],
                    durationString: duration,
                }
            });

            //* then i am fethiching the existing video resource with the videoId
            const existingVideoResource = await prisma.videoResources.findUnique({
                where: {
                    resourceId,
                    videoId,
                },
            });

            //* to update video resourcesUrl array i am creating an empty array then i will append new resourceUrl in this newly created array
            let updatedResourcesUrl = [];

            //? if video resource is already exits
            if (existingVideoResource) {
                //* If the video note already exists, add the new resourceUrl to the existing array
                updatedResourcesUrl = [...existingVideoResource.resourcesUrl, resourceUrl];

                //* Update the existing video note with the new resourcesUrl array
                updatedResource = await prisma.videoResources.update({
                    where: {
                        resourceId,
                        videoId,
                    },
                    data: {
                        resourcesUrl: updatedResourcesUrl,
                    },
                });
            }

            //? If the video note doesn't exist,
            else {
                //* If the video note doesn't exist, create a new one with the initial resourcesUrl array
                updatedResourcesUrl = [resourceUrl];

                const videoResource = await prisma.videoResources.create({
                    data: {
                        resourceId,
                        videoId,
                        resourceType,
                        resourcesUrl: updatedResourcesUrl,
                        durationString: duration,
                    },
                });
            }
        } else {
            return NextResponse.json({
                success: false,
                error: 'You are not authorized to create a video resources',
                message: 'Unauthorized ⚠ ...',
            }, { status: 400 });
        }
        
        return NextResponse.json({
            success: true,
            data: updatedResource || videoResource,
            message: 'Resource successfully created 🤘 ...',
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal server error 🤬❗⚠ ...',
        }, { status: 500 });
    }
}