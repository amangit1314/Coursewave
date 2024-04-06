import { NextRequest, NextResponse } from "next/server";
import { generateUid } from "@/helpers/id_helper";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest, { params }: {
    params: {
        id: string;
        courseId: string;
    }
}) => {
    const instructorId = params?.id;
    const courseId = params?.courseId;

    try {
        const reqBody = await req.json();
        const { resourceName, resourceUrl } = reqBody;
        const attachmentId = `${courseId}_attachment_${generateUid().split('-')[0]}`;

        if (!instructorId || !courseId || !resourceName || !resourceUrl) {
            return NextResponse.json({
                message: "Missing required fields ..."
            }, { status: 422 });
        }

        const instructor = await db.instructor.findUnique({
            where: {
                instructorID: instructorId,
            }
        })

        if (!instructor) {
            return NextResponse.json({
                success: false,
                error: 'You are not authorized to create a course resources',
                message: 'Unauthorized ⚠ ...',
            }, { status: 403 });
        }

        const courseExistingAttachment = await db.courseAttachment.findFirst({
            where: {
                // id: attachmentId,
                name: resourceName,
                courseId: courseId,
            }
        })

        if (courseExistingAttachment) {
            return NextResponse.json({
                success: false,
                error: `Attachment with this resourceName: ${resourceName} already exists`,
            }, { status: 400 });
        }

        const courseAttachment = await db.courseAttachment.create({
            data: {
                id: attachmentId,
                name: resourceName,
                url: resourceUrl,
                instructorId: instructorId,
                courseId: courseId,
            }
        });

        return NextResponse.json({
            success: true,
            data: courseAttachment,
            message: 'Resource successfully created 🤘 ...',
        }, { status: 200 });

    } catch (error: any) {
        console.log(`Error in instructor/[id]/dashboard/courses/[courseId]/attachments: ${error.message}`)
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal server error 🤬❗⚠ ...',
        }, { status: 500 });
    }
}