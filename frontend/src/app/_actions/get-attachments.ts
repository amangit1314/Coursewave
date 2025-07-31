import { db } from "@/lib/db";
import { CourseAttachment } from "@prisma/client";

interface GetCourseAttachmentsProps {
  courseId: string;
  courseAttachments: CourseAttachment[];
};

export const getCourseAttachments = async ({
  courseId,
}: GetCourseAttachmentsProps): Promise<GetCourseAttachmentsProps> => {
  try {

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        courseId: courseId,
      },
      select: {
        coursePrice: true,
      }
    });

    const courseAttachments = await db.courseAttachment.findMany({
      where: {
        courseId: courseId,
      }
    });

    if (!courseAttachments || !course) {
      throw new Error("Attachments or course not found");
    }

    return {
      courseId: courseId,
      courseAttachments,
    };
  } catch (error) {
    console.log("[GET_ATTACHMENTS_ERROR]", error);
    return {
      courseId: courseId,
      courseAttachments: [],
    }
  }
}