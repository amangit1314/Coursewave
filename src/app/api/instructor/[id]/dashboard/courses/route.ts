import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { generateUid } from "@/helpers/id_helper";

dotenv.config();
const prisma = new PrismaClient();

// create a course[PROBLEM]
export const POST = async (req: NextRequest, { params }: {
    params: {
        id?: string;
    };
}) => {

    const instructorId = params?.id;

    const reqBody = await req.json();
    const { courseTitle, courseImage, courseCreatorName, coursePrice } = reqBody;

    try {
        const courseId = `course_${generateUid().split("-")[0]}`;
        const isFree = coursePrice ? false : true;

        if (!instructorId) {
            return NextResponse.json({ success: false, message: "Invalid Instructor Id" }, { status: 400 });
        }

        if (!courseTitle || !courseImage || !courseCreatorName) {
            return NextResponse.json({ success: false, message: "Course title, image and creator name are required fields ..." }, { status: 400 });
        }

        const createdCourse = await prisma.course.create({
            data: {
                courseId: courseId,
                courseTitle: courseTitle,
                courseImage: courseImage,
                courseCreator: courseCreatorName,
                coursePrice: coursePrice,
                isFree: isFree,
                instructorID: instructorId,
            }
        });

        return NextResponse.json({
            success: true,
            data: createdCourse,
            message: 'Course Successfully Created',
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to create a course ...',
        }, { status: 500 });
    }

}


// CHATGPT SOLUTION
// export const POST = async (req: NextRequest, { params }: {
//     params: {
//         id?: string;
//     };
// }) => {

//     const instructorId = params?.id;

//     const reqBody = await req.json();
//     const { courseTitle, courseImage, courseCreatorName, coursePrice, courseDescription, isFree, dealPrice, discount, courseProgress, isLive } = reqBody;

//     try {
//         if (!instructorId) {
//             return NextResponse.json({ success: false, message: "Invalid Instructor Id" }, { status: 400 });
//         }

//         if (!courseTitle || !courseImage || !courseCreatorName) {
//             return NextResponse.json({ success: false, message: "Course title, image, and creator name are required fields ..." }, { status: 400 });
//         }

//         const courseId = `course_${generateUid().split("-")[0]}`;

//         const createdCourse = await prisma.course.create({
//             data: {
//                 courseId: courseId,
//                 courseTitle: courseTitle,
//                 courseImage: courseImage,
//                 courseCreator: courseCreatorName,
//                 courseDescription: courseDescription,
//                 isFree: isFree,
//                 coursePrice: coursePrice,
//                 dealPrice: dealPrice,
//                 discount: discount,
//                 courseProgress: courseProgress,
//                 isLive: isLive,
//                 // instructor: {
//                 //     connect: { instructorID: instructorId }
//                 // }
//             }
//         });

//         return NextResponse.json({
//             success: true,
//             data: createdCourse,
//             message: 'Course Successfully Created',
//         }, { status: 200 });
//     } catch (error: any) {
//         return NextResponse.json({
//             success: false,
//             error: error.message,
//             message: 'Internal Server Error, Failed to create a course ...',
//         }, { status: 500 });
//     }
// }


// get all created courses by instructor Id[WORKING]
export const GET = async (req: NextRequest, { params }: {
    params: {
        id?: string;
    };
}) => {
    const instructorId = params?.id;
    try {
        const createdCourses = await prisma.course.findMany({
            where: { instructorID: instructorId },
        });
        console.log(`InstructorID :-> ${instructorId}`)

        return NextResponse.json({
            success: true,
            data: createdCourses,
            message: 'Course fetched successfully',
        }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to get created course ...',
        }, { status: 500 });
    }
}; 