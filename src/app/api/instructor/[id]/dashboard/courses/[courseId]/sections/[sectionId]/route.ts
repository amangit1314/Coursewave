import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

// edit a course section (name, description)
export const PUT = async (req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId: string;
        sectionId: string;
    };
}) => {
    const instructorId = params.id;
    const courseId = params.courseId;
    const sectionId = params.sectionId;

    const reqBody = await req.json();
    const { newCourseSectionTitle, newCourseSectionDescription } = reqBody;

    try {
        if (!instructorId || !courseId || !sectionId) {
            return NextResponse.json({ success: false, message: "Missing parameters" }, { status: 400 });
        }

        const section = await prisma.courseSection.findUnique({
            where: {
                courseSectionId: sectionId
            }
        });

        if (!section) {
            return NextResponse.json({ success: false, message: `Course Section with ID ${sectionId} not found` }, {
                status: 404
            })
        }

        // // either sectionTitle or sectionDescription is required, one of two is required
        // if ((newCourseSectionTitle && !newCourseSectionDescription) || (!newCourseSectionTitle && newCourseSectionDescription)) { }

        const updatedCourseSection = await prisma.courseSection.update({
            where: {
                courseSectionId: sectionId
            },
            data: {
                courseSectionTitle: newCourseSectionTitle,
                courseSectionDescription: newCourseSectionDescription,
            }
        }) 

        return NextResponse.json({
            success: true,
            data: updatedCourseSection,
            message: "Successfully updated ..."
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// delete a course section
export const DELETE = async (req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId: string;
        sectionId: string;
    };
}) => {
    const instructorId = params.id;
    const courseId = params.courseId;
    const sectionId = params.sectionId;

    const reqBody = await req.json();
    const { newCourseSectionTitle, newCourseSectionDescription } = reqBody;

    try {
        if (!instructorId || !courseId || !sectionId) {
            return NextResponse.json({ success: false, message: "Missing parameters" }, { status: 400 });
        }

        const section = await prisma.courseSection.findUnique({
            where: {
                courseSectionId: sectionId
            }
        });

        if (!section) {
            return NextResponse.json({ success: false, message: `Course Section with ID ${sectionId} not found` }, {
                status: 404
            })
        }

        await prisma.courseSection.delete({
            where: {
                courseSectionId: sectionId
            },
        })

        return NextResponse.json({
            success: true,
            message: "Successfully deleted ..."
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
