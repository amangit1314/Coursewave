import cron from "node-cron";
import { prisma } from "../config/prisma";
import { SessionStatus } from "@prisma/client";

export const sessionStatusUpdateJob = () => {
  cron.schedule("*/15 * * * *", async () => {
    const now = new Date();

    // Update upcoming to ongoing
    await prisma.session.updateMany({
      where: {
        status: SessionStatus.UPCOMING,
        scheduledAt: { lte: now },
        endsAt: { gt: now },
      },
      data: { status: SessionStatus.ONGOING },
    });

    // Update ongoing to completed
    await prisma.session.updateMany({
      where: {
        status: SessionStatus.ONGOING,
        endsAt: { lte: now },
      },
      data: { status: SessionStatus.COMPLETED },
    });

    console.log(`[SessionStatusUpdate] Sessions updated`);
  });
};
