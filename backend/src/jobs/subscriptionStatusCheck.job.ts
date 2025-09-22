import cron from "node-cron";
import { prisma } from "../config/prisma";
import { SubscriptionStatus } from "@prisma/client";

export const subscriptionStatusCheckJob = () => {
  cron.schedule("0 0 * * *", async () => {
    // Runs daily at midnight
    const now = new Date();

    const expiredSubs = await prisma.userSubscription.findMany({
      where: {
        currentPeriodEnd: { lt: now },
        status: SubscriptionStatus.ACTIVE,
      },
    });

    for (const sub of expiredSubs) {
      await prisma.userSubscription.update({
        where: { id: sub.id },
        data: { status: SubscriptionStatus.PAST_DUE },
      });
    }

    console.log(`[SubscriptionStatusCheck] Updated ${expiredSubs.length} subscriptions`);
  });
};
