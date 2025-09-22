import cron from "node-cron";
import { prisma } from "../config/prisma";

export const courseProgressUpdateJob = () => {
  cron.schedule("0 1 * * *", async () => {
    const progresses = await prisma.courseProgress.findMany({
      where: { isCompleted: false },
      include: { ChapterProgress: true },
    });

    for (const cp of progresses) {
      const allChaptersCompleted = cp.ChapterProgress.every(ch => ch.isCompleted);
      if (allChaptersCompleted) {
        await prisma.courseProgress.update({
          where: { id: cp.id },
          data: { isCompleted: true },
        });
      }
    }

    console.log(`[CourseProgressUpdate] Checked ${progresses.length} course progresses`);
  });
};
