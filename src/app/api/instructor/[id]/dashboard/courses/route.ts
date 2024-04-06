import { NextRequest, NextResponse } from "next/server";
import { generateUid } from "@/helpers/id_helper";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

//? create a course [PROBLEM With Image {URL & UPLOAD }]
export const POST = async (req: NextRequest, { params }: {
    params: {
        id: string;
    };
}) => {

    const instructorId = params?.id;

    const reqBody = await req.json();
    const { courseTitle, coursePrice,
        courseCreatorName,
        courseImage,
        courseDescription, courseCategories, isPublished
    } = reqBody;

    try {
        const courseId = `course_${generateUid().split("-")[0]}`;

        if (!instructorId) {
            return NextResponse.json({ success: false, message: "Invalid Instructor Id" }, { status: 400 });
        }

        if (!courseTitle || !coursePrice ) {
            return NextResponse.json({ success: false, message: "Course title and creator name are required fields ..." }, { status: 422 });
        }

        const instructor = await db.instructor.findUnique({
            where: {
                instructorID: instructorId
            }
        })

        if (!instructor) {
            return NextResponse.json({ success: false, message: `[NOT FOUND], Invalid Instructor Id, no instructor found with this instructorId: ${instructorId}` }, { status: 404 });
        }

        //TODO in here need to handle the course image upload backend side
        // const uploadedImage = await uploadOnCloudinary(courseImage);

        // console.log('Uploaded Image Data: ', uploadedImage);

        // if (!uploadedImage || !uploadedImage!.url) {
        //     return NextResponse.json({
        //         success: false,
        //         message: "Error while uploading courseImage ..."
        //     }, { status: 400 })
        // }

        const createdCourse = await db.course.create({
            data: {
                courseId: courseId,
                courseTitle: courseTitle,
                courseImage: courseImage,
                // courseCreator: courseCreatorName,
                // courseDescription: courseDescription,
                // isFree: coursePrice ? false : true,
                coursePrice: coursePrice,
                instructorID: instructorId,
                // courseCategories: courseCategories,
                // instructorName: courseCreatorName,
                isPublished: true,
                // courseDuration,
                // technologiesYouAreGoingToLearn: technologiesYouWillLearn,
                // thisCourseIsFor,
                // prerequisits,
                // whatYouWillLearn,
            }
        });

        return NextResponse.json({
            success: true,
            data: createdCourse,
            message: 'Course Successfully Created',
        }, { status: 200 });
    } catch (error: any) {
        console.error('ERROR inside instructor/id/dashboard/courses: ', error.message)
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Internal Server Error, Failed to create a course ...',
        }, { status: 500 });
    }
}

//* get all created courses by instructorId [WORKING]
export const GET = async (req: NextRequest, { params }: {
    params: {
        id?: string;
    };
}) => {
    const instructorId = params?.id;
    try {
        if (!instructorId) {
            return NextResponse.json({
                success: false,
                message: "Instructor Id not provided ...",
            }, { status: 400 });
        }

        console.log(`InstructorID :-> ${instructorId}`)

        const instructor = await db.instructor.findUnique({
            where: {
                instructorID: instructorId
            },
            select: {
                instructorID: true,
                instructorName: true,
                instructorEmail: true,
                instructorTag: true,
                instructorProfilePicUrl: true,
                aboutInstructor: true,
                createdCourses: true,
            }
        });

        if (!instructor) {
            return NextResponse.json({
                success: false,
                message: "No Instructor found with Provided Id ❌ ..."
            }, { status: 404 });
        }

        console.log(`Created courses by InstructorID:-> ${instructorId}: `, instructor.createdCourses);
        return NextResponse.json({
            success: true,
            data: instructor.createdCourses,
            message: 'Courses fetched successfully ...',
        }, { status: 200 });
    } catch (error: any) {
        console.log('Internal Server error in instructor/[id]/courses: ', error.message);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: `Internal Server Error, Failed to get created courses for this id: ${instructorId} ...`,
        }, { status: 500 });
    }
};