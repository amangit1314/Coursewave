import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export async function ownsCourse(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const courseId = req.params.courseId || req.body.courseId;

//     console.log("📚 [ownsCourse] Starting ownership check:", {
//       courseId,
//       userId: req.user?.id,
//       method: req.method,
//       url: req.url,
//     });

//     // Method 1: Direct query (more efficient)
//     const course = await prisma.course.findFirst({
//       where: {
//         id: courseId,
//         instructor: {
//           userId: req.user?.id,
//         },
//       },
//       include: {
//         instructor: {
//           select: { userId: true },
//         },
//       },
//     });

//     console.log("📚 [ownsCourse] Course lookup result:", {
//       courseFound: !!course,
//       courseId: course?.id,
//       instructorUserId: course?.instructor?.userId,
//       requestingUserId: req.user?.id,
//     });

//     if (!course) {
//       console.log(
//         "❌ [ownsCourse] Course not found or user not owner, sending 403"
//       );
//       return res.status(403).json({
//         success: false,
//         message: "You don't own this course or course not found",
//       });
//     }

//     console.log("✅ [ownsCourse] Ownership verified, proceeding");
//     next();
//   } catch (error) {
//     console.error("💥 [ownsCourse] Error:", error);
//     next(error);
//   }
// }


export async function ownsCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const courseId = req.params.courseId;
    const sectionId = req.params.sectionId;

    console.log("📚 [ownsCourse] Starting ownership check:", {
      courseId,
      sectionId,
      userId: req.user?.id,
      method: req.method,
    });

    // For section updates, verify the section belongs to the instructor's course
    if (sectionId) {
      const section = await prisma.courseSection.findFirst({
        where: {
          id: sectionId,
          course: {
            instructor: {
              userId: req.user?.id,
            },
          },
        },
        include: {
          course: {
            include: {
              instructor: {
                select: { userId: true },
              },
            },
          },
        },
      });

      console.log("📚 [ownsCourse] Section ownership check:", {
        sectionFound: !!section,
        courseInstructorId: section?.course?.instructor?.userId,
        requestingUserId: req.user?.id,
      });

      if (!section) {
        console.log("❌ [ownsCourse] Section not found or user doesn't own the course");
        return res.status(403).json({
          success: false,
          message: "You don't own this section or section not found",
        });
      }
    } else {
      // For course-level operations
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          instructor: {
            userId: req.user?.id,
          },
        },
        include: {
          instructor: {
            select: { userId: true },
          },
        },
      });

      if (!course) {
        console.log("❌ [ownsCourse] Course not found or user not owner");
        return res.status(403).json({
          success: false,
          message: "You don't own this course or course not found",
        });
      }
    }

    console.log("✅ [ownsCourse] Ownership verified, proceeding");
    next();
  } catch (error) {
    console.error("💥 [ownsCourse] Error:", error);
    next(error);
  }
}