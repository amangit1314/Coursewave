// 'use server';

// import { db } from "@/lib/db";
// import { CourseAttachment, Chapter } from "@prisma/client";

// interface GetChapterProps {
//   userId: string;
//   courseId: string;
//   chapterId: string;
// };

// export const getChapter = async ({
//   userId,
//   courseId,
//   chapterId,
// }: GetChapterProps) => {
//   try {
//     const purchase = await db.purchase.findUnique({
//       where: {
//         userId_courseId: {
//           userId,
//           courseId,
//         }
//       }
//     });

//     const course = await db.course.findUnique({
//       where: {
//         isPublished: true,
//         courseId: courseId,
//       },
//       select: {
//         coursePrice: true,
//       }
//     });

//     const chapter = await db.chapter.findUnique({
//       where: {
//         id: chapterId,
//         isPublished: true,
//       }
//     });

//     if (!chapter || !course) {
//       throw new Error("Chapter or course not found");
//     }

//     let muxData = null;
//     let attachments: CourseAttachment[] = [];
//     let nextChapter: Chapter | null = null;

//     if (purchase) {
//       attachments = await db.courseAttachment.findMany({
//         where: {
//           courseId: courseId
//         }
//       });
//     }

//     if (chapter.isFree || purchase) {
//       muxData = await db.muxData.findUnique({
//         where: {
//           chapterId: chapterId,
//         }
//       });

//       nextChapter = await db.chapter.findFirst({
//         where: {
//           courseId: courseId,
//           isPublished: true,
//           position: {
//             gt: chapter?.position,
//           }
//         },
//         orderBy: {
//           position: "asc",
//         }
//       });
//     }

//     const courseProgress = await db.courseProgress.findUnique({
//       where: {
//         id: courseId,
//         userId,
//         courseId,
//       }
//     });

//     return {
//       chapter,
//       course,
//       muxData,
//       attachments,
//       nextChapter,
//       courseProgress,
//       purchase,
//     };
//   } catch (error) {
//     console.log("[GET_CHAPTER_ERROR]", error);
//     return {
//       chapter: null,
//       course: null,
//       muxData: null,
//       attachments: [],
//       nextChapter: null,
//       userProgress: null,
//       purchase: null,
//     }
//   }
// }

'use server';

import { db } from "@/lib/db";
import { CourseAttachment, Chapter, CourseProgress, MuxData } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    const [course, purchase, chapter, muxData] = await Promise.all([
      db.course.findUnique({
        where: {
          isPublished: true,
          courseId,
        },
        select: {
          coursePrice: true,
        },
      }),

      db.purchase.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      }),

      db.chapter.findUnique({
        where: {
          id: chapterId,
          isPublished: true,
        },
        include: {
          muxData: true,
        },
      }),

      db.muxData.findUnique({
        where: {
          id: chapterId,
        },
      })
    ]);

    if (!chapter || !course) {
      throw new Error("Chapter or course not found");
    }

    let attachments: CourseAttachment[] = [];
    let nextChapter: Chapter | null = null;

    if (purchase) {
      attachments = await db.courseAttachment.findMany({
        where: {
          courseId,
        },
      });
    }

    if (chapter.isFree || purchase) {
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }

    const courseProgress = await db.courseProgress.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    return {
      chapter,
      course,
      muxData: muxData || null, // Handle potential null MuxData
      attachments,
      nextChapter,
      courseProgress,
      purchase,
    };
  } catch (error) {
    console.log("[GET_CHAPTER_ERROR]", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      courseProgress: null,
      purchase: null,
    };
  }
};

