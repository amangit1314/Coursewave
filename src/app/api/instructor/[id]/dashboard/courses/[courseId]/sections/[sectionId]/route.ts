import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import dotenv from "dotenv";
dotenv.config();

export const dynamic = 'force-dynamic';

//* edit a course section (name, description)
export const PUT = async (req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
        sectionId?: string;
    };
}) => {
    const instructorId = params?.id;
    const courseId = params?.courseId;
    const sectionId = params?.sectionId;

    const reqBody = await req.json();
    const { newCourseSectionTitle, newCourseSectionDescription } = reqBody;

    try {
        if (!instructorId || !courseId || !sectionId) {
            return NextResponse.json({
                success: false,
                message: "Missing required parameters ..."
            }, { status: 400 });
        }

        const instructor = await db.instructor.findUnique({
            where: {
                instructorID: instructorId,
            }
        })

        if (!instructor) {
            return NextResponse.json({ success: false, message: `No instructor found with this instructorid: ${instructorId} ...` }, { status: 404 });
        }

        const course = await db.course.findUnique({
            where: {
                instructorID: instructorId,
                courseId,
            }
        })

        if (!course) {
            return NextResponse.json({ success: false, message: `No course found with this courseid: ${courseId} ...` }, { status: 404 });
        }

        const section = await db.courseSection.findUnique({
            where: {
                courseSectionId: sectionId
            }
        });

        if (!section) {
            return NextResponse.json({
                success: false,
                message: `Course Section with ID ${sectionId} not found ...`
            }, { status: 404})
        }

        if (section.instructorId !== instructorId) {
            return NextResponse.json({
                success: false,
                message: `You are not authorized to edit this Course section ...`
            }, { status: 403 })
        }

        const updatedCourseSection = await db.courseSection.update({
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
        console.log('ERROR IN instructor/id/dashboard/courses/courseId/sections/sectionId :', error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

//* delete a course section
export const DELETE = async (req: NextRequest, { params }: {
    params: {
        id?: string;
        courseId?: string;
        sectionId?: string;
    };
}) => {

    try {
        const instructorId = params?.id;
        const courseId = params?.courseId;
        const sectionId = params?.sectionId;

        if (!instructorId || !courseId || !sectionId) {
            return NextResponse.json({
                success: false,
                message: "Missing required parameters ..."
            }, { status: 400 });
        }

        const section = await db.courseSection.findUnique({
            where: {
                courseSectionId: sectionId,
            }
        });

        if (!section) {
            return NextResponse.json({
                success: false,
                message: `Course Section with ID ${sectionId} not found`
            }, {status: 404})
        }

        if (section.instructorId !== instructorId) {
            return NextResponse.json({
                success: false,
                message: `You are not authorized to delete this Course section ...`
            }, { status: 403 })
        }

        await db.courseSection.delete({
            where: {
                courseSectionId: sectionId,
                instructorId,
                courseId,
            },
        })

        return NextResponse.json({
            success: true,
            message: "Successfully deleted ..."
        }, { status: 200 });

    } catch (error: any) {
        console.log('ERROR IN instructor/[id]/dashboard/courses/[courseId]/sections/[sectionId] :', error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
