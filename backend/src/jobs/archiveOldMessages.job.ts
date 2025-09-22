import cron from "node-cron";
import { prisma } from "../config/prisma";

export const archiveOldMessagesJob = () => {
  cron.schedule("0 4 * * *", async () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    await prisma.message.updateMany({
      where: { createdAt: { lt: oneMonthAgo }, isPinned: false },
      data: { content: "[Archived]" },
    });

    console.log("[ArchiveOldMessages] Archived old messages");
  });
};
