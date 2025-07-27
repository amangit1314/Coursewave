import { db } from "@/lib/db";
import { Chapter } from "@prisma/client";

interface GetChaptersProps {
  courseId: string;
  chapters: Chapter[];
};

export const getChapters = async ({
  courseId,
}: GetChaptersProps): Promise<GetChaptersProps> => {
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

    const chapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      }
    });

    if (!chapters || !course) {
      throw new Error("Chapter or course not found");
    }

    return {
      courseId: courseId,
      chapters,
    };
  } catch (error) {
    console.log("[GET_CHAPTERS]", error);
    return {
      courseId: courseId,
      chapters: [],
    }
  }
}