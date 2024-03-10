import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export const PUT = async (req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
        attachmentId?: string;
    }
}) => {
    const instructorId = params?.id;
    const courseId = params.courseId;
    const attachmentId = params.attachmentId;

    try {
        const reqBody = await req.json();
        const { newResourceName, newResourceUrl } = reqBody;

        if (!instructorId || !courseId || !attachmentId) {
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

        const courseAttachment = await db.courseAttachment.findUnique({
            where: {
                id: attachmentId,
                courseId,
            }
        })

        if (!courseAttachment) {
            return NextResponse.json({
                success: false,
                error: `No attachment with this attachmentId: ${attachmentId} does'nt exists ...`,
            }, { status: 400 });
        }

        const updatedCourseAttachment = await db.courseAttachment.update({
            where: {
                id: attachmentId,
                courseId,
            },
            data: {
                name: newResourceName,
                url: newResourceUrl,
            }
        });

        return NextResponse.json({
            success: true,
            data: updatedCourseAttachment,
            message: 'Attachment updated successfully ✔️ ...',
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

export const DELETE = async (req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
        attachmentId?: string;
    }
}) => {
    const instructorId = params?.id;
    const courseId = params.courseId;
    const attachmentId = params.attachmentId;

    try {
        const reqBody = await req.json();
        const { newResourceName, newResourceUrl } = reqBody;

        if (!instructorId || !courseId || !attachmentId) {
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

        const courseAttachment = await db.courseAttachment.findUnique({
            where: {
                id: attachmentId,
                courseId,
            }
        })

        if (!courseAttachment) {
            return NextResponse.json({
                success: false,
                error: `No attachment with this attachmentId: ${attachmentId} does'nt exists ...`,
            }, { status: 400 });
        }

        await db.courseAttachment.delete({
            where: {
                id: attachmentId,
                courseId,
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Attachment deleted successfully ✔️ ...',
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