/**
 * Creates an enrollment for a user in a course.
 * If the enrollment already exists, it will not throw an error.
 */
// export async function createEnrollment(userId: string, courseId: string) {
//   try {
//     return await prisma.enrollment.create({
//       data: {
//         userId,
//         courseId,
//         status: 'ACTIVE', // default status
//       },
//     });
//   } catch (error: any) {
//     // Handle unique constraint violation (user already enrolled)
//     if (error.code === 'P2002') {
//       // Enrollment already exists, return existing enrollment
//       return await prisma.enrollment.findUnique({
//         where: {
//           userId_courseId: {
//             userId,
//             courseId,
//           },
//         },
//       });
//     }
//     throw error;
//   }
// }

// Assume in enrollmentService.ts or similar

import { prisma } from "../../config/prisma";
// import { sendEnrollmentSuccessEmail } from "../email/emailService"; // example

export const activateEnrollmentAfterPayment = async (
  userId: string,
  courseId: string
) => {
  // 1. Find the user's pending enrollment for this course
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      courseId,
      status: "PENDING",
    },
  });

  if (!enrollment) {
    console.warn(
      `No PENDING enrollment found for user ${userId}, course ${courseId}`
    );
    return null;
  }

  // 2. Update status to ACTIVE, add startDate if not set
  const now = new Date();
  const updated = await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      status: "ACTIVE",
      startDate: now, // optional: set/overwrite start date
      // Optionally: update other fields, e.g., progress/reset, etc.
    },
  });

  // 3. Send email/notification (asynchronous)
  // sendEnrollmentSuccessEmail(userId, courseId).catch(console.error);

  // 4. Optionally: notify frontend (WebSocket/event/etc.)

  return updated;
};
