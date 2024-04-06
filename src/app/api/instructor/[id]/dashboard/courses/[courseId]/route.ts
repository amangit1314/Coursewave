import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

// Get details of a course with particular course id [DONE]
export const GET = async (req: NextRequest, { params }: {
    params: {
        courseId?: string;
    };
}) => {
    const courseId = params.courseId;
    try {
        if (!courseId) {
            return NextResponse.json({
                success: false,
                message: "Invalid Instructor and/or course Id"
            }, { status: 400 });
        }

        const response = await db.course.findUnique({
            where: {
                courseId
            }
        });

        return NextResponse.json({
            success: true,
            data: response,
            message: `Details of Course with courseId: ${courseId}, Successfully Fetched`,
        }, { status: 200 });
    }
    catch (error: any) {
        console.log('ERROR IN instructor/id/dashboard/courses/courseId :', error.message);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: `Internal Server Error, Failed to fetch details of  course with courseId:${courseId} ...`,
        }, { status: 500 });
    }
}

// delete a course [DONE]
export const DELETE = async (req: NextRequest, { params }: {
    params: {
        id: string;
        courseId: string;
    };
}) => {
    const courseId = params.courseId;
    const instructorId = params.id;

    try {
        if (!instructorId || !courseId) {
            return NextResponse.json({
                success: false,
                message: "Invalid Instructor and/or course Id"
            }, { status: 400 });
        }

        await db.course.delete({
            where: {
                courseId: courseId,
                instructorID: instructorId,
           }
        });

        return NextResponse.json({
            success: true,
            message: `Course with courseId: ${courseId}, Successfully Deleted`,
        }, { status: 200 });
    } catch (error: any) {
        console.log('ERROR IN instructor/id/dashboard/courses/courseId :', error.message);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to delete a course ...',
        }, { status: 500 });
    }
}

// edit a course-details [TODO]
// export const POST = async (req: NextRequest, { params }: {
//     params: {
//         id: string;
//         courseId: string;
//     };
// }) => {
//     const instructorId = params?.id!;
//     const courseId = params?.courseId!;

//     const reqBody = await req.json();
//     const {
//         newCourseTitle,
//         newCourseDescription,
//         newCourseImage,
//         newCoursePrice,
//         newDealPrice,
//         newDiscount,
//         newCourseCategories,

//     } = reqBody;

//     try {
//         if (!instructorId || !courseId) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Invalid Instructor and/or course Id"
//             }, { status: 400 });
//         }

//         const createdCourses = db.courseSection.findMany({
//             where: { instructorId: instructorId },
//         });

//         return NextResponse.json({
//             success: true,
//             data: createdCourses,
//             message: 'Course fetched successfully',
//         }, { status: 200 });
//     } catch (error: any) {
//         console.log('ERROR IN updating course inside instructor/id/dashboard/courses/courseId :', error.message);
//         return NextResponse.json({
//             success: false,
//             error: error.message,
//             message: 'Internal Server Error, Failed to update course ...',
//         }, { status: 500 });
//     }
// };

// edit a course-details
export const POST = async (req: NextRequest, { params }: { params: { id: string; courseId: string; } }) => {
    const instructorId = params?.id!;
    const courseId = params?.courseId!;

    const reqBody = await req.json();
    // Destructure only properties with values in reqBody
    const {
        newCourseTitle,
        newCourseDescription,
        newCourseImage,
        newCoursePrice,
        newDealPrice,
        newDiscount,
        newCourseCategories,
        newCourseDuration,
        newTechnologies,
        newThisCourseIsForPoints,
        newPrerequisits,
        newWhatYouWillLearnPoints,
        newInstructorName,
    } = reqBody;

    try {
        if (!instructorId || !courseId) {
            return NextResponse.json({
                success: false,
                message: "Invalid Instructor and/or course Id",
            }, { status: 400 });
        }

        // Use Prisma to update the course
        const updatedCourse = await db.course.update({
            where: { courseId }, // Filter by courseId
            data: {
                courseTitle: newCourseTitle, // Update only if provided in reqBody
                courseDescription: newCourseDescription,
                courseImage: newCourseImage,
                coursePrice: newCoursePrice,
                dealPrice: newDealPrice,
                discount: newDiscount,
                courseCreator: newInstructorName,
                courseCategories: newCourseCategories,
                courseDuration: newCourseDuration,
                technologiesYouAreGoingToLearn: newTechnologies,
                thisCourseIsFor: newThisCourseIsForPoints,
                prerequisits: newPrerequisits,
                whatYouWillLearn: newWhatYouWillLearnPoints,
                // Update other properties as needed
            },
        });

        if (!updatedCourse) {
            return NextResponse.json({
                success: false,
                message: "Course update failed. Course not found.",
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Course updated successfully ...',
            data: updatedCourse,
        }, { status: 200 });
    } catch (error: any) {
        console.error('ERROR IN updating course inside instructor/id/dashboard/courses/courseId:', error.message);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to update course ...',
        }, { status: 500 });
    }
};
