import cron from "node-cron";
import { prisma } from "../config/prisma";
import { TokenStatus } from "@prisma/client";

export const cleanupExpiredTokensJob = () => {
  cron.schedule("0 3 * * *", async () => {
    const now = new Date();
    const result = await prisma.token.updateMany({
      where: {
        status: TokenStatus.ACTIVE,
        expiresAt: { lt: now },
      },
      data: { status: TokenStatus.EXPIRED },
    });

    console.log(`[CleanupExpiredTokens] Marked ${result.count} tokens as expired`);
  });
};
