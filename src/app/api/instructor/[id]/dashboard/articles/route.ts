import { NextRequest, NextResponse } from "next/server";
import { generateUid } from "@/lib/helpers/id_helper";
import { db } from "@/lib/db";
import dotenv from "dotenv";
dotenv.config();

export const dynamic = 'force-dynamic';

//? create an article
export const POST = async (req: NextRequest, { params }: {
  params: {
    id?: string;
  };
}) => {

  const instructorId = params?.id;

  const reqBody = await req.json();
  const { title, , courseCreatorName, coursePrice, courseDescription, courseCategories, instructorName, isPublished, courseDuration, technologiesYouWillLearn, thisCourseIsFor, prerequisits, whatYouWillLearn } = reqBody;

  try {
    const articleId = `article_${generateUid().split("-")[0]}`;

    if (!instructorId) {
      return NextResponse.json({ success: false, message: "Invalid Instructor Id" }, { status: 400 });
    }

    if (!courseTitle || !courseImage || !courseCreatorName) {
      return NextResponse.json({ success: false, message: "Course title, image and creator name are required fields ..." }, { status: 422 });
    }

    //TODO in here need to handle the course image upload backend side

    const createdCourse = await db.course.create({
      data: {
        courseId: courseId,
        courseTitle: courseTitle,
        courseImage: courseImage,
        courseCreator: courseCreatorName,
        courseDescription: courseDescription,
        isFree: coursePrice ? false : true,
        coursePrice: coursePrice,
        instructorID: instructorId,
        courseCategories: courseCategories,
        instructorName,
        isPublished,
        courseDuration,
        technologiesYouAreGoingToLearn: technologiesYouWillLearn,
        thisCourseIsFor,
        prerequisits,
        whatYouWillLearn,
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