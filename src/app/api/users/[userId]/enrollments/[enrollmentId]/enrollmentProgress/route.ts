import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Fetch course progress for a given enrollmentId
export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string; enrollmentId: string } },
) => {
  const userId = params?.userId!;
  const enrollmentId = params?.enrollmentId!;

  try {
    // Fetch the enrollment for the user and enrollmentId
    const enrollment = await db.enrollment.findFirst({
      where: {
        enrollmentId: enrollmentId,
        userId: userId,
      },
      include: {
        courseProgress: true, // Include the course progress
      },
    });

    if (!enrollment || !enrollment.courseProgress) {
      return NextResponse.json(
        {
          success: false,
          status: "NOT_FOUND",
          message: "Enrollment or course progress not found",
        },
        { status: 404 },
      );
    }

    // Fetch the course progress
    const courseProgress = enrollment.courseProgress;

    return NextResponse.json(
      {
        success: true,
        status: "OK",
        message: "Course progress retrieved successfully",
        progress: {
          progress: courseProgress.progress,
          completedPercentage: courseProgress.completedPercentage,
          isCompleted: courseProgress.isCompleted,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        status: "ERROR",
        error: error.message,
        message: "Internal server error while retrieving course progress...",
      },
      { status: 500 },
    );
  }
};

// Update progress when marking a chapter as completed
export const PUT = async (
  req: NextRequest,
  { params }: { params: { userId: string; enrollmentId: string } },
) => {
  const userId = params?.userId!;
  const enrollmentId = params?.enrollmentId!;
  const { chapterId, completed } = await req.json(); // `chapterId` and `completed` from request body

  try {
    // Fetch the enrollment for the user and enrollmentId
    const enrollment = await db.enrollment.findFirst({
      where: {
        enrollmentId: enrollmentId,
        userId: userId,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        {
          success: false,
          status: "NOT_FOUND",
          message: "User not enrolled in this course",
        },
        { status: 404 },
      );
    }

    // Update or create chapter progress for the user
    await db.chapterProgress.upsert({
      where: {
        enrollmentId_chapterId: {
          enrollmentId: enrollment.enrollmentId,
          chapterId: chapterId,
        },
      },
      update: {
        isCompleted: completed, // Mark the chapter as completed or not
      },
      create: {
        enrollmentId: enrollment.enrollmentId,
        courseProgressId: enrollment.courseProgressId,
        chapterId: chapterId,
        isCompleted: completed, // Create if not found
      },
    });

    // Recalculate the total number of chapters in the course
    const totalChapters = await db.chapter.count({
      where: { courseId: enrollment.courseId },
    });

    // Count the number of completed chapters for the user
    const completedChapters = await db.chapterProgress.count({
      where: {
        enrollmentId: enrollment.enrollmentId,
        isCompleted: true,
      },
    });

    // Calculate the new course progress as a percentage
    const updatedCourseProgress = (completedChapters / totalChapters) * 100;

    // Update the user's course progress in CourseProgress
    const courseProgress = await db.courseProgress.update({
      where: {
        enrollmentId: enrollment.enrollmentId,
      },
      data: {
        progress: updatedCourseProgress, // Update the course progress in percentage
        completedPercentage: Math.round(updatedCourseProgress), // Store rounded percentage
        isCompleted: updatedCourseProgress === 100, // If progress is 100%, mark as completed
      },
    });

    return NextResponse.json(
      {
        success: true,
        status: "OK",
        message:
          "Chapter marked as completed and course progress updated successfully",
        progress: courseProgress,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        status: "ERROR",
        error: error.message,
        message: "Internal server error while updating course progress...",
      },
      { status: 500 },
    );
  }
};
