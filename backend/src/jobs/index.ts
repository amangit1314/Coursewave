import { emailVerificationReminderJob } from "./emailVerificationReminder.job";
import { subscriptionStatusCheckJob } from "./subscriptionStatusCheck.job";
import { sessionStatusUpdateJob } from "./sessionStatusUpdate.job";
import { cleanupExpiredTokensJob } from "./cleanupExpiredTokens.job";
import { archiveOldMessagesJob } from "./archiveOldMessages.job";
import { updateInstructorEarningsJob } from "./updateInstructorEarnings.job";
import { courseProgressUpdateJob } from "./courseProgressUpdate.job";

export const initJobs = () => {
  emailVerificationReminderJob();
  subscriptionStatusCheckJob();
  courseProgressUpdateJob();
  sessionStatusUpdateJob();
  cleanupExpiredTokensJob();
  archiveOldMessagesJob();
  updateInstructorEarningsJob();
};
