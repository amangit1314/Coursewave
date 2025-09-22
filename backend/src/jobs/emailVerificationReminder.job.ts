import cron from "node-cron";
import { prisma } from "../config/prisma";
import EmailService from "../core/services/emailService";

export const emailVerificationReminderJob = () => {
  cron.schedule("0 9 * * *", async () => {
    // Runs every day at 9 AM
    try {
      const users = await prisma.user.findMany({
        where: { isEmailVerified: false },
      });

      for (const user of users) {
        const success = await EmailService.sendEmailVerification(
          user.id,
          user.email,
          user.name || "Learner"
        );

        if (success) {
          console.log(
            `[EmailVerificationReminder] Sent verification email to ${user.email}`
          );
        } else {
          console.error(
            `[EmailVerificationReminder] Failed to send email to ${user.email}`
          );
        }
      }

      console.log(
        `[EmailVerificationReminder] Processed ${users.length} users`
      );
    } catch (error) {
      console.error("[EmailVerificationReminder] Error fetching users:", error);
    }
  });
};
