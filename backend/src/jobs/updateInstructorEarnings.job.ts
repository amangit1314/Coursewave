import cron from "node-cron";
import { prisma } from "../config/prisma";

export const updateInstructorEarningsJob = () => {
  cron.schedule("0 5 * * *", async () => {
    const purchases = await prisma.coursePurchase.findMany({
      where: { status: "COMPLETED" },
    });

    for (const purchase of purchases) {
      const course = await prisma.course.findUnique({
        where: { id: purchase.courseId },
      });
      if (course && course.instructorId) {
        await prisma.instructorEarning.upsert({
          where: { id: `${course.instructorId}-${course.id}` },
          update: { amount: { increment: purchase.amount } },
          create: {
            id: `${course.instructorId}-${course.id}`,
            courseId: course.id,
            instructorId: course.instructorId,
            amount: purchase.amount,
            currency: purchase.currency,
            status: "COMPLETED",
          },
        });
      }
    }

    console.log(
      `[UpdateInstructorEarnings] Processed ${purchases.length} purchases`
    );
  });
};
